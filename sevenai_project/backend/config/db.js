/**
 * PostgreSQL database connection setup.
 *
 * Uses the `pg` library to create a connection pool based on the
 * connection string defined in the environment variables. The exported
 * `connectDb` function attempts to connect to the database and is
 * invoked before starting the Express server. If the connection fails,
 * the server will not start.
 */

const { Pool } = require('pg');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Initialize a new PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

/**
 * Connects to the PostgreSQL database using the connection pool. If the
 * connection fails, the returned promise is rejected and server startup
 * should be aborted.
 */
const connectDb = async () => {
  try {
    await pool.connect();
    console.log('Connected to PostgreSQL');
  } catch (error) {
    console.error('PostgreSQL connection error:', error);
    throw error;
  }
};

module.exports = {
  pool,
  connectDb,
};