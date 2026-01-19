export {};
/*import mongoose from "mongoose";
import IUser from "../models/user.model.js";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

const seedAdmin = async () => {
  try {
    // 1️⃣ Connect to DB
    await mongoose.connect(process.env.MONGO_URI || "mongodb+srv://Gedeon:wakasso01@klab-cluster0.bx8bxxa.mongodb.net/?appName=klab-Cluster0");
    console.log("✅ Connected to MongoDB");

    // 2️⃣ Check if admin already exists
    const existingAdmin = await IUser.findOne({ role: "admin" });
    if (existingAdmin) {
      console.log("⚠️ Admin already exists:", existingAdmin.email);
      process.exit();
    }

    // 3️⃣ Hash default password
    const hashedPassword = await bcrypt.hash("Admin123!", 10);

    // 4️⃣ Create first admin
    const admin = await IUser.create({
      name: "Super Admin",
      email: "admin@example.com",
      password: hashedPassword,
      role: "admin",
      isActive: true,
    });

    console.log("✅ First admin created successfully");
    console.log("Email:", admin.email);
    console.log("Password:", "Admin123!"); // Default, you should change after first login

    process.exit();
  } catch (error: any) {
    console.error("❌ Error creating admin:", error.message);
    process.exit(1);
  }
};

seedAdmin();*/
