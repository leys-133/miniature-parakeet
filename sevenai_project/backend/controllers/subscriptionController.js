/**
 * Controller for subscription and plan management endpoints.
 *
 * Provides handlers to list available plans and to subscribe users to
 * selected plans. The subscription endpoint must be protected by
 * authentication middleware.
 */

const { listPlans, subscribe } = require('../services/subscriptionService');

/**
 * Handles GET /api/plans
 */
async function getPlans(req, res, next) {
  try {
    const plans = listPlans();
    res.status(200).json({ plans });
  } catch (err) {
    next(err);
  }
}

/**
 * Handles POST /api/subscribe
 */
async function subscribeToPlan(req, res, next) {
  try {
    const userId = req.user.id;
    const { plan_code } = req.body;
    if (!plan_code) {
      return res.status(400).json({ message: 'plan_code is required' });
    }
    const subscription = await subscribe(userId, plan_code);
    res.status(200).json({ subscription });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getPlans,
  subscribeToPlan,
};