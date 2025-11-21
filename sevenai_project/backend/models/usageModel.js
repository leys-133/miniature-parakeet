/**
 * Usage model for tracking user activity against plan quotas.
 *
 * A usage record typically corresponds to a billing period (e.g. one
 * month). It tracks how many messages or tokens a user has consumed
 * within that period. This model allows the chat service to enforce
 * quotas defined by the subscription plans.
 */

const { pool } = require('../config/db');

/**
 * Creates or updates a usage record for a user in a specific period.
 * If a record already exists for the given user and period, it will
 * increment the messagesUsed count; otherwise a new record is created.
 *
 * @param {number} userId The ID of the user
 * @param {string} planCode The code of the plan for tracking purposes
 * @param {Date} periodStart The start of the period
 * @param {Date} periodEnd The end of the period
 * @param {number} messagesIncrement Number of messages to increment
 * @returns {Promise<object>} The updated or created usage record
 */
async function upsertUsage(userId, planCode, periodStart, periodEnd, messagesIncrement = 1) {
  // Use an upsert (INSERT ... ON CONFLICT) to either insert or update
  const query = `
    INSERT INTO usage (user_id, plan_code, period_start, period_end, messages_used, tokens_used)
    VALUES ($1, $2, $3, $4, $5, 0)
    ON CONFLICT (user_id, period_start, period_end) DO UPDATE
      SET messages_used = usage.messages_used + EXCLUDED.messages_used,
          updated_at = NOW()
    RETURNING *;
  `;
  const values = [userId, planCode, periodStart, periodEnd, messagesIncrement];
  const result = await pool.query(query, values);
  return result.rows[0];
}

/**
 * Retrieves usage for a user within the current period. Assumes that
 * period boundaries are calculated in the service layer.
 *
 * @param {number} userId The ID of the user
 * @param {Date} periodStart The start of the period
 * @param {Date} periodEnd The end of the period
 * @returns {Promise<object|undefined>} The usage record or undefined
 */
async function getUsage(userId, periodStart, periodEnd) {
  const query = `
    SELECT * FROM usage
    WHERE user_id = $1 AND period_start = $2 AND period_end = $3
    LIMIT 1;
  `;
  const result = await pool.query(query, [userId, periodStart, periodEnd]);
  return result.rows[0];
}

module.exports = {
  upsertUsage,
  getUsage,
};