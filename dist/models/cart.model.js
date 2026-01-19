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
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    items: { type: [CartItemSchema], default: [] }
}, { timestamps: true });
export default mongoose.model('Cart', CartSchema);
