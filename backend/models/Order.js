const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
            index: true,
        },
        products: [
            {
                productId: {
                    type: mongoose.Schema.Types.ObjectId,
                    required: true,
                    ref: 'Product',
                },
                quantity: {
                    type: Number,
                    required: true,
                },
            },
        ],
        totalAmount: {
            type: Number,
            required: true,
            default: 0.0,
        },
        shippingAddress: {
            address: { type: String, required: true },
            city: { type: String, required: true },
            postalCode: { type: String, required: true },
            country: { type: String, required: true },
        },
        paymentMethod: {
            type: String,
            required: true,
        },
        paymentResult: {
            id: { type: String },
            status: { type: String },
            update_time: { type: Date },
            email_address: { type: String },
        },
        paymentStatus: {
            type: String,
            enum: ['Pending', 'Pending Payment', 'Completed', 'Failed', 'Paid'],
            default: 'Pending Payment',
        },
        orderStatus: {
            type: String,
            enum: ['Pending', 'Pending Payment', 'Processing', 'Shipped', 'Delivered'],
            default: 'Pending Payment',
        },

    },
    {
        timestamps: true,
    }
);

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
