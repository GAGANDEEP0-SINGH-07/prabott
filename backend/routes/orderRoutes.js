const express = require('express');
const router = express.Router();
const {
    createOrder,
    getMyOrders,
    getOrders,
    updateOrderStatus,
    updateOrderToPaid,
} = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');

router.post('/create', protect, createOrder);
router.get('/myorders', protect, getMyOrders);
router.get('/all', protect, admin, getOrders);
router.put('/update-status', protect, admin, updateOrderStatus);
router.put('/:id/pay', protect, updateOrderToPaid);

module.exports = router;
