import mongoose, { Schema, Document, Types } from 'mongoose';

export interface Product extends Document {
  name: string;
  price: number;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Cart extends Document {
  userId: Types.ObjectId; 
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
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  items: { type: [CartItemSchema], default: [] }
}, { timestamps: true });

export default mongoose.model<Cart>('Cart', CartSchema);