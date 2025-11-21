/**
 * Subscription service for managing plans and user subscriptions.
 *
 * Provides functions to list available plans, subscribe users to a
 * plan, and retrieve current subscription details. This service
 * encapsulates logic for calculating subscription durations and
 * updating user records.
 */

const { PLANS, getPlanByCode } = require('../utils/plansConfig');
const {
  createSubscription,
  getActiveSubscriptionByUserId,
  updateSubscription,
} = require('../models/subscriptionModel');
const { updateUserPlan } = require('../models/userModel');

/**
 * Returns all subscription plans defined in the configuration. This
 * function simply forwards the array, which can then be exposed via
 * the API for the frontend to display pricing.
 */
function listPlans() {
  return PLANS;
}

/**
 * Subscribes a user to a given plan. Handles plan validation,
 * calculates start and end dates based on plan duration, updates any
 * existing subscription records, and sets the user's current plan.
 *
 * @param {number} userId The ID of the user
 * @param {string} planCode The code of the desired plan
 * @returns {Promise<object>} The newly created or updated subscription
 */
async function subscribe(userId, planCode) {
  const plan = getPlanByCode(planCode);
  if (!plan) {
    const error = new Error('Invalid plan code');
    error.statusCode = 400;
    error.code = 'INVALID_PLAN';
    throw error;
  }
  // Determine subscription start and end dates
  const startAt = new Date();
  let endAt = null;
  if (plan.durationMonths !== null) {
    endAt = new Date(startAt);
    endAt.setMonth(endAt.getMonth() + plan.durationMonths);
  }
  // Check if user already has an active subscription
  const activeSub = await getActiveSubscriptionByUserId(userId);
  let subscription;
  if (activeSub) {
    // Update existing subscription (e.g. upgrading or renewing)
    subscription = await updateSubscription(activeSub.id, {
      plan_code: plan.code,
      status: 'active',
      start_at: startAt,
      end_at: endAt,
    });
  } else {
    // Create a new subscription
    subscription = await createSubscription(userId, plan.code, 'active', startAt, endAt);
  }
  // Update user's current plan code
  await updateUserPlan(userId, plan.code);
  return subscription;
}

module.exports = {
  listPlans,
  subscribe,
};