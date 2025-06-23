// server.cjs
const path = require("path");
<<<<<<< HEAD
const { query, initializeDatabase } = require("./db"); 
console.log("🧪 Starting up server.js...");
console.log("Current directory:", __dirname);

const dotenv = require("dotenv");
dotenv.config(); 
=======
const { query, initializeDatabase } = require("./db");
const dotenv = require("dotenv");
dotenv.config(); // Load environment variables first

// Enhanced Logging Utility (simple console wrapper)
const logger = {
  info: (...args) => console.log("[INFO]", ...args),
  warn: (...args) => console.warn("[WARN]", ...args),
  error: (...args) => console.error("[ERROR]", ...args),
  debug: (...args) => process.env.NODE_ENV !== 'production' && console.log("[DEBUG]", ...args),
};

logger.info("🧪 Starting up server.js...");
logger.info("Current directory:", __dirname);
>>>>>>> 163e7c4194f2f26b4688a4db84c0e457b4bd5a55

const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");

<<<<<<< HEAD
console.log("Stripe Secret Key:", process.env.STRIPE_SECRET_KEY ? "Loaded" : "NOT LOADED - Check .env");
=======
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
  logger.error("❌ EMAIL_USER or EMAIL_PASS is NOT LOADED. Email functionality may be impaired.");
  // Don't exit, as email is not strictly critical for basic server operation, but log severe warning.
}
if (!process.env.YOUR_DOMAIN) {
  logger.warn("⚠️ YOUR_DOMAIN is not set in .env. Stripe success/cancel URLs might be incorrect.");
}


logger.info("Stripe Secret Key:", process.env.STRIPE_SECRET_KEY ? "Loaded" : "NOT LOADED - Check .env");
>>>>>>> 163e7c4194f2f26b4688a4db84c0e457b4bd5a55
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const bcrypt = require("bcrypt");

const app = express();

<<<<<<< HEAD
=======
// Apply CORS middleware
>>>>>>> 163e7c4194f2f26b4688a4db84c0e457b4bd5a55
app.use(cors());

// --- CRITICAL FIX FOR STRIPE WEBHOOK ---
// This middleware MUST come BEFORE any global express.json() or express.urlencoded()
// because Stripe's webhook needs the raw body.
// The /webhook route will use express.raw()
<<<<<<< HEAD
// All OTHER routes will use express.json() and express.urlencoded()
app.post("/webhook", express.raw({ type: "application/json" }), async (req, res) => {
  console.log('--- Webhook endpoint received a request! ---'); 
  const sig = req.headers["stripe-signature"];

  let event;

  try {
    // req.body is now the raw buffer/string because express.raw() ran for this specific route
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    console.log(`Webhook: Event constructed successfully. Type: ${event.type}`); 
  } catch (err) {
    console.error("❌ Webhook signature verification failed.", err.message);
    console.error("Webhook: Raw Body (truncated):", req.body ? req.body.toString().substring(0, 500) + '...' : 'No body'); 
    console.error("Webhook: Signature Header:", sig);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    console.log('Webhook: Received checkout.session.completed event.'); 
    const session = event.data.object; // event.data.object is the parsed JSON from Stripe
    const email = session.customer_details?.email; 
    console.log(`Webhook: Processing session for email: ${email}`); 

    // ✅ IMPORTANT: The full cart with customizations is NOT passed via metadata anymore to prevent payload too large errors.
    // Instead, we will fetch line items directly from Stripe to reconstruct the basic order for the email.
    
    // Fetch line items from the session
    const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {limit: 100}); // Increased limit for more items
    
    let orderItemsText = '';
    if (lineItems.data && lineItems.data.length > 0) {
        orderItemsText = lineItems.data.map(item => {
            // Retrieve product details for name and price
            const productName = item.description; // description holds the product name from line_items
            const unitAmount = (item.price.unit_amount / 100).toFixed(2); // Convert cents back to GBP
            const quantity = item.quantity;

            return `<li>${productName} - £${unitAmount} (x${quantity})</li>`;
        }).join('');
    } else {
        console.warn("Webhook: No line items found for session", session.id);
        orderItemsText = '<li>No specific item details available from Stripe line items.</li>';
    }


    // Calculate total from webhook session (more reliable for actual payment amount)
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
      await transporter.sendMail(ownerEmail);
      await transporter.sendMail(customerEmail);
      console.log("Payment confirmation emails sent."); 
    } catch (emailError) {
      console.error("❌ Error sending payment confirmation emails:", emailError); 
    }
  } else {
    console.log(`Webhook: Received unhandled event type: ${event.type}`); 
  }

  res.status(200).json({ received: true });
});

// Now, apply general body parsing middleware for all OTHER routes
=======
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
          await transporter.sendMail(ownerEmail);
          await transporter.sendMail(customerEmail);
          logger.info("[EMAIL] Payment confirmation emails sent successfully.");
        } catch (emailError) {
          logger.error("❌ [EMAIL] Error sending payment confirmation emails:", emailError);
        }
      } catch (processingError) {
        logger.error("❌ [STRIPE] Error processing checkout.session.completed event:", processingError);
      }
      break;
    // Add other event types here if needed
    // case 'payment_intent.succeeded':
    //   // handle payment_intent.succeeded
    //   break;
    default:
      logger.warn(`[STRIPE] Webhook: Received unhandled event type: ${event.type}`);
  }

  res.status(200).json({ received: true });
});

// Apply general body parsing middleware for all OTHER routes
>>>>>>> 163e7c4194f2f26b4688a4db84c0e457b4bd5a55
// These MUST come AFTER the specific webhook route definition
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

<<<<<<< HEAD
app.use((req, res, next) => {
  console.log("👉 Incoming request:", req.method, req.url);
  next();
});

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public'))); 

// Explicit routes for HTML pages
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/register.html", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "register.html"));
});

app.get("/login.html", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "login.html"));
});

app.get("/success.html", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "success.html"));
});

app.get("/cancel.html", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "cancel.html"));
});


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

app.get("/test-email", async (req, res) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: "✅ Test Email from Lubo's Kebab Server",
      text: "This is a test email sent from your Node.js server.",
    });
    console.log("Test email sent successfully!");
    res.status(200).send("Test email sent successfully!");
  } catch (error) {
    console.error("❌ Error sending test email:", error);
    res.status(500).send("Failed to send test email.");
  }
});

app.get('/api/registered-users', async (req, res) => { 
  try {
    const result = await query("SELECT id, email FROM users"); 
    res.status(200).json({ users: result.rows });
  } catch (err) {
    console.error("Error fetching users:", err.message);
    res.status(500).json({ error: "Failed to fetch registered users." });
  }
});

app.post("/register", async (req, res) => {
  const { email, password, confirmPassword } = req.body;

  if (!email || !password || !confirmPassword) {
    return res.status(400).json({ message: "All fields are required." });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match." });
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
      `,
    };

    transporter.sendMail(mailOptions, (mailErr, info) => {
      if (mailErr) {
        console.error("Error sending welcome email:", mailErr);
      } else {
        console.log("Welcome email sent:", info.response);
      }
    });

    res.status(201).json({ message: "User registered successfully!" });

  } catch (error) {
    console.error("Error during registration process:", error);
    res.status(500).json({ message: "An unexpected error occurred during registration." });
  }
});

// Login endpoint
app.post("/login", async (req, res) => { 
  console.log('--- Entered /login route ---'); 
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required." });
  }

  try {
    const result = await query("SELECT * FROM users WHERE email = $1", [email]);
    const user = result.rows[0]; 

    if (!user) {
      console.log(`Login attempt for ${email}: User not found.`); 
      return res.status(401).json({ message: "Invalid credentials." }); 
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log(`Login attempt for ${email}: Password mismatch.`); 
      return res.status(401).json({ message: "Invalid credentials." }); 
    }

    console.log(`Login successful for ${email}.`); 
    res.status(200).json({ message: "Login successful!", userId: user.id });
  } catch (error) {
    console.error("Database error during login:", error.message);
    res.status(500).json({ message: "Server error during login." });
  }
});

// Cash Order Endpoint (Sends email to owner)
app.post("/cash-order", async (req, res) => {
  const { order, customer } = req.body;

  if (!order || !customer || order.length === 0) {
    return res.status(400).json({ message: "Missing order data." });
  }

    // This order processing for cash remains the same, it directly uses the full 'order' array from the frontend
    const orderItemsText = order.map(item => {
        let itemDetail = `<li>${item.name} - £${(Number(item.price) || 0).toFixed(2)} (x${Number(item.quantity) || 1})`;
        if (item.customizations) {
            if (item.customizations.sauces && item.customizations.sauces.length > 0) {
                itemDetail += `<br>&nbsp;&nbsp;&nbsp;Sauces: ${item.customizations.sauces.join(', ')}`;
            }
            if (item.customizations.toppings && item.customizations.toppings.length > 0) {
                itemDetail += `<br>&nbsp;&nbsp;&nbsp;Toppings: ${item.customizations.toppings.join(', ')}`;
            }
            if (item.customizations.notes) {
                itemDetail += `<br>&nbsp;&nbsp;&nbsp;Notes: ${item.customizations.notes}`;
            }
        }
        itemDetail += `</li>`;
        return itemDetail;
    }).join('');

  const total = order.reduce((sum, item) => sum + item.price, 0);

  const ownerMailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER, 
    subject: "💵 New Cash Order Received!",
    html: `
      <h1>You have a new cash order!</h1>
      <p><strong>Customer Name:</strong> ${customer.name}</p>
      <p><strong>Customer Email:</strong> ${customer.email}</p>
      <p><strong>Customer Phone:</strong> ${customer.phone}</p>
      <p><strong>Delivery Address:</strong> ${customer.address}</p>
      <p><strong>Instructions:</strong> ${customer.instructions || 'None'}</p>
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
    to: customer.email, 
    subject: "🧾 Your Lubo's Kebab Cash Order Confirmation",
    html: `
      <h2>Thanks for your cash order, ${customer.name}!</h2>
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
    await transporter.sendMail(ownerMailOptions);
    await transporter.sendMail(customerMailOptions);
    console.log("Cash order confirmation emails sent.");
    res.status(200).send("Cash order received and emails sent!"); 
  } catch (error) {
    console.error("❌ Error processing cash order or sending emails:", error);
    res.status(500).json({ message: "Failed to process cash order and send emails." });
  }
});

// --- Stripe Checkout Session Endpoint ---
app.post("/create-checkout-session", async (req, res) => {
  const { cart, customerEmail } = req.body;

  console.log("Creating Stripe session with cart (first 500 chars):", JSON.stringify(cart).substring(0, 500) + '...'); 
  console.log("Customer email for session:", customerEmail); 

  if (!cart || !Array.isArray(cart) || cart.length === 0) {
    console.error("❌ Cart is empty or invalid for session creation");
    return res.status(400).json({ error: "Cart is empty or invalid" });
  }
  if (!customerEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail)) {
      console.error("❌ Invalid customer email format:", customerEmail);
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
                  (item.customizations.sauces.length > 0 ? 'Sauces: ' + item.customizations.sauces.join(', ') : '') +
                  (item.customizations.sauces.length > 0 && item.customizations.toppings.length > 0 ? '; ' : '') +
                  (item.customizations.toppings.length > 0 ? 'Toppings: ' + item.customizations.toppings.join(', ') : '') +
                  ((item.customizations.sauces.length > 0 || item.customizations.toppings.length > 0) && item.customizations.notes ? '; ' : '') +
                  (item.customizations.notes ? 'Notes: ' + item.customizations.notes : '')
                + ')' : ''), // ✅ Append customizations to product name for Stripe display
        },
        unit_amount: Math.round(Number(item.price) * 100), 
      },
      quantity: Number(item.quantity) || 1, 
    }));

    console.log("Line items for Stripe:", JSON.stringify(line_items)); 

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      customer_email: customerEmail,
      success_url: `${process.env.YOUR_DOMAIN}/success.html`, 
      cancel_url: `${process.env.YOUR_DOMAIN}/cancel.html`,  
      // ✅ REMOVED: cart from metadata to prevent payload too large errors
      // metadata: {
      //   cart: JSON.stringify(cart)
      // } 
    });

    console.log("✅ Stripe session created:", session.id);
    res.json({ id: session.id });

  } catch (error) {
    console.error("❌ Stripe session creation failed:", error.raw ? error.raw.message : error.message || error);
    if (error.raw) {
        console.error("Stripe Raw Error:", JSON.stringify(error.raw, null, 2));
    }
    res.status(500).json({ error: "Failed to create Stripe session" });
  }
});


const PORT = process.env.PORT || 3000;

// DEFINE THE startServer FUNCTION FIRST
async function startServer() {
    try {
        await initializeDatabase(); 
        console.log('✅ Database initialized successfully.');

        app.listen(PORT, () => {
            console.log(`✅ Server running on port ${PORT}`);
            console.log(`Access it at: http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("❌ Failed to start server due to database initialization error:", error);
        process.exit(1); 
    }
}

// THEN CALL THE startServer FUNCTION after it's defined
=======
// Request logging middleware
app.use((req, res, next) => {
  logger.info(`👉 Incoming request: ${req.method} ${req.url}`);
  next();
});

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

/**
 * Route to serve the main index.html page.
 * @name GET /
 * @function
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

/**
 * Route to serve the registration page.
 * @name GET /register.html
 * @function
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
app.get("/register.html", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "register.html"));
});

/**
 * Route to serve the login page.
 * @name GET /login.html
 * @function
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
app.get("/login.html", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "login.html"));
});

/**
 * Route to serve the success page after a successful order/payment.
 * @name GET /success.html
 * @function
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
app.get("/success.html", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "success.html"));
});

/**
 * Route to serve the cancellation page after a payment cancellation.
 * @name GET /cancel.html
 * @function
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
app.get("/cancel.html", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "cancel.html"));
});

// Nodemailer transporter setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    // WARNING: This is for development/testing only and should be removed in production
    // or configured securely with proper SSL certificates.
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
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: "✅ Test Email from Lubo's Kebab Server",
      text: "This is a test email sent from your Node.js server.",
    });
    logger.info("[EMAIL] Test email sent successfully!");
    res.status(200).send("Test email sent successfully!");
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

    transporter.sendMail(mailOptions, (mailErr, info) => {
      if (mailErr) {
        logger.error("❌ [EMAIL] Error sending welcome email:", mailErr);
      } else {
        logger.info("[EMAIL] Welcome email sent:", info.response);
      }
    });

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
    to: sanitizedCustomer.email,
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
    await transporter.sendMail(ownerMailOptions);
    await transporter.sendMail(customerMailOptions);
    logger.info("[EMAIL] Cash order confirmation emails sent successfully.");
    res.status(200).send("Cash order received and emails sent!");
  } catch (error) {
    logger.error("❌ [ORDER] Error processing cash order or sending emails:", error);
    next(error); // Pass error to centralized error handler
  }
});

/**
 * Creates a Stripe Checkout Session for card payments.
 * @name POST /create-checkout-session
 * @function
 * @param {Object} req - Express request object.
 * @param {Object} req.body - Request body containing cart items and customer email.
 * @param {Object} res - Express response object.
 */
app.post("/create-checkout-session", async (req, res, next) => {
  const { cart, customerEmail } = req.body;

  logger.debug("Creating Stripe session with cart (first 500 chars):", JSON.stringify(cart).substring(0, 500) + '...');
  logger.debug("Customer email for session:", customerEmail);

  if (!cart || !Array.isArray(cart) || cart.length === 0) {
    logger.error("❌ [STRIPE] Cart is empty or invalid for session creation");
    return res.status(400).json({ error: "Cart is empty or invalid" });
  }
  if (!customerEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail)) {
    logger.error("❌ [STRIPE] Invalid customer email format:", customerEmail);
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
              + ')' : ''),
        },
        unit_amount: Math.round(Number(item.price) * 100),
      },
      quantity: Number(item.quantity) || 1,
    }));

    logger.debug("[STRIPE] Line items for Stripe:", JSON.stringify(line_items));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      customer_email: customerEmail,
      success_url: `${process.env.YOUR_DOMAIN}/success.html`,
      cancel_url: `${process.env.YOUR_DOMAIN}/cancel.html`,
    });

    logger.info("✅ [STRIPE] Stripe session created:", session.id);
    res.json({ id: session.id });

  } catch (error) {
    logger.error("❌ [STRIPE] Stripe session creation failed:", error.raw ? error.raw.message : error.message || error);
    if (error.raw) {
      logger.error("[STRIPE] Stripe Raw Error:", JSON.stringify(error.raw, null, 2));
    }
    next(error); // Pass error to centralized error handler
  }
});

const PORT = process.env.PORT || 3000;

/**
 * Centralized Error Handling Middleware.
 * This should be the last middleware added to the Express app.
 * @param {Object} err - The error object.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Next middleware function.
 */
app.use((err, req, res, next) => {
  logger.error("🚨 [ERROR] Unhandled error caught by middleware:", err);
  // Differentiate between known operational errors and unexpected errors
  if (err.isOperational) { // If you implement custom operational errors
    return res.status(err.statusCode || 500).json({
      status: 'fail',
      message: err.message
    });
  }

  // For programming or unknown errors, send a generic message
  res.status(500).json({
    status: 'error',
    message: 'Something went wrong! Please try again later.'
  });
});

/**
 * Initializes the database and starts the server.
 * Handles graceful shutdown.
 * @async
 * @function startServer
 */
async function startServer() {
  try {
    await initializeDatabase();
    logger.info('✅ [DB] Database initialized successfully.');

    const server = app.listen(PORT, () => {
      logger.info(`✅ [SERVER] Server running on port ${PORT}`);
      logger.info(`Access it at: http://localhost:${PORT}`);
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
      logger.info('SIGTERM signal received: Closing HTTP server.');
      server.close(() => {
        logger.info('HTTP server closed.');
        // Optionally close DB connections here if `db.js` exposes a close method
        // process.exit(0); // Exit process after server closes
      });
    });

    process.on('SIGINT', () => {
      logger.info('SIGINT signal received: Closing HTTP server.');
      server.close(() => {
        logger.info('HTTP server closed.');
        // process.exit(0);
      });
    });

  } catch (error) {
    logger.error("❌ [SERVER] Failed to start server due to database initialization error:", error);
    process.exit(1); // Exit process if database fails to initialize
  }
}

// Call the startServer function to kick off the application
>>>>>>> 163e7c4194f2f26b4688a4db84c0e457b4bd5a55
startServer();
