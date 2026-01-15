import mongoose from "mongoose";
const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGODB_URI;
        await mongoose.connect(mongoURI || "mongodb+srv://Gedeon:wakasso01@klab-cluster0.bx8bxxa.mongodb.net/?appName=klab-Cluster0");
        console.log("✅ Connected to MongoDB");
    }
    catch (error) {
        console.error("❌ MongoDB connection error:", error);
        process.exit(1);
    }
};
export default connectDB;
