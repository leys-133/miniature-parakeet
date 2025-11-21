/**
 * Chat service for handling conversation interactions and enforcing
 * subscription quotas. This service checks the user's plan, tracks
 * usage, and delegates message generation to the agent service.
 */

const { getActiveSubscriptionByUserId } = require('../models/subscriptionModel');
const { createMessage, getMessagesByUserId } = require('../models/messageModel');
const { upsertUsage, getUsage } = require('../models/usageModel');
const { getPlanByCode } = require('../utils/plansConfig');
const { getAgentReply } = require('./agentService');

/**
 * Determines the current usage period boundaries based on plan duration.
 * Currently this implementation uses calendar months for all plans
 * except lifetime plans where the period is arbitrarily one month.
 *
 * @returns {{ periodStart: Date, periodEnd: Date }}
 */
function getCurrentPeriod() {
  const now = new Date();
  // Start at the beginning of the current month
  const periodStart = new Date(now.getFullYear(), now.getMonth(), 1);
  // End at the end of the current month
  const periodEnd = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  return { periodStart, periodEnd };
}

/**
 * Processes a chat request from a user. Validates subscription limits,
 * updates usage counters, stores messages in the database and returns
 * the assistant's reply.
 *
 * @param {object} user The authenticated user object (contains id and email)
 * @param {string} userMessage The message content from the user
 * @returns {Promise<string>} The assistant's reply
 */
async function processChat(user, userMessage) {
  const userId = user.id;
  // Load the user's active subscription
  const subscription = await getActiveSubscriptionByUserId(userId);
  let planCode = subscription?.plan_code || user.current_plan_code || 'BASIC';
  let plan = getPlanByCode(planCode);
  if (!plan) {
    // Fallback to BASIC if unknown
    plan = getPlanByCode('BASIC');
    planCode = 'BASIC';
  }
  // Determine the current usage period and fetch usage
  const { periodStart, periodEnd } = getCurrentPeriod();
  const usage = await getUsage(userId, periodStart, periodEnd);
  const messagesUsed = usage ? usage.messages_used : 0;

  // Check against message limit if one is defined
  if (plan.messageLimit !== null && messagesUsed >= plan.messageLimit) {
    const error = new Error(
      'تم تجاوز الحد الشهري للرسائل لخطة اشتراكك الحالية. يمكنك الترقية لزيادة الحد.'
    );
    error.statusCode = 429;
    error.code = 'LIMIT_REACHED';
    throw error;
  }

  // Fetch previous messages for context (limit to last 10)
  const historyRecords = await getMessagesByUserId(userId, 10);
  const history = historyRecords.map((msg) => ({ role: msg.role, content: msg.content }));
  // Generate agent reply
  const reply = await getAgentReply(history, userMessage);

  // Store both user and assistant messages
  await createMessage(userId, 'user', userMessage);
  await createMessage(userId, 'assistant', reply);
  // Update usage: increment messages used by 1 (user message counts as one)
  await upsertUsage(userId, planCode, periodStart, periodEnd, 1);

  return reply;
}

module.exports = {
  processChat,
};