/**
 * Controller for chat interactions.
 *
 * Exposes a handler for the chat endpoint which uses the chat service
 * to process messages, enforce quotas and return responses from
 * SevenAI. The route must be protected by JWT authentication.
 */

const { processChat } = require('../services/chatService');

/**
 * Handles POST /api/chat
 */
async function chat(req, res, next) {
  try {
    const user = req.user;
    const { message } = req.body;
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ message: 'Message is required' });
    }
    const reply = await processChat(user, message);
    res.status(200).json({ reply });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  chat,
};