/**
 * Chat route.
 *
 * Defines the POST endpoint for interacting with SevenAI. The route is
 * protected by JWT authentication and delegates to the chat controller.
 */

const express = require('express');
const router = express.Router();
const { chat } = require('../controllers/chatController');
const { authenticateToken } = require('../middleware/authMiddleware');

// POST /api/chat
router.post('/', authenticateToken, chat);

module.exports = router;