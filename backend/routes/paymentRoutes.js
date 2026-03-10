const express = require('express');
const router = express.Router();
const { createPaymentIntent, stripeWebhook } = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware'); // if auth is applied

// Protect this route, only authenticated users can create payment intents
router.post('/create-payment-intent', protect, createPaymentIntent);

// Webhook must NOT use protect middleware as it's called by Stripe
// We also use express.raw for it in server.js, so we handle it there
router.post('/webhook', stripeWebhook);

module.exports = router;
