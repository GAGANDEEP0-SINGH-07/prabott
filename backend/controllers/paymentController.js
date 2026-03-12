const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Order = require('../models/Order');
const Product = require('../models/Product');

// @desc    Create Payment Intent
// @route   POST /api/payments/create-payment-intent
// @access  Private
const createPaymentIntent = async (req, res) => {
    try {
        if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY.includes('placeholder')) {
            return res.status(500).json({
                message: 'Stripe API keys are not configured. Please add valid STRIPE_SECRET_KEY to your backend .env file.'
            });
        }

        const { orderId } = req.body;

        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Create a PaymentIntent with the order amount and currency
        // amount must be in smallest currency unit (e.g., pence for GBP or cents for USD)
        // Assume order.totalAmount is in normal currency (e.g. 50.99)
        const amountInCents = Math.round(order.totalAmount * 100);

        const paymentIntent = await stripe.paymentIntents.create({
            amount: amountInCents,
            currency: 'gbp', // Default to GBP based on UI showing £
            metadata: {
                orderId: order._id.toString(),
                userId: req.user._id.toString(),
            },
        });

        res.json({
            clientSecret: paymentIntent.client_secret,
        });
    } catch (error) {
        console.error('Error creating payment intent:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Stripe Webhook handler
// @route   POST /api/payments/webhook
// @access  Public
const stripeWebhook = async (req, res) => {
    const sig = req.headers['stripe-signature'];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
        console.error(`Webhook Error: ${err.message}`);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
        case 'payment_intent.succeeded': {
            const paymentIntentSuccess = event.data.object;
            const orderId = paymentIntentSuccess.metadata.orderId;

            if (orderId) {
                const order = await Order.findById(orderId);
                if (order) {
                    if (order.paymentStatus === 'Paid') {
                        break;
                    }
                    order.paymentStatus = 'Paid';
                    order.orderStatus = 'Processing';

                    // Add stripe transaction id to paymentResult
                    order.paymentResult = {
                        id: paymentIntentSuccess.id,
                        status: paymentIntentSuccess.status,
                        update_time: new Date().toISOString(),
                        email_address: paymentIntentSuccess.receipt_email || '',
                    };

                    // Deduct stock
                    for (const item of order.products) {
                        await Product.findByIdAndUpdate(item.productId, {
                            $inc: { stock: -item.quantity }
                        });
                    }

                    await order.save();
                    console.log(`Order ${orderId} marked as Paid via webhook`);
                }
            }
            break;
        }
        case 'payment_intent.payment_failed': {
            const paymentIntentFailed = event.data.object;
            const orderId = paymentIntentFailed.metadata.orderId;

            if (orderId) {
                const order = await Order.findById(orderId);
                if (order) {
                    order.paymentStatus = 'Failed';
                    order.orderStatus = 'Pending'; // or Payment Failed
                    await order.save();
                    console.log(`Order ${orderId} marked as Failed via webhook`);
                }
            }
            break;
        }
        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    // Return a 200 response to acknowledge receipt of the event
    res.status(200).send();
};

module.exports = {
    createPaymentIntent,
    stripeWebhook,
};
