import mongoose, { Schema } from "mongoose";
const CategorySchema = new Schema({
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
}, {
    timestamps: true,
});
export default mongoose.model("Category", CategorySchema);
