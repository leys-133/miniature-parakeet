/**
 * Subscription routes.
 *
 * Contains the endpoint to subscribe a user to a plan. This endpoint
 * should be protected by JWT authentication and will simulate the
 * payment/upgrade process.
 */

const express = require('express');
const router = express.Router();
const { subscribeToPlan } = require('../controllers/subscriptionController');
const { authenticateToken } = require('../middleware/authMiddleware');

// POST /api/subscribe
router.post('/', authenticateToken, subscribeToPlan);

module.exports = router;