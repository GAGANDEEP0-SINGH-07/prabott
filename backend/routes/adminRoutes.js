const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');

const {
    getAnalytics,
    getAdminProducts, createAdminProduct, updateAdminProduct, deleteAdminProduct,
    getAdminOrders, getAdminOrderDetails, updateAdminOrderStatus, deleteAdminOrder,
    getAdminUsers, getAdminUserDetails, updateUserRole, suspendUser, deleteAdminUser,
} = require('../controllers/adminController');

// All admin routes require auth + admin role
router.use(protect, admin);

// Analytics
router.get('/analytics', getAnalytics);

// Products
router.route('/products')
    .get(getAdminProducts)
    .post(createAdminProduct);

router.route('/products/:id')
    .put(updateAdminProduct)
    .delete(deleteAdminProduct);

// Orders
router.get('/orders', getAdminOrders);
router.route('/orders/:id')
    .get(getAdminOrderDetails)
    .delete(deleteAdminOrder);
router.put('/orders/:id/status', updateAdminOrderStatus);

// Users
router.get('/users', getAdminUsers);
router.route('/users/:id')
    .get(getAdminUserDetails)
    .delete(deleteAdminUser);
router.put('/users/:id/role', updateUserRole);
router.put('/users/:id/suspend', suspendUser);

module.exports = router;
