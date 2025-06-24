// db.js
const { Pool } = require('pg');
const dotenv = require('dotenv');

// Load environment variables from .env file (for local development)
// On Render, environment variables are set directly in the dashboard.
dotenv.config();

// Create a new PostgreSQL pool instance.
// It will use the DATABASE_URL environment variable for connection.
// This environment variable should be set in your Render service settings.
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    // Required for Render's PostgreSQL if you're not using custom certificates.
    // In production, ensure this is handled securely.
    ssl: {
        rejectUnauthorized: false
    }
});

/**
 * Initializes the database by creating the 'users' table if it doesn't already exist.
 * This function should be called once when the server starts.
 */
async function initializeDatabase() {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                email VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log("✅ Database table 'users' ensured to exist.");
    } catch (err) {
        console.error("❌ Error connecting to PostgreSQL or initializing database:", err);
        // Rethrow the error so the server doesn't start if DB connection fails
        throw err;
    }
}

/**
 * Executes a SQL query against the database pool.
 * @param {string} text - The SQL query string.
 * @param {Array} [params] - Optional parameters for the query.
 * @returns {Promise<Object>} The result object from the pg query.
 */
module.exports = {
    query: (text, params) => pool.query(text, params),
    initializeDatabase,
};