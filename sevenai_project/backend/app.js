/**
 * Main Express application configuration.
 *
 * This file sets up middleware such as CORS and JSON parsing, registers
 * API routes, and attaches a global error handler. The actual server
 * startup happens in `server.js` after establishing a database connection.
 */

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// Import route handlers
const authRoutes = require('./routes/auth');
const chatRoutes = require('./routes/chat');
const subscriptionRoutes = require('./routes/subscribe');
const plansRoutes = require('./routes/plans');

// Import global error handler
const { errorHandler } = require('./middleware/errorMiddleware');

const app = express();

// Enable CORS for all origins (can be customized)
app.use(cors());

// Built‑in JSON parser
app.use(express.json());

// URL‑encoded parser for form submissions
app.use(bodyParser.urlencoded({ extended: false }));

// Register API routes
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/subscribe', subscriptionRoutes);
app.use('/api/plans', plansRoutes);

// Global error handler must be registered after routes
app.use(errorHandler);

module.exports = app;