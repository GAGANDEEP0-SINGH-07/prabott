const Product = require('../models/Product');
const Order = require('../models/Order');
const User = require('../models/User');

// ─── ANALYTICS ────────────────────────────────────────────────────────────────

// @desc    Get dashboard analytics
// @route   GET /api/admin/analytics
// @access  Private/Admin
const getAnalytics = async (req, res) => {
    try {
        // Totals
        const totalOrders = await Order.countDocuments();
        const totalUsers = await User.countDocuments();
        const totalProducts = await Product.countDocuments();

        const revenueAgg = await Order.aggregate([
            { $match: { paymentStatus: { $in: ['Paid', 'Completed'] } } },
            { $group: { _id: null, total: { $sum: '$totalAmount' } } },
        ]);
        const totalRevenue = revenueAgg[0]?.total || 0;

        // Monthly revenue for last 6 months
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
        sixMonthsAgo.setDate(1);
        sixMonthsAgo.setHours(0, 0, 0, 0);

        const monthlySales = await Order.aggregate([
            { $match: { createdAt: { $gte: sixMonthsAgo }, paymentStatus: { $in: ['Paid', 'Completed'] } } },
            {
                $group: {
                    _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
                    revenue: { $sum: '$totalAmount' },
                    orders: { $sum: 1 },
                },
            },
            { $sort: { '_id.year': 1, '_id.month': 1 } },
        ]);

        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const salesTrend = monthlySales.map((m) => ({
            month: monthNames[m._id.month - 1],
            revenue: Math.round(m.revenue),
            orders: m.orders,
        }));

        // Top 5 selling products by quantity ordered
        const topProducts = await Order.aggregate([
            { $unwind: '$products' },
            { $group: { _id: '$products.productId', totalSold: { $sum: '$products.quantity' } } },
            { $sort: { totalSold: -1 } },
            { $limit: 5 },
            {
                $lookup: {
                    from: 'products',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'product',
                },
            },
            { $unwind: '$product' },
            { $project: { name: '$product.name', totalSold: 1, price: '$product.price' } },
        ]);

        res.json({ totalRevenue, totalOrders, totalUsers, totalProducts, salesTrend, topProducts });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ─── PRODUCTS ─────────────────────────────────────────────────────────────────

// @desc    Get all products (admin — no pagination limit)
// @route   GET /api/admin/products
// @access  Private/Admin
const getAdminProducts = async (req, res) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 20;
        const keyword = req.query.keyword
            ? { name: { $regex: req.query.keyword, $options: 'i' } }
            : {};

        const count = await Product.countDocuments(keyword);
        const products = await Product.find(keyword)
            .sort({ createdAt: -1 })
            .skip(limit * (page - 1))
            .limit(limit);

        res.json({ products, page, pages: Math.ceil(count / limit), total: count });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create product
// @route   POST /api/admin/products
// @access  Private/Admin
const createAdminProduct = async (req, res) => {
    try {
        const { name, description, price, category, stock, images, colors, features, ratings } = req.body;
        const product = new Product({
            name,
            description,
            price,
            category,
            stock,
            images: images || [],
            colors: colors || [],
            features: features || [],
            ratings: ratings || 0,
        });
        const created = await product.save();
        res.status(201).json(created);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update product
// @route   PUT /api/admin/products/:id
// @access  Private/Admin
const updateAdminProduct = async (req, res) => {
    try {
        const { name, description, price, category, stock, images, colors, features, ratings } = req.body;
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        product.name = name ?? product.name;
        product.description = description ?? product.description;
        product.price = price ?? product.price;
        product.category = category ?? product.category;
        product.stock = stock ?? product.stock;
        product.ratings = ratings ?? product.ratings;
        if (images) product.images = images;
        if (colors) product.colors = colors;
        if (features) product.features = features;

        const updated = await product.save();
        res.json(updated);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete product
// @route   DELETE /api/admin/products/:id
// @access  Private/Admin
const deleteAdminProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        await Product.deleteOne({ _id: product._id });
        res.json({ message: 'Product removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ─── ORDERS ───────────────────────────────────────────────────────────────────

// @desc    Get all orders
// @route   GET /api/admin/orders
// @access  Private/Admin
const getAdminOrders = async (req, res) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 20;
        const keyword = req.query.keyword;

        let query = {};
        if (keyword) {
            // Find users matching keyword to filter orders by userId
            const users = await User.find({
                $or: [
                    { name: { $regex: keyword, $options: 'i' } },
                    { email: { $regex: keyword, $options: 'i' } }
                ]
            }).select('_id');
            const userIds = users.map(u => u._id);
            query = { userId: { $in: userIds } };
        }

        const count = await Order.countDocuments(query);
        const orders = await Order.find(query)
            .sort({ createdAt: -1 })
            .skip(limit * (page - 1))
            .limit(limit)
            .populate('userId', 'name email')
            .populate('products.productId', 'name images price');

        res.json({ orders, page, pages: Math.ceil(count / limit), total: count });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get order by ID
// @route   GET /api/admin/orders/:id
// @access  Private/Admin
const getAdminOrderDetails = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('userId', 'name email')
            .populate('products.productId', 'name images price');

        if (!order) return res.status(404).json({ message: 'Order not found' });

        res.json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update order status
// @route   PUT /api/admin/orders/:id/status
// @access  Private/Admin
const updateAdminOrderStatus = async (req, res) => {
    try {
        const { orderStatus, paymentStatus } = req.body;
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ message: 'Order not found' });

        if (orderStatus) order.orderStatus = orderStatus;
        if (paymentStatus) order.paymentStatus = paymentStatus;

        const updated = await order.save();
        res.json(updated);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete order
// @route   DELETE /api/admin/orders/:id
// @access  Private/Admin
const deleteAdminOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ message: 'Order not found' });
        await Order.deleteOne({ _id: order._id });
        res.json({ message: 'Order removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ─── USERS ────────────────────────────────────────────────────────────────────

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
const getAdminUsers = async (req, res) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 20;

        const count = await User.countDocuments();
        const users = await User.find({})
            .select('-password')
            .sort({ createdAt: -1 })
            .skip(limit * (page - 1))
            .limit(limit);

        res.json({ users, page, pages: Math.ceil(count / limit), total: count });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get user by ID
// @route   GET /api/admin/users/:id
// @access  Private/Admin
const getAdminUserDetails = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Fetch recent orders for this user
        const orders = await Order.find({ userId: req.params.id })
            .sort({ createdAt: -1 })
            .limit(10);

        res.json({ ...user._doc, orders });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update user role
// @route   PUT /api/admin/users/:id/role
// @access  Private/Admin
const updateUserRole = async (req, res) => {
    try {
        const { role } = req.body;
        if (role === 'admin') {
            return res.status(403).json({ message: 'Promoting to Admin is only allowed via system scripts for security.' });
        }
        if (!['customer', 'user'].includes(role)) {
            return res.status(400).json({ message: 'Invalid role' });
        }
        // Prevent demoting yourself
        if (req.params.id === req.user._id.toString()) {
            return res.status(400).json({ message: 'Cannot change your own role' });
        }
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        user.role = role;
        const updated = await user.save();
        res.json({ _id: updated._id, name: updated.name, email: updated.email, role: updated.role });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Suspend / unsuspend user (toggle suspended flag)
// @route   PUT /api/admin/users/:id/suspend
// @access  Private/Admin
const suspendUser = async (req, res) => {
    try {
        if (req.params.id === req.user._id.toString()) {
            return res.status(400).json({ message: 'Cannot suspend yourself' });
        }
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        user.suspended = !user.suspended;
        const updated = await user.save();
        res.json({ _id: updated._id, name: updated.name, suspended: updated.suspended });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteAdminUser = async (req, res) => {
    try {
        if (req.params.id === req.user._id.toString()) {
            return res.status(400).json({ message: 'Cannot delete yourself' });
        }
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        await User.deleteOne({ _id: user._id });
        res.json({ message: 'User removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAnalytics,
    getAdminProducts, createAdminProduct, updateAdminProduct, deleteAdminProduct,
    getAdminOrders, getAdminOrderDetails, updateAdminOrderStatus, deleteAdminOrder,
    getAdminUsers, getAdminUserDetails, updateUserRole, suspendUser, deleteAdminUser,
};
