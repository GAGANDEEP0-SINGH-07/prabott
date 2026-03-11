const Order = require('../models/Order');
const Cart = require('../models/Cart');

// @desc    Create new order
// @route   POST /api/orders/create
// @access  Private
const createOrder = async (req, res) => {
    try {
        const {
            products,
            shippingAddress,
            paymentMethod,
            totalAmount,
            paymentResult,
        } = req.body;

        if (!products || products.length === 0) {
            return res.status(400).json({ message: 'No order items' });
        }

        const order = new Order({
            userId: req.user._id,
            products,
            shippingAddress,
            paymentMethod: paymentMethod || 'Stripe',
            totalAmount,
            paymentResult: paymentResult || undefined,
            paymentStatus: (paymentResult?.status === 'succeeded' || paymentResult?.status === 'success') ? 'Paid' : 'Pending Payment',
            orderStatus: (paymentResult?.status === 'succeeded' || paymentResult?.status === 'success') ? 'Processing' : 'Pending Payment',
        });

        const createdOrder = await order.save();

        // Only clear cart if payment succeeded directly (fallback if not using decoupled webhook)
        // With decoupled flow, cart is cleared by the frontend after successful confirmCardPayment
        if (paymentResult?.status === 'succeeded' || paymentResult?.status === 'success') {
            await Cart.findOneAndDelete({ userId: req.user._id });
        }

        res.status(201).json(createdOrder);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.user._id }).sort({ createdAt: -1 }).populate('products.productId', 'name images price');
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all orders
// @route   GET /api/orders/all
// @access  Private/Admin
const getOrders = async (req, res) => {
    try {
        const orders = await Order.find({}).sort({ createdAt: -1 }).populate('userId', 'id name email');
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update order status
// @route   PUT /api/orders/update-status
// @access  Private/Admin
const updateOrderStatus = async (req, res) => {
    try {
        const { orderId, orderStatus, paymentStatus } = req.body;

        const order = await Order.findById(orderId);

        if (order) {
            order.orderStatus = orderStatus || order.orderStatus;
            order.paymentStatus = paymentStatus || order.paymentStatus;

            const updatedOrder = await order.save();
            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
const updateOrderToPaid = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (order) {
            order.paymentStatus = 'Paid';
            order.orderStatus = 'Processing';
            order.paymentResult = {
                id: req.body.id,
                status: req.body.status,
                update_time: req.body.update_time,
                email_address: req.body.email_address,
            };

            const updatedOrder = await order.save();
            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createOrder,
    getMyOrders,
    getOrders,
    updateOrderStatus,
    updateOrderToPaid,
};
