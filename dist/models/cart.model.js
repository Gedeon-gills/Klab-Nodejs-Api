import mongoose, { Schema } from 'mongoose';
const CartItemSchema = new Schema({
    productId: {
        type: Number,
        required: [true, 'Product ID is required']
    },
    quantity: {
        type: Number,
        required: [true, 'Quantity is required'],
        min: [1, 'Quantity must be at least 1']
    }
});
const CartSchema = new Schema({
    id: {
        type: Number,
        required: [true, 'Cart ID is required'],
        unique: true
    },
    userId: {
        type: Number,
        required: [true, 'User ID is required']
    },
    items: {
        type: [CartItemSchema],
        default: []
    }
}, {
    timestamps: true // Automatically adds createdAt and updatedAt
});
export default mongoose.model('Cart', CartSchema);
