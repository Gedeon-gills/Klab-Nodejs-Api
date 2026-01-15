import express from 'express';
import { register, login, getMe, logout, changePassword, forgotPassword, resetPassword, updateMyProfile, adminUpdateUser, adminDeleteUser } from "../controllers/auth.js";

//middlewares

import { authenticate } from '../middleware/auth.js';
import { authorize } from "../middleware/authorize.js";


const router = express.Router();


// Public
router.post("/register", register);
router.post("/login", login);

// Authenticated (ALL ROLES)
router.get("/me", authenticate, getMe);
router.put("/me", authenticate, updateMyProfile);
router.post("/logout", authenticate, logout);
router.post("/change-password", authenticate, changePassword);

// Password reset
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:resetToken", resetPassword);

// ADMIN ONLY (RBAC)
router.put("/users/:id", authenticate, authorize("admin"), adminUpdateUser);
router.delete("/users/:id", authenticate, authorize("admin"), adminDeleteUser);

export default router;