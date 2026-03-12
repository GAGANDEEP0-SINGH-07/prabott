const Cart = require('../models/Cart');
const Product = require('../models/Product');

// @desc    Add product to cart
// @route   POST /api/cart/add
// @access  Private
const addToCart = async (req, res) => {
    try {
        const { productId, productName, quantity = 1 } = req.body;
        console.log(`[DEBUG] Attempting to add product ID: ${productId}, name: ${productName || 'N/A'} to cart`);

        if (!productId && !productName) {
            return res.status(400).json({ message: 'productId or productName is required' });
        }

        let product = null;
        const mongoose = require('mongoose');

        // Try finding by _id first (only if it looks like a valid ObjectId)
        if (productId && mongoose.Types.ObjectId.isValid(productId)) {
            product = await Product.findById(productId);
        }

        // Fallback: loose name matching if _id lookup failed or productId was invalid
        if (!product && productName) {
            // First try exact match (case insensitive)
            product = await Product.findOne({ name: { $regex: new RegExp(`^${productName.trim()}$`, 'i') } });

            // If not found, try partial word match
            if (!product) {
                const searchRegex = productName.split(' ').filter(p => p.length > 2).map(w => `(?=.*${w})`).join('');
                if (searchRegex) {
                    product = await Product.findOne({ name: { $regex: searchRegex, $options: 'i' } });
                }
            }
            console.log(`[DEBUG] Fallback name lookup for "${productName}": ${product ? 'FOUND ' + product._id : 'NOT FOUND'}`);
        }

        if (!product) {
            console.log(`[DEBUG] Product not found for ID: ${productId}, name: ${productName}. Using fallback dummy product or failing.`);
            return res.status(404).json({ message: `Product "${productName}" not found in database. Please seed DB.` });
        }

        // Check stock
        if (product.stock < quantity) {
            return res.status(400).json({ message: `Insufficient stock. Only ${product.stock} left.` });
        }

        // Use the actual MongoDB _id from the found product
        const actualProductId = product._id;

        let cart = await Cart.findOne({ userId: req.user._id });

        if (cart) {
            const itemIndex = cart.products.findIndex(
                (p) => p.productId.toString() === actualProductId.toString()
            );

            if (itemIndex > -1) {
                cart.products[itemIndex].quantity += quantity;
            } else {
                cart.products.push({ productId: actualProductId, quantity });
            }
        } else {
            cart = await Cart.create({
                userId: req.user._id,
                products: [{ productId: actualProductId, quantity }],
            });
        }

        await cart.populate('products.productId', 'price');

        cart.totalPrice = cart.products.reduce((acc, item) => {
            if (item.productId) {
                return acc + (item.productId.price * item.quantity);
            }
            return acc;
        }, 0);

        await cart.save();

        const updatedCart = await Cart.findOne({ userId: req.user._id }).populate('products.productId', 'name price images stock');
        console.log(`[DEBUG] Successfully added product "${product.name}" to cart.`);
        res.status(200).json(updatedCart);
    } catch (error) {
        console.error('[ERROR] addToCart failed:', error.message);
        res.status(500).json({ message: 'Server error: ' + error.message });
    }
};

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
const getCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.user._id }).populate('products.productId', 'name price images stock');
        if (cart) {
            res.status(200).json(cart);
        } else {
            // Return an empty cart instead of 404 — user just hasn't added anything yet
            res.status(200).json({ products: [], totalPrice: 0 });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Remove product from cart
// @route   DELETE /api/cart/remove
// @access  Private
const removeFromCart = async (req, res) => {
    try {
        const { productId } = req.body;

        let cart = await Cart.findOne({ userId: req.user._id });

        if (cart) {
            cart.products = cart.products.filter(
                (p) => p.productId.toString() !== productId
            );

            await cart.populate('products.productId', 'price');
            cart.totalPrice = cart.products.reduce((acc, item) => {
                if (item.productId) {
                    return acc + (item.productId.price * item.quantity);
                }
                return acc;
            }, 0);

            await cart.save();
            const updatedCart = await Cart.findOne({ userId: req.user._id }).populate('products.productId', 'name price images stock');
            res.status(200).json(updatedCart);
        } else {
            res.status(404).json({ message: 'Cart not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/update
// @access  Private
const updateCartQuantity = async (req, res) => {
    try {
        const { productId, quantity } = req.body;

        if (quantity < 1) {
            return res.status(400).json({ message: 'Quantity must be at least 1' });
        }

        let cart = await Cart.findOne({ userId: req.user._id });

        if (cart) {
            const itemIndex = cart.products.findIndex(
                (p) => p.productId.toString() === productId
            );

            if (itemIndex > -1) {
                // Check stock
                const product = await Product.findById(productId);
                if (product && product.stock < quantity) {
                    return res.status(400).json({ message: `Insufficient stock. Only ${product.stock} left.` });
                }

                cart.products[itemIndex].quantity = quantity;

                await cart.populate('products.productId', 'price');
                cart.totalPrice = cart.products.reduce((acc, item) => {
                    if (item.productId) {
                        return acc + (item.productId.price * item.quantity);
                    }
                    return acc;
                }, 0);

                await cart.save();
                const updatedCart = await Cart.findOne({ userId: req.user._id }).populate('products.productId', 'name price images stock');
                res.status(200).json(updatedCart);
            } else {
                res.status(404).json({ message: 'Product not found in cart' });
            }
        } else {
            res.status(404).json({ message: 'Cart not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { addToCart, getCart, removeFromCart, updateCartQuantity };
