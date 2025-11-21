/**
 * Message model for handling chat messages stored in the database.
 *
 * Each message belongs to a user and is classified by its role
 * ('user', 'assistant' or 'system'). Messages are stored with a
 * timestamp and optional model name. This module provides functions
 * to insert and retrieve messages.
 */

const { pool } = require('../config/db');

/**
 * Inserts a new message into the messages table.
 *
 * @param {number} userId The id of the user associated with the message
 * @param {string} role The role of the message ('user', 'assistant', 'system')
 * @param {string} content The content of the message
 * @param {string|null} model The name of the AI model used (optional)
 * @returns {Promise<object>} The inserted message record
 */
async function createMessage(userId, role, content, model = null) {
  const query = `
    INSERT INTO messages (user_id, role, content, model, created_at)
    VALUES ($1, $2, $3, $4, NOW())
    RETURNING id, user_id as "userId", role, content, model, created_at as "createdAt";
  `;
  const values = [userId, role, content, model];
  const result = await pool.query(query, values);
  return result.rows[0];
}

/**
 * Retrieves a list of messages for a given user. Messages are
 * ordered by creation time ascending. Optionally limit the number of
 * messages returned.
 *
 * @param {number} userId The id of the user whose messages to fetch
 * @param {number|null} limit Maximum number of messages to return
 * @returns {Promise<Array>} An array of message records
 */
async function getMessagesByUserId(userId, limit = null) {
  let query = 'SELECT * FROM messages WHERE user_id = $1 ORDER BY created_at ASC';
  const params = [userId];
  if (limit) {
    query += ' LIMIT $2';
    params.push(limit);
  }
  const result = await pool.query(query, params);
  return result.rows;
}

module.exports = {
  createMessage,
  getMessagesByUserId,
};