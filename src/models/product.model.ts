import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  id: number;
  name: string;
  category: string;
  categoryId: number;
  description: string;
  price: number;
  images: string[];
}

const ProductSchema = new Schema<IProduct>({
  id: { 
    type: Number, 
    required: [true, 'Product ID is required'], 
    unique: true 
  },
  name: { 
    type: String, 
    required: [true, 'Product name is required'],
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  category: {
    type: String,
    required: [true, 'Product category is required'],
    enum: ['Electronics', 'Accessories', 'Clothing', 'Books']
  },
  categoryId: { 
    type: Number, 
    required: [true, 'Product category ID is required'] 
  },
  description: { 
    type: String, 
  },
  price: { 
    type: Number, 
    required: [true, 'Product price is required'],
    min: [0, 'Price cannot be negative']
  },
  images: { 
    type: [String], 
    required: [true, 'Product images are required'] 
  },
    
},{
  timestamps: true  // Automatically adds createdAt and updatedAt
});

export default mongoose.model<IProduct>('Product', ProductSchema);