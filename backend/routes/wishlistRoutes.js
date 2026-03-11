const express = require('express');
const router = express.Router();
const {
    getWishlist,
    addToWishlist,
    removeFromWishlist,
    mergeWishlist
} = require('../controllers/wishlistController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect); // All routes are protected

router.get('/', getWishlist);
router.post('/add', addToWishlist);
router.delete('/remove', removeFromWishlist);
router.post('/merge', mergeWishlist);

module.exports = router;
