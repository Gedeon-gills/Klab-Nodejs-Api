import mongoose, { Schema, Document } from 'mongoose';

export interface Product extends Document{
  id: number;
  name: string;
  price: number;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Cart extends Document {
  id: number;
  userId: number;
  items: CartItem[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CartItem extends Document {
  productId: number;
  quantity: number;
}

const CartItemSchema = new Schema<CartItem>({
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

const CartSchema = new Schema<Cart>({
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
  timestamps: true  // Automatically adds createdAt and updatedAt
});

export default mongoose.model<Cart>('Cart', CartSchema);