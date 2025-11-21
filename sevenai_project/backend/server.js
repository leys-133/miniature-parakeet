/**
 * Entry point for the SevenAI backend server.
 *
 * This file connects to the PostgreSQL database before starting the
 * Express server. Separating this logic from `app.js` helps keep
 * startup concerns (database connection) separate from application
 * configuration.
 */

const app = require('./app');
const { connectDb } = require('./config/db');

const PORT = process.env.PORT || 5000;

// Establish a database connection before starting the server.
connectDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to start server:', err);
  });