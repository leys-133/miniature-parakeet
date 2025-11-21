/**
 * Authentication routes.
 *
 * Defines endpoints for user registration, login and retrieving
 * authenticated user information. Applies JWT middleware where
 * necessary. These routes map HTTP verbs and paths to controller
 * functions.
 */

const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getMe } = require('../controllers/authController');
const { authenticateToken } = require('../middleware/authMiddleware');

// POST /api/auth/register
router.post('/register', registerUser);

// POST /api/auth/login
router.post('/login', loginUser);

// GET /api/auth/me
router.get('/me', authenticateToken, getMe);

module.exports = router;