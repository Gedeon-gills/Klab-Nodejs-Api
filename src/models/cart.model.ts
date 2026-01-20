import mongoose, { Schema, Types, Document } from "mongoose";

export interface ICartItem {
  productId: Types.ObjectId;
  quantity: number;
}

export interface ICart extends Document {
  userId: Types.ObjectId;
  items: ICartItem[];
  createdAt?: Date;
  updatedAt?: Date;
}

const CartItemSchema = new Schema<ICartItem>({
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, default: 1 },
});

const CartSchema = new Schema<ICart>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    items: [CartItemSchema],
  },
  { timestamps: true }
);

export default mongoose.model<ICart>("Cart", CartSchema);