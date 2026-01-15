import { Request, Response } from 'express';
import  IUser  from '../models/user.model.js';
import { generateToken } from '../utils/jwt.helper.js';
import crypto from 'crypto';


/**
 * @swagger
 * /api/v1/endpoint:              ← Endpoint path
 *   post:                         ← HTTP method
 *     summary: Description        ← Short description
 *     tags: [Category]            ← Group by category
 *     security:                   ← Authentication
 *       - bearerAuth: []
 *     parameters:                 ← URL/Query params
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:                ← Request data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               field:
 *                 type: string
 *     responses:                  ← Response codes
 *       200:
 *         description: Success
 *       400:
 *         description: Bad Request
 */

// POST /auth/register
/**
 * @swagger
 * /api/v1/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 6
 *                 example: password123
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: User registered successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                         name:
 *                           type: string
 *                         email:
 *                           type: string
 *                     token:
 *                       type: string
 *       400:
 *         description: Missing required fields
 *       409:
 *         description: User already exists
 */
export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const existingUser = await IUser.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: "User already exists" });
    }

    const user = await IUser.create({
      name,
      email,
      password, // hashed in model
      role: "customer", // default
    });

    const token = generateToken(user._id.toString(), user.role);

    const { password: _, ...userResponse } = user.toObject();

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: { user: userResponse, token },
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// POST /auth/login

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: password123
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Login successful
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                 user:
 *                   type: object
 *       401:
 *         description: Invalid credentials
 */
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" });
    }

    const user = await IUser.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    if (!user.isActive) {
      return res.status(403).json({ error: "Account is deactivated" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = generateToken(user._id.toString(), user.role);
    const { password: _, ...userResponse } = user.toObject();

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: { user: userResponse, token },
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// GET /auth/me  (ALL ROLES – SELF)
/**
 * @swagger
 * /api/v1/auth/me:
 *   get:
 *     summary: Get the currently logged-in user's profile
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved user profile
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 63f0c4e2b2e4c123456789ab
 *                     name:
 *                       type: string
 *                       example: John Doe
 *                     email:
 *                       type: string
 *                       format: email
 *                       example: john@example.com
 *                     role:
 *                       type: string
 *                       enum: [user, admin, customer]
 *                       example: customer
 *                     isActive:
 *                       type: boolean
 *                       example: true
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2026-01-15T09:00:00.000Z
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2026-01-15T09:00:00.000Z
 *       401:
 *         description: Unauthorized – missing or invalid JWT
 */

export const getMe = async (req: any, res: Response) => {
  res.status(200).json({
    success: true,
    data: req.user,
  });
};

// POST /auth/logout
/**
 * @swagger
 * /api/v1/auth/logout:
 *   post:
 *     summary: Logout the currently logged-in user
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User logged out successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Logout successful
 *       401:
 *         description: Unauthorized – missing or invalid JWT
 */
export const logout = async (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Logout successful",
  });
};

/* ======================================================
   PROFILE (SELF ONLY)
   ====================================================== */

// PUT /auth/me
/**
 * @swagger
 * /api/v1/auth/profile:
 *   put:
 *     summary: Update the currently logged-in user's profile
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@example.com
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Profile updated successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 63f0c4e2b2e4c123456789ab
 *                     name:
 *                       type: string
 *                       example: John Doe
 *                     email:
 *                       type: string
 *                       format: email
 *                       example: john@example.com
 *                     role:
 *                       type: string
 *                       enum: [user, admin, customer]
 *                       example: customer
 *                     isActive:
 *                       type: boolean
 *                       example: true
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2026-01-15T09:00:00.000Z
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2026-01-15T10:00:00.000Z
 *       500:
 *         description: Server error
 */
export const updateMyProfile = async (req: any, res: Response) => {
  try {
    const updatedUser = await IUser.findByIdAndUpdate(
      req.user._id,
      {
        name: req.body.name,
        email: req.body.email,
      },
      { new: true }
    ).select("-password");

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: updatedUser,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

/* ======================================================
   PASSWORD MANAGEMENT
   ====================================================== */

// POST /auth/change-password
/**
 * @swagger
 * /api/v1/auth/change-password:
 *   post:
 *     summary: Change password for the currently logged-in user
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currentPassword
 *               - newPassword
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 format: password
 *                 example: oldPassword123
 *               newPassword:
 *                 type: string
 *                 format: password
 *                 minLength: 6
 *                 example: newPassword456
 *     responses:
 *       200:
 *         description: Password changed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Password changed successfully
 *       401:
 *         description: Unauthorized – current password is incorrect or JWT missing
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
export const changePassword = async (req: any, res: Response) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await IUser.findById(req.user._id).select("+password");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ error: "Current password incorrect" });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// POST /auth/forgot-password
/**
 * @swagger
 * /api/v1/auth/forgot-password:
 *   post:
 *     summary: Request a password reset link
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@example.com
 *     responses:
 *       200:
 *         description: Password reset link sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Password reset link sent
 *                 resetUrl:
 *                   type: string
 *                   example: http://localhost:3000/auth/reset-password/abcdef1234567890
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    const user = await IUser.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // 1. Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // 2. Hash token & save to DB
    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // 3. Expiry (10 minutes)
    user.resetPasswordExpire = new Date(Date.now() + 10 * 60 * 1000);

    await user.save({ validateBeforeSave: false });

    // 4. Reset URL (send via email in real app)
    const resetUrl = `http://localhost:3000/auth/reset-password/${resetToken}`;

    res.status(200).json({
      success: true,
      message: "Password reset link sent",
      resetUrl // TEMP: for testing only
    });

  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// POST /auth/reset-password
/**
 * @swagger
 * /api/v1/auth/reset-password/{resetToken}:
 *   post:
 *     summary: Reset a user's password using a valid reset token
 *     tags: [Authentication]
 *     parameters:
 *       - in: path
 *         name: resetToken
 *         required: true
 *         schema:
 *           type: string
 *         description: Password reset token sent to the user's email
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - password
 *             properties:
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 6
 *                 example: newPassword123
 *     responses:
 *       200:
 *         description: Password reset successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Password reset successfully
 *       400:
 *         description: Invalid or expired reset token / missing password
 *       500:
 *         description: Server error
 */
export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { password } = req.body;
    const { resetToken } = req.params; // ✅ works now

    if (!password) {
      return res.status(400).json({ error: "Password is required" });
    }

    // Hash token from URL
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // Find user with valid token
    const user = await IUser.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: new Date() }
    }).select("+password");

    if (!user) {
      return res.status(400).json({ error: "Invalid or expired reset token" });
    }

    // Set new password
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save(); // password hashed by pre-save hook

    res.status(200).json({
      success: true,
      message: "Password reset successfully"
    });

  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error"
    });
  }
};

/* ======================================================
   ADMIN ONLY – USER MANAGEMENT (RBAC CORE)
   ====================================================== */

// PUT /auth/users/:id
/**
 * @swagger
 * /api/v1/auth/users/{id}:
 *   put:
 *     summary: Admin updates a user's details
 *     tags: [User Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Jane Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: jane@example.com
 *               role:
 *                 type: string
 *                 enum: [user, admin, customer]
 *                 example: customer
 *               isActive:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: User updated successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *                     role:
 *                       type: string
 *                       enum: [user, admin, customer]
 *                     isActive:
 *                       type: boolean
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
export const adminUpdateUser = async (req: Request, res: Response) => {
  try {
    const user = await IUser.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: user,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE /auth/users/:id
/**
 * @swagger
 * /api/v1/auth/users/{id}:
 *   delete:
 *     summary: Admin deletes a user by ID
 *     tags: [User Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID to delete
 *     responses:
 *       200:
 *         description: User deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: User deleted successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
export const adminDeleteUser = async (req: Request, res: Response) => {
  try {
    const user = await IUser.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
