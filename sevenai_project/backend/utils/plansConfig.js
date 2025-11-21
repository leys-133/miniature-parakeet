/**
 * Subscription plans configuration for SevenAI.
 *
 * Each plan object defines the following properties:
 * - code: A unique identifier for use within the codebase.
 * - name: A human‑readable display name.
 * - price: The cost in USD (decimal), represented as a number.
 * - durationMonths: The number of months the subscription is valid. Use
 *   `null` for lifetime plans.
 * - messageLimit: The maximum number of messages allowed per period.
 *   Use `null` for unlimited messaging.
 *
 * To adjust pricing, message limits, or add new plans, edit the
 * exported `PLANS` array. When adding new plans, ensure the `code`
 * remains unique and update any frontend logic that depends on the plan
 * structure.
 */

const PLANS = [
  {
    code: 'BASIC',
    name: 'Basic',
    price: 1,
    durationMonths: 1,
    messageLimit: 50, // reasonable default for a low‑tier plan
  },
  {
    code: 'PLUS',
    name: 'Plus',
    price: 2,
    durationMonths: 1,
    messageLimit: 100,
  },
  {
    code: 'PRO',
    name: 'Pro',
    price: 3,
    durationMonths: 1,
    messageLimit: 200,
  },
  {
    code: 'SEVEN',
    name: 'Seven',
    price: 7,
    durationMonths: 7,
    messageLimit: null, // unlimited messages for seven months
  },
  {
    code: 'SEVEN_PRO',
    name: 'Seven Pro',
    price: 100,
    durationMonths: null, // lifetime subscription
    messageLimit: null,
  },
];

/**
 * Retrieves a plan object by its code. Returns undefined if not found.
 *
 * @param {string} code The unique plan code
 * @returns {object|undefined}
 */
function getPlanByCode(code) {
  return PLANS.find((plan) => plan.code === code);
}

module.exports = {
  PLANS,
  getPlanByCode,
};