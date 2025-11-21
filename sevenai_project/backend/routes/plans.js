/**
 * Plans route.
 *
 * Exposes an endpoint to retrieve the list of subscription plans. No
 * authentication is required to view available plans.
 */

const express = require('express');
const router = express.Router();
const { getPlans } = require('../controllers/subscriptionController');

// GET /api/plans
router.get('/', getPlans);

module.exports = router;