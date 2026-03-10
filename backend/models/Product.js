const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            index: true,
        },
        description: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        category: {
            type: String,
            required: true,
        },
        stock: {
            type: Number,
            required: true,
            default: 0,
        },
        images: [
            {
                type: String,
                required: true,
            },
        ],
        ratings: {
            type: Number,
            required: true,
            default: 0,
        },
        numReviews: {
            type: Number,
            required: true,
            default: 0,
        },
        colors: [String],
        features: [
            {
                label: String,
                value: String,
            }
        ],
        reviews: [
            {
                name: { type: String, required: true },
                rating: { type: Number, required: true },
                comment: { type: String, required: true },
                user: {
                    type: mongoose.Schema.Types.ObjectId,
                    required: true,
                    ref: 'User',
                },
            },
            { timestamps: true }
        ],
    },
    {
        timestamps: true,
    }
);

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
