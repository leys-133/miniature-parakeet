/**
 * Controller for authentication endpoints.
 *
 * Defines handlers for user registration, login and retrieving the
 * currently authenticated user's information. Controller functions
 * delegate business logic to the auth service and models.
 */

const { register, login } = require('../services/authService');
const { findUserById } = require('../models/userModel');
const { getActiveSubscriptionByUserId } = require('../models/subscriptionModel');
const { getPlanByCode } = require('../utils/plansConfig');

/**
 * Handles POST /api/auth/register
 */
async function registerUser(req, res, next) {
  try {
    const { name, email, password } = req.body;
    const { user, token } = await register(name, email, password);
    res.status(201).json({ user, token });
  } catch (err) {
    next(err);
  }
}

/**
 * Handles POST /api/auth/login
 */
async function loginUser(req, res, next) {
  try {
    const { email, password } = req.body;
    const { user, token } = await login(email, password);
    res.status(200).json({ user, token });
  } catch (err) {
    next(err);
  }
}

/**
 * Handles GET /api/auth/me
 * Requires JWT authentication middleware.
 */
async function getMe(req, res, next) {
  try {
    const userId = req.user.id;
    const user = await findUserById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    // Get active subscription and plan details
    const subscription = await getActiveSubscriptionByUserId(userId);
    let plan = null;
    if (subscription) {
      plan = getPlanByCode(subscription.plan_code);
    } else if (user.current_plan_code) {
      plan = getPlanByCode(user.current_plan_code);
    }
    // Remove sensitive info
    const { password_hash, ...safeUser } = user;
    res.status(200).json({ user: safeUser, subscription, plan });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  registerUser,
  loginUser,
  getMe,
};