// server.js
const path = require("path");
const fs = require('fs').promises; // <-- NEW: Import Node's file system module with promises
const { query, initializeDatabase } = require("./db");
const dotenv = require("dotenv");

// Load environment variables first
dotenv.config();

// Enhanced Logging Utility (simple console wrapper)
const logger = {
    info: (...args) => console.log("[INFO]", ...args),
    warn: (...args) => console.warn("[WARN]", ...args),
    error: (...args) => console.error("[ERROR]", ...args),
    debug: (...args) => process.env.NODE_ENV !== 'production' && console.log("[DEBUG]", ...args),
};

logger.info("🧪 Starting up server.js...");
logger.info("Current directory:", __dirname); // This will be /opt/render/project/src on Render

const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");

// Check for critical environment variables at startup
if (!process.env.STRIPE_SECRET_KEY) {
    logger.error("❌ STRIPE_SECRET_KEY is NOT LOADED. Please check your .env file.");
    process.exit(1); // Exit if critical keys are missing
}
if (!process.env.STRIPE_WEBHOOK_SECRET) {
    logger.error("❌ STRIPE_WEBHOOK_SECRET is NOT LOADED. Please check your .env file.");
    process.exit(1);
}
if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    logger.warn("⚠️ EMAIL_USER or EMAIL_PASS is NOT LOADED. Email functionality may be impaired.");
    // Don't exit, as email is not strictly critical for basic server operation, but log severe warning.
}
if (!process.env.YOUR_DOMAIN) {
    logger.warn("⚠️ YOUR_DOMAIN is not set in .env. Stripe success/cancel URLs might be incorrect.");
}

logger.info("Stripe Secret Key:", process.env.STRIPE_SECRET_KEY ? "Loaded" : "NOT LOADED - Check .env");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const bcrypt = require("bcrypt");

const app = express();

// Apply CORS middleware - always before routes that need to be accessible cross-origin
app.use(cors());

// --- CRITICAL FIX FOR STRIPE WEBHOOK ---
// This middleware MUST come BEFORE any global express.json() or express.urlencoded()
// because Stripe's webhook needs the raw body.
// The /webhook route will use express.raw()
app.post("/webhook", express.raw({ type: "application/json" }), async (req, res) => {
    logger.info('--- Webhook endpoint received a request! ---');
    const sig = req.headers["stripe-signature"];

    let event;

    try {
        // req.body is now the raw buffer/string because express.raw() ran for this specific route
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
        logger.info(`[STRIPE] Webhook: Event constructed successfully. Type: ${event.type}`);
    } catch (err) {
        logger.error("❌ [STRIPE] Webhook signature verification failed.", err.message);
        logger.error("       Raw Body (truncated):", req.body ? req.body.toString().substring(0, 500) + '...' : 'No body');
        logger.error("       Signature Header:", sig);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle different Stripe event types
    switch (event.type) {
        case "checkout.session.completed":
            logger.info('[STRIPE] Webhook: Received checkout.session.completed event.');
            const session = event.data.object;
            const email = session.customer_details?.email;
            logger.info(`[STRIPE] Webhook: Processing session for email: ${email}`);

            try {
                const lineItems = await stripe.checkout.sessions.listLineItems(session.id, { limit: 100 });
                let orderItemsText = '';
                if (lineItems.data && lineItems.data.length > 0) {
                    orderItemsText = lineItems.data.map(item => {
                        const productName = item.description;
                        const unitAmount = (item.price.unit_amount / 100).toFixed(2);
                        const quantity = item.quantity;
                        return `<li>${productName} - £${unitAmount} (x${quantity})</li>`;
                    }).join('');
                } else {
                    logger.warn("[STRIPE] Webhook: No line items found for session", session.id);
                    orderItemsText = '<li>No specific item details available from Stripe line items.</li>';
                }

                const total = (session.amount_total / 100).toFixed(2);

                const ownerEmail = {
                    from: process.env.EMAIL_USER,
                    to: process.env.EMAIL_USER,
                    subject: "💳 New Stripe Payment Received",
                    html: `
                        <h2>Stripe Payment Received!</h2>
                        <p><strong>Customer Email:</strong> ${email}</p>
                        <p><strong>Amount:</strong> £${total}</p>
                        <p><strong>Status:</strong> ${session.payment_status}</p>
                        <hr>
                        <h3>Order Details:</h3>
                        <ul>
                            ${orderItemsText}
                        </ul>
                        <p>Please log in to Stripe Dashboard for full session details.</p>
                    `,
                };

                const customerEmail = {
                    from: process.env.EMAIL_USER,
                    to: email,
                    subject: "🧾 Your Lubo's Kebab Receipt",
                    html: `
                        <h2>Thanks for your payment!</h2>
                        <p>We received your order and it's being prepared.</p>
                        <p><strong>Amount Paid:</strong> £${total}</p>
                        <p><strong>Payment Status:</strong> ${session.payment_status}</p>
                        <hr>
                        <h3>Your Order Details:</h3>
                        <ul>
                            ${orderItemsText}
                        </ul>
                        <p>We appreciate your business!</p>
                    `,
                };

                try {
                    // Check if transporter is defined before using it
                    if (transporter) {
                        await transporter.sendMail(ownerEmail);
                        await transporter.sendMail(customerEmail);
                        logger.info("[EMAIL] Payment confirmation emails sent successfully.");
                    } else {
                        logger.warn("[EMAIL] Email transporter not initialized. Skipping payment confirmation emails.");
                    }
                } catch (emailError) {
                    logger.error("❌ [EMAIL] Error sending payment confirmation emails:", emailError);
                }
            } catch (processingError) {
                logger.error("❌ [STRIPE] Error processing checkout.session.completed event:", processingError);
            }
            break;
        // Add other event types here if needed
        default:
            logger.warn(`[STRIPE] Webhook: Received unhandled event type: ${event.type}`);
    }

    res.status(200).json({ received: true });
});

// Apply general body parsing middleware for all OTHER routes
// These MUST come AFTER the specific webhook route definition
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
    logger.info(`👉 Incoming request: ${req.method} ${req.url}`);
    next();
});

