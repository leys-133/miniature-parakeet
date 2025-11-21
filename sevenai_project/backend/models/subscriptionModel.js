/**
 * Subscription model for handling user subscription records.
 *
 * A subscription links a user to a plan with a start and optional
 * end date. The status field indicates whether the subscription is
 * active, expired or canceled. Only one active subscription should
 * exist per user at a time.
 */

const { pool } = require('../config/db');

/**
 * Creates a new subscription for a user.
 *
 * @param {number} userId The ID of the user
 * @param {string} planCode The code of the subscription plan
 * @param {string} status The status of the subscription ('active', etc.)
 * @param {Date} startAt When the subscription starts
 * @param {Date|null} endAt When the subscription ends (null for lifetime)
 * @returns {Promise<object>} The created subscription record
 */
async function createSubscription(userId, planCode, status, startAt, endAt = null) {
  const query = `
    INSERT INTO subscriptions (user_id, plan_code, status, start_at, end_at, created_at)
    VALUES ($1, $2, $3, $4, $5, NOW())
    RETURNING *;
  `;
  const values = [userId, planCode, status, startAt, endAt];
  const result = await pool.query(query, values);
  return result.rows[0];
}

/**
 * Retrieves the active subscription for a user, if any. An active
 * subscription is defined as having status = 'active' and an end date
 * in the future (or null).
 *
 * @param {number} userId The user ID
 * @returns {Promise<object|undefined>} The active subscription or undefined
 */
async function getActiveSubscriptionByUserId(userId) {
  const query = `
    SELECT * FROM subscriptions
    WHERE user_id = $1
      AND status = 'active'
      AND (end_at IS NULL OR end_at > NOW())
    ORDER BY start_at DESC
    LIMIT 1;
  `;
  const result = await pool.query(query, [userId]);
  return result.rows[0];
}

/**
 * Updates an existing subscription's status and end date. Typically
 * called when a user renews, cancels or upgrades their plan.
 *
 * @param {number} subscriptionId The ID of the subscription to update
 * @param {object} fields An object containing fields to update
 * @returns {Promise<object>} The updated subscription record
 */
async function updateSubscription(subscriptionId, fields) {
  // Build a dynamic query based on provided fields
  const setClauses = [];
  const values = [];
  let idx = 1;
  for (const key of Object.keys(fields)) {
    setClauses.push(`${key} = $${idx}`);
    values.push(fields[key]);
    idx += 1;
  }
  values.push(subscriptionId);
  const query = `
    UPDATE subscriptions
    SET ${setClauses.join(', ')}, updated_at = NOW()
    WHERE id = $${idx}
    RETURNING *;
  `;
  const result = await pool.query(query, values);
  return result.rows[0];
}

module.exports = {
  createSubscription,
  getActiveSubscriptionByUserId,
  updateSubscription,
};