import mongoose, { Schema, Document } from "mongoose";

export interface Category extends Document {
  name: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const CategorySchema = new Schema<Category>(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      unique: true,
      trim: true,
      maxlength: [50, "Name cannot exceed 50 characters"],
    },
    description: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<Category>("Category", CategorySchema);