// Serve static files from the 'public' directory
// This line tells Express to look for static files (like index.html, CSS, JS, images)
// inside the 'public' folder when a request comes in.
// Requests like /css/style.css, /js/main.js will be served by this.
const publicPath = path.join(__dirname, 'public');
logger.info(`[STATIC] Express will serve static files from: ${publicPath}`);
app.use(express.static(publicPath));

// TEMPORARY DEBUGGING ROUTE: Check if login.html exists on the server
app.get('/debug-login-file', async (req, res) => {
    const loginFilePath = path.join(publicPath, 'login.html');
    logger.info(`[DEBUG] Attempting to check file existence at: ${loginFilePath}`);
    try {
        await fs.access(loginFilePath, fs.constants.F_OK); // Check if file exists and is visible
        logger.info(`[DEBUG] Successfully accessed login.html at: ${loginFilePath}`);
        res.status(200).send(`File exists: ${loginFilePath}`);
    } catch (error) {
        logger.error(`❌ [DEBUG] Failed to access login.html at: ${loginFilePath}. Error: ${error.message}`);
        if (error.code === 'ENOENT') {
            res.status(404).send(`File NOT FOUND at: ${loginFilePath}. Error: ${error.message}`);
        } else {
            res.status(500).send(`Error checking file: ${error.message}`);
        }
    }
});


// Explicitly serve index.html for the root path
app.get('/', (req, res) => {
    logger.debug(`[STATIC] Serving index.html for root path: ${req.url}`);
    res.sendFile(path.join(publicPath, 'index.html'), (err) => {
        if (err) {
            logger.error(`❌ [STATIC] Error serving index.html: ${err.message}`);
            // Check if the error is due to file not found and send 404, otherwise 500
            if (err.code === 'ENOENT') {
                res.status(404).send('Index page not found'); // More specific 404
            } else {
                res.status(500).send('Error loading index.html');
            }
        }
    });
});

// Explicitly serve specific HTML files that are requested directly
app.get('/login.html', (req, res) => {
    logger.debug(`[STATIC] Serving login.html for path: ${req.url}`);
    res.sendFile(path.join(publicPath, 'login.html'), (err) => {
        if (err) {
            logger.error(`❌ [STATIC] Error serving login.html: ${err.message}`);
            // Check if the error is due to file not found and send 404, otherwise 500
            if (err.code === 'ENOENT') {
                res.status(404).send('Login page not found');
            } else {
                res.status(500).send('Error loading login.html');
            }
        }
    });
});

app.get('/register.html', (req, res) => {
    logger.debug(`[STATIC] Serving register.html for path: ${req.url}`);
    res.sendFile(path.join(publicPath, 'register.html'), (err) => {
        if (err) {
            logger.error(`❌ [STATIC] Error serving register.html: ${err.message}`);
            if (err.code === 'ENOENT') {
                res.status(404).send('Register page not found');
            } else {
                res.status(500).send('Error loading register.html');
            }
        }
    });
});

