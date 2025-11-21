/**
 * Authentication service for handling user registration and login.
 *
 * This module interacts with the user model to create new users and
 * verify credentials. It hashes passwords using bcrypt and issues
 * JSON Web Tokens (JWT) upon successful registration or login.
 */

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { createUser, findUserByEmail } = require('../models/userModel');
const { getPlanByCode } = require('../utils/plansConfig');

/**
 * Registers a new user.
 *
 * @param {string} name The user's name
 * @param {string} email The user's email
 * @param {string} password The user's password (plaintext)
 * @returns {Promise<{user: object, token: string}>}
 */
async function register(name, email, password) {
  // Ensure the email is not already in use
  const existing = await findUserByEmail(email);
  if (existing) {
    const error = new Error('Email already registered');
    error.statusCode = 400;
    error.code = 'EMAIL_EXISTS';
    throw error;
  }
  // Hash the password
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);
  // Assign a default plan code (e.g. BASIC) or null
  const defaultPlan = getPlanByCode('BASIC');
  const currentPlanCode = defaultPlan ? defaultPlan.code : null;
  // Create the user
  const user = await createUser(name, email, passwordHash, 'user', currentPlanCode);
  // Generate JWT token
  const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
  return { user, token };
}

/**
 * Authenticates a user by email and password.
 *
 * @param {string} email The user's email
 * @param {string} password The plaintext password
 * @returns {Promise<{user: object, token: string}>}
 */
async function login(email, password) {
  const user = await findUserByEmail(email);
  if (!user) {
    const error = new Error('Invalid credentials');
    error.statusCode = 401;
    error.code = 'INVALID_CREDENTIALS';
    throw error;
  }
  const match = await bcrypt.compare(password, user.password_hash);
  if (!match) {
    const error = new Error('Invalid credentials');
    error.statusCode = 401;
    error.code = 'INVALID_CREDENTIALS';
    throw error;
  }
  // Issue token
  const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
  // Omit password hash from returned user
  const { password_hash, ...safeUser } = user;
  return { user: safeUser, token };
}

module.exports = {
  register,
  login,
};