/**
 * User model handling database operations for the users table.
 *
 * This module provides functions to create and retrieve users. In a
 * production application you might use an ORM such as Sequelize or
 * TypeORM, but here we use parameterized SQL queries through the pg
 * client for simplicity and to avoid adding unnecessary dependencies.
 */

const { pool } = require('../config/db');

/**
 * Inserts a new user into the database. Automatically sets the
 * `created_at` and `updated_at` timestamps.
 *
 * @param {string} name The user's full name
 * @param {string} email The user's email address (must be unique)
 * @param {string} passwordHash The bcrypt hash of the user's password
 * @param {string} role The user's role (e.g. 'user' or 'admin')
 * @param {string|null} currentPlanCode The code of the user's active plan
 * @returns {Promise<object>} The created user record
 */
async function createUser(name, email, passwordHash, role = 'user', currentPlanCode = null) {
  const query = `
    INSERT INTO users (name, email, password_hash, role, current_plan_code, created_at, updated_at)
    VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
    RETURNING id, name, email, role, current_plan_code as "currentPlanCode", created_at as "createdAt";
  `;
  const values = [name, email, passwordHash, role, currentPlanCode];
  const result = await pool.query(query, values);
  return result.rows[0];
}

/**
 * Retrieves a user record by email.
 *
 * @param {string} email The email to search for
 * @returns {Promise<object|undefined>} The user record or undefined if not found
 */
async function findUserByEmail(email) {
  const query = 'SELECT * FROM users WHERE email = $1';
  const result = await pool.query(query, [email]);
  return result.rows[0];
}

/**
 * Retrieves a user record by id.
 *
 * @param {number} id The user id
 * @returns {Promise<object|undefined>} The user record or undefined if not found
 */
async function findUserById(id) {
  const query = 'SELECT * FROM users WHERE id = $1';
  const result = await pool.query(query, [id]);
  return result.rows[0];
}

/**
 * Updates the current plan code for a user. Used when a user
 * subscribes to a new plan or downgrades. Also updates the
 * `updated_at` timestamp.
 *
 * @param {number} userId The ID of the user
 * @param {string|null} planCode The new plan code or null
 * @returns {Promise<object>} The updated user record
 */
async function updateUserPlan(userId, planCode) {
  const query = `
    UPDATE users
    SET current_plan_code = $1,
        updated_at = NOW()
    WHERE id = $2
    RETURNING *;
  `;
  const result = await pool.query(query, [planCode, userId]);
  return result.rows[0];
}

module.exports = {
  createUser,
  findUserByEmail,
  findUserById,
  updateUserPlan,
};