app.get('/success.html', (req, res) => {
    logger.debug(`[STATIC] Serving success.html for path: ${req.url}`);
    res.sendFile(path.join(publicPath, 'success.html'), (err) => {
        if (err) {
            logger.error(`❌ [STATIC] Error serving success.html: ${err.message}`);
            if (err.code === 'ENOENT') {
                res.status(404).send('Success page not found');
            } else {
                res.status(500).send('Error loading success.html');
            }
        }
    });
});

app.get('/cancel.html', (req, res) => {
    logger.debug(`[STATIC] Serving cancel.html for path: ${req.url}`);
    res.sendFile(path.join(publicPath, 'cancel.html'), (err) => {
        if (err) {
            logger.error(`❌ [STATIC] Error serving cancel.html: ${err.message}`);
            if (err.code === 'ENOENT') {
                res.status(404).send('Cancel page not found');
            } else {
                res.status(500).send('Error loading cancel.html');
            }
        }
    });
});

// Nodemailer transporter setup
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
    tls: {
        rejectUnauthorized: false,
    },
});

/**
 * Test email endpoint. Sends a test email to the configured EMAIL_USER.
 * @name GET /test-email
 * @function
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
app.get("/test-email", async (req, res) => {
    try {
        if (transporter) {
            await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: process.env.EMAIL_USER,
                subject: "✅ Test Email from Lubo's Kebab Server",
                text: "This is a test email sent from your Node.js server.",
            });
            logger.info("[EMAIL] Test email sent successfully!");
            res.status(200).send("Test email sent successfully!");
        } else {
            logger.warn("[EMAIL] Email transporter not initialized. Cannot send test email.");
            res.status(500).send("Email service not available.");
        }
    } catch (error) {
        logger.error("❌ [EMAIL] Error sending test email:", error);
        res.status(500).send("Failed to send test email.");
    }
});

/**
 * Fetches all registered users from the database (for admin/debug purposes).
 * WARNING: This endpoint should be protected in a production environment.
 * @name GET /api/registered-users
 * @function
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
app.get('/api/registered-users', async (req, res, next) => {
    try {
        const result = await query("SELECT id, email FROM users");
        res.status(200).json({ users: result.rows });
    } catch (err) {
        logger.error("❌ [DB] Error fetching users:", err.message);
        next(err); // Pass error to centralized error handler
    }
});

/**
 * Handles user registration.
 * Validates input, checks for existing users, hashes password, and sends welcome email.
 * @name POST /register
 * @function
 * @param {Object} req - Express request object.
 * @param {Object} req.body - Request body containing email, password, and confirmPassword.
 * @param {Object} res - Express response object.
 */
app.post("/register", async (req, res, next) => {
    const { email, password, confirmPassword } = req.body;

    if (!email || !password || !confirmPassword) {
        return res.status(400).json({ message: "All fields are required." });
    }

    if (password !== confirmPassword) {
        return res.status(400).json({ message: "Passwords do not match." });
    }

    // Basic email format validation (can be more robust with regex)
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({ message: "Invalid email format." });
    }

    try {
        const userExists = await query("SELECT * FROM users WHERE email = $1", [email]);
        if (userExists.rows.length > 0) {
            return res.status(409).json({ message: "User with that email already exists." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await query(
            "INSERT INTO users (email, password) VALUES ($1, $2)",
            [email, hashedPassword]
        );

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "✅ Welcome to Lubo's Kebab!",
            html: `
                <h2>Welcome, ${email}!</h2>
                <p>Thank you for registering with Lubo's Kebab. You can now log in and start ordering your favorite kebabs!</p>
                <p>Enjoy your meal!</p>
                <p>If you have any questions, feel free to contact us.</p>
            `,
        };

        if (transporter) {
            transporter.sendMail(mailOptions, (mailErr, info) => {
                if (mailErr) {
                    logger.error("❌ [EMAIL] Error sending welcome email:", mailErr);
                } else {
                    logger.info("[EMAIL] Welcome email sent:", info.response);
                }
            });
        } else {
            logger.warn("[EMAIL] Email transporter not initialized. Skipping welcome email.");
        }


        res.status(201).json({ message: "User registered successfully!" });

    } catch (error) {
        logger.error("❌ [AUTH] Error during registration process:", error);
        next(error); // Pass error to centralized error handler
    }
});

/**
 * Handles user login.
 * Validates credentials and returns a success message upon successful login.
 * @name POST /login
 * @function
 * @param {Object} req - Express request object.
 * @param {Object} req.body - Request body containing email and password.
 * @param {Object} res - Express response object.
 */
app.post("/login", async (req, res, next) => {
    logger.info('[AUTH] --- Entered /login route ---');
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required." });
    }

    try {
        const result = await query("SELECT * FROM users WHERE email = $1", [email]);
        const user = result.rows[0];

        if (!user) {
            logger.warn(`[AUTH] Login attempt for ${email}: User not found.`);
            return res.status(401).json({ message: "Invalid credentials." });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            logger.warn(`[AUTH] Login attempt for ${email}: Password mismatch.`);
            return res.status(401).json({ message: "Invalid credentials." });
        }

        logger.info(`[AUTH] Login successful for ${email}.`);
        // In a real application, you would issue a JWT or session token here.
        res.status(200).json({ message: "Login successful!", userId: user.id });
    } catch (error) {
        logger.error("❌ [DB] Database error during login:", error.message);
        next(error); // Pass error to centralized error handler
    }
});

