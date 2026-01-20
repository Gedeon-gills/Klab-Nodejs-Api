import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  category: string;
  categoryId: number;
  description?: string;
  price: number;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: true,
      maxlength: 50,
    },
    category: {
      type: String,
      enum: ["Electronics", "Accessories", "Clothing", "Books"],
      required: true,
    },
    categoryId: {
      type: Number,
      required: true,
    },
    description: String,
    price: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model<IProduct>('Product', ProductSchema);