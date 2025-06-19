# 🥙 Lubo's Kebab Ordering App

An interactive online menu and ordering system for Lubo's Kebab shop, featuring:

- Dynamic menu selection
- Live total pricing
- Cash and card (Stripe) payment options
- Animated interface with music
- Opening hours and status indicator

---

## 🚀 Features

- Responsive HTML/CSS front-end
- Stripe integration for payments (optional)
- Node.js + Express back-end
- Environment variable configuration for security
- Fun background music and design 🎶

---

## 🛠️ Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/kebab-app.git
cd kebab-app
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Create a `.env` File

Create a `.env` file in the root of your project with the following keys:

```env
STRIPE_SECRET_KEY=your_stripe_secret_key
NEXT_PUBLIC_STRIPE_KEY=pk_live_your_actual_key_here
```

> ⚠️ **Do NOT commit your `.env` file.** It's already excluded in `.gitignore`.

### 4. Run the Server

```bash
node server.js
```

Server will start at: http://localhost:3000

### 5. Open the Front-End

Open `index.html` in your browser (you can serve it via `Live Server` in VS Code or a simple static file server).

---

## 🧾 Payments

- Cash payments are enabled by default.
- Card payments via Stripe are functional but currently hidden unless selected from the dropdown.
- To test Stripe integration locally, ensure you have a Stripe account and your keys are valid.

---

## 📂 Project Structure

```
.
├── index.html
├── script.js
├── server.js
├── .env
├── .gitignore
├── assets/
```

---

## 📸 Screenshots

<img src="assets/logo.png" alt="Lubo's Kebab Logo" width="200"/>

---

## 🛡️ Security Notes

- API keys are stored securely in `.env`
- `.env` is ignored by Git for safety
- Do **NOT** expose real secret keys in public repositories

---

## 📜 License

MIT License. Feel free to fork and adapt for your own restaurant or kiosk!

---

## 🧑‍🍳 Author

Made with ❤️ by Lubo & friends