/**
 * Handles cash on delivery orders.
 * Sends order confirmation emails to both owner and customer.
 * @name POST /cash-order
 * @function
 * @param {Object} req - Express request object.
 * @param {Object} req.body - Request body containing order details and customer information.
 * @param {Object} res - Express response object.
 */
app.post("/cash-order", async (req, res, next) => {
    const { order, customer } = req.body;

    if (!order || !Array.isArray(order) || order.length === 0 || !customer) {
        return res.status(400).json({ message: "Missing or invalid order/customer data." });
    }

    // Sanitize customer inputs to prevent email injection etc. (basic example)
    const sanitizedCustomer = {
        name: customer.name ? String(customer.name).trim() : 'N/A',
        email: customer.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email) ? String(customer.email).trim() : 'N/A',
        phone: customer.phone ? String(customer.phone).trim() : 'N/A',
        address: customer.address ? String(customer.address).trim() : 'N/A',
        instructions: customer.instructions ? String(customer.instructions).trim() : 'None',
    };

    const orderItemsText = order.map(item => {
        let itemDetail = `<li>${String(item.name).trim()} - £${(Number(item.price) || 0).toFixed(2)} (x${Number(item.quantity) || 1})`;
        if (item.customizations) {
            if (item.customizations.sauces && item.customizations.sauces.length > 0) {
                itemDetail += `<br>&nbsp;&nbsp;&nbsp;Sauces: ${item.customizations.sauces.map(s => String(s).trim()).join(', ')}`;
            }
            if (item.customizations.toppings && item.customizations.toppings.length > 0) {
                itemDetail += `<br>&nbsp;&nbsp;&nbsp;Toppings: ${item.customizations.toppings.map(t => String(t).trim()).join(', ')}`;
            }
            if (item.customizations.notes) {
                itemDetail += `<br>&nbsp;&nbsp;&nbsp;Notes: ${String(item.customizations.notes).trim()}`;
            }
        }
        itemDetail += `</li>`;
        return itemDetail;
    }).join('');

    const total = order.reduce((sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 1), 0);

    const ownerMailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER,
        subject: "💵 New Cash Order Received!",
        html: `
            <h1>You have a new cash order!</h1>
            <p><strong>Customer Name:</strong> ${sanitizedCustomer.name}</p>
            <p><strong>Customer Email:</strong> ${sanitizedCustomer.email}</p>
            <p><strong>Customer Phone:</strong> ${sanitizedCustomer.phone}</p>
            <p><strong>Delivery Address:</strong> ${sanitizedCustomer.address}</p>
            <p><strong>Instructions:</strong> ${sanitizedCustomer.instructions}</p>
            <hr>
            <h3>Order Details:</h3>
            <ul>
                ${orderItemsText}
            </ul>
            <h3>Total: £${total.toFixed(2)}</h3>
        `,
    };

    const customerMailOptions = {
        from: process.env.EMAIL_USER,
        to: sanitizedCustomer.email, // Use sanitized email here
        subject: "🧾 Your Lubo's Kebab Cash Order Confirmation",
        html: `
            <h2>Thanks for your cash order, ${sanitizedCustomer.name}!</h2>
            <p>We received your order and will prepare it shortly.</p>
            <p><strong>Amount Due on Delivery:</strong> £${total.toFixed(2)}</p>
            <hr>
            <h3>Your Order:</h3>
            <ul>
                ${orderItemsText}
            </ul>
            <p>We appreciate your business!</p>
        `,
    };

    try {
        if (process.env.EMAIL_USER && process.env.EMAIL_PASS && transporter) {
            await transporter.sendMail(ownerMailOptions);
            if (sanitizedCustomer.email !== 'N/A') { // Only send to customer if email is valid
                await transporter.sendMail(customerMailOptions);
            }
            logger.info("[EMAIL] Cash order confirmation emails sent.");
        } else {
            logger.warn("[EMAIL] Email credentials or transporter not set. Skipping cash order email confirmations.");
        }
        res.status(200).send("Cash order received and emails processed!");
    } catch (error) {
        logger.error("❌ [EMAIL] Error processing cash order or sending emails:", error);
        next(error); // Pass error to centralized error handler
    }
});

