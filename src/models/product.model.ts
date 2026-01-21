import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  category: string;
  categoryId: number;
  description?: string;
  price: number;
  inStock: boolean;
  quantity: number;
  images: string[]; 
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
      required: false,
    },
    description: String,
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    inStock: {
    type: Boolean,
    default: true,
    },
    quantity: {
      type: Number,
      default: 1,
    },
    images: [{
      type: String,
      default: []
    }]
  },
  { timestamps: true }
);

export default mongoose.model<IProduct>('Product', ProductSchema);