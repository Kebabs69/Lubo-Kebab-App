// server.cjs
const path = require("path");
const { query, initializeDatabase } = require("./db"); 
console.log("🧪 Starting up server.js...");
console.log("Current directory:", __dirname);

const dotenv = require("dotenv");
dotenv.config(); 

const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");

console.log("Stripe Secret Key:", process.env.STRIPE_SECRET_KEY ? "Loaded" : "NOT LOADED - Check .env");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const bcrypt = require("bcrypt");

const app = express();

app.use(cors());

// --- CRITICAL FIX FOR STRIPE WEBHOOK ---
// This middleware MUST come BEFORE any global express.json() or express.urlencoded()
// because Stripe's webhook needs the raw body.
// The /webhook route will use express.raw()
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
// These MUST come AFTER the specific webhook route definition
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
startServer();