// --- Stripe Checkout Session Endpoint ---
app.post("/create-checkout-session", async (req, res, next) => {
    const { cart, customerEmail } = req.body;

    logger.info("Creating Stripe session with cart (first 500 chars):", JSON.stringify(cart).substring(0, 500) + '...');
    logger.info("Customer email for session:", customerEmail);

    if (!cart || !Array.isArray(cart) || cart.length === 0) {
        logger.error("❌ Cart is empty or invalid for session creation");
        return res.status(400).json({ error: "Cart is empty or invalid" });
    }
    if (!customerEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail)) {
        logger.error("❌ Invalid customer email format:", customerEmail);
        return res.status(400).json({ error: "Invalid customer email format." });
    }

    try {
        const line_items = cart.map(item => ({
            price_data: {
                currency: 'gbp',
                product_data: {
                    name: String(item.name) +
                        (item.customizations && (item.customizations.sauces.length > 0 || item.customizations.toppings.length > 0 || item.customizations.notes)
                            ? ' (' +
                            (item.customizations.sauces.length > 0 ? 'Sauces: ' + item.customizations.sauces.map(s => String(s).trim()).join(', ') : '') +
                            (item.customizations.sauces.length > 0 && item.customizations.toppings.length > 0 ? '; ' : '') +
                            (item.customizations.toppings.length > 0 ? 'Toppings: ' + item.customizations.toppings.map(t => String(t).trim()).join(', ') : '') +
                            ((item.customizations.sauces.length > 0 || item.customizations.toppings.length > 0) && item.customizations.notes ? '; ' : '') +
                            (item.customizations.notes ? 'Notes: ' + String(item.customizations.notes).trim() : '')
                            + ')' : ''), // ✅ Append customizations to product name for Stripe display
                },
                unit_amount: Math.round(Number(item.price) * 100),
            },
            quantity: Number(item.quantity) || 1,
        }));

        logger.info("Line items for Stripe:", JSON.stringify(line_items));

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items,
            mode: 'payment',
            customer_email: customerEmail,
            success_url: `${process.env.YOUR_DOMAIN}/success.html`,
            cancel_url: `${process.env.YOUR_DOMAIN}/cancel.html`,
            // metadata: {
            //   cart: JSON.stringify(cart) // Only use if you absolutely need the full cart in metadata, can cause payload too large.
            // }
        });

        logger.info("✅ Stripe session created:", session.id);
        res.json({ id: session.id });

    } catch (error) {
        logger.error("❌ Stripe session creation failed:", error.raw ? error.raw.message : error.message || error);
        if (error.raw) {
            logger.error("Stripe Raw Error:", JSON.stringify(error.raw, null, 2));
        }
        next(error); // Pass error to centralized error handler
    }
});


const PORT = process.env.PORT || 3000;

// Centralized Error Handling Middleware
// This should be the last app.use() middleware before app.listen
app.use((err, req, res, next) => {
    logger.error("🔥 Unhandled Server Error:", err.stack);
    res.status(500).json({ message: "An unexpected server error occurred." });
});


// DEFINE THE startServer FUNCTION FIRST
async function startServer() {
    try {
        await initializeDatabase();
        logger.info('✅ Database initialized successfully.');

        app.listen(PORT, () => {
            logger.info(`✅ Server running on port ${PORT}`);
            logger.info(`Access it at: http://localhost:${PORT}`);
        });
    } catch (error) {
        logger.error("❌ Failed to start server due to database initialization error:", error);
        process.exit(1);
    }
}

// THEN CALL THE startServer FUNCTION after it's defined
startServer();