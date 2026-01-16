import mongoose, { Schema } from 'mongoose';
const CategorySchema = new Schema({
    id: {
        type: Number,
        required: [true, 'Category ID is required'],
        unique: true
    },
    name: {
        type: String,
        required: [true, 'Category name is required'],
        maxlength: [50, 'Name cannot exceed 50 characters'],
        unique: true
    },
    description: {
        type: String,
    },
}, {
    timestamps: true // Automatically adds createdAt and updatedAt
});
export default mongoose.model('Category', CategorySchema);
