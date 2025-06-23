// db.js

const { Pool } = require('pg');

// Use process.env.DATABASE_URL for Render deployment
// Otherwise, use local connection details for development
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false // Required for Render's managed PostgreSQL to connect
    }
});

async function initializeDatabase() {
    try {
        await pool.connect(); // Test connection
        console.log('Connected to PostgreSQL database');

        // Create Users Table
        // Removed 'username' column as it's not used in registration/login logic in server.js
        const createUsersTableQuery = `
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                email VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL
            );
        `;
        await pool.query(createUsersTableQuery);
        console.log('Users table initialized or already exists.');

        // Example: Create Products Table (if your app has one)
        const createProductsTableQuery = `
            CREATE TABLE IF NOT EXISTS products (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                description TEXT,
                price DECIMAL(10, 2) NOT NULL,
                image_url TEXT
            );
        `;
        await pool.query(createProductsTableQuery);
        console.log('Products table initialized or already exists.');

        // Example: Create Orders Table (if your app has one)
        const createOrdersTableQuery = `
            CREATE TABLE IF NOT EXISTS orders (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id),
                order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                total_amount DECIMAL(10, 2) NOT NULL,
                status VARCHAR(50) DEFAULT 'pending'
            );
        `;
        await pool.query(createOrdersTableQuery);
        console.log('Orders table initialized or already exists.');

        // Add other table creation queries here if you have more

        console.log('PostgreSQL database schema initialized or already exists.');

    } catch (err) {
        console.error('Error connecting to PostgreSQL or initializing database:', err);
        // Depending on your app, you might want to exit or handle gracefully
        // process.exit(1);
    }
}

// Export functions for interacting with the database
module.exports = {
    pool,
    initializeDatabase,
    // THIS IS THE CRITICAL FIX: Export the query function from the pool
    query: (text, params) => pool.query(text, params), 
};
