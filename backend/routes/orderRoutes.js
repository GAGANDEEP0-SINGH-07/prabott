const express = require('express');
const router = express.Router();
const {
    createOrder,
    getMyOrders,
    getOrders,
    updateOrderStatus,
} = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');

router.post('/create', protect, createOrder);
router.get('/myorders', protect, getMyOrders);
router.get('/all', protect, admin, getOrders);
router.put('/update-status', protect, admin, updateOrderStatus);

module.exports = router;
