const Wishlist = require('../models/Wishlist');
const Product = require('../models/Product');

// @desc    Get user wishlist
// @route   GET /api/wishlist
// @access  Private
const getWishlist = async (req, res) => {
    try {
        let wishlist = await Wishlist.findOne({ userId: req.user._id }).populate('products', 'name price images category stock');
        if (!wishlist) {
            wishlist = await Wishlist.create({ userId: req.user._id, products: [] });
        }
        res.json(wishlist);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add product to wishlist
// @route   POST /api/wishlist/add
// @access  Private
const addToWishlist = async (req, res) => {
    try {
        const { productId } = req.body;
        let wishlist = await Wishlist.findOne({ userId: req.user._id });

        if (!wishlist) {
            wishlist = await Wishlist.create({ userId: req.user._id, products: [productId] });
        } else {
            if (wishlist.products.includes(productId)) {
                return res.status(400).json({ message: 'Product already in wishlist' });
            }
            wishlist.products.push(productId);
            await wishlist.save();
        }

        const updatedWishlist = await Wishlist.findOne({ userId: req.user._id }).populate('products', 'name price images category stock');
        res.json(updatedWishlist);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Remove product from wishlist
// @route   DELETE /api/wishlist/remove
// @access  Private
const removeFromWishlist = async (req, res) => {
    try {
        const { productId } = req.body;
        let wishlist = await Wishlist.findOne({ userId: req.user._id });

        if (wishlist) {
            wishlist.products = wishlist.products.filter(p => p.toString() !== productId);
            await wishlist.save();
            const updatedWishlist = await Wishlist.findOne({ userId: req.user._id }).populate('products', 'name price images category stock');
            res.json(updatedWishlist);
        } else {
            res.status(404).json({ message: 'Wishlist not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Merge guest wishlist with user wishlist
// @route   POST /api/wishlist/merge
// @access  Private
const mergeWishlist = async (req, res) => {
    try {
        const { productIds } = req.body; // Array of product IDs from local storage
        if (!Array.isArray(productIds)) {
            return res.status(400).json({ message: 'productIds must be an array' });
        }

        let wishlist = await Wishlist.findOne({ userId: req.user._id });

        if (!wishlist) {
            wishlist = await Wishlist.create({ userId: req.user._id, products: productIds });
        } else {
            // Merge and remove duplicates
            const existingIds = wishlist.products.map(p => p.toString());
            const newIds = productIds.filter(id => !existingIds.includes(id));
            wishlist.products.push(...newIds);
            await wishlist.save();
        }

        const updatedWishlist = await Wishlist.findOne({ userId: req.user._id }).populate('products', 'name price images category stock');
        res.json(updatedWishlist);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getWishlist,
    addToWishlist,
    removeFromWishlist,
    mergeWishlist
};
