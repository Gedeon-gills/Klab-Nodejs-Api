import type { Request, Response } from "express";
import   Cart  from "../models/cart.model.js";
import Product from "../models/product.model.js";
import mongoose from "mongoose";
import { AnyAaaaRecord } from "dns";

// Helper to get user ID from request (replace with your auth middleware)
const getUserId = (req: any) => {
  // Assuming your auth middleware sets req.user
  return req.user?._id as string | undefined;
};

//GET ALL CARTS(admin)
/**
 * @swagger
 * /api/v1/carts:
 *   get:
 *     summary: Get all carts (Admin only)
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All carts retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: All carts retrieved successfully
 *                 carts:
 *                   type: array
 *                   items:
 *                     type: object
 *       403:
 *         description: Access denied (not an admin)
 *       500:
 *         description: Server error
 */
export const getAllCarts = async (req: any, res: Response) => {
    try {
        // Optional: only allow admins
        if (!req.user?.isAdmin) {
            return res.status(403).json({ message: "Access denied" });
        }

        const carts = await Cart.find();
        return res.status(200).json({
            message: "All carts retrieved successfully",
            carts,
        });
    } catch (error) {
        return res.status(500).json({ message: "Error retrieving carts", error });
    }
};

//GET CART BY ID 
/**
 * @swagger
 * /api/v1/carts/{id}:
 *   get:
 *     summary: Get a cart by ID (Owner only)
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Cart ID
 *     responses:
 *       200:
 *         description: Cart retrieved successfully
 *       403:
 *         description: Access denied
 *       404:
 *         description: Cart not found
 *       500:
 *         description: Server error
 */
export const getCartById = async (req: Request, res: Response) => {
    try {
        const userId = getUserId(req);
        const cart = await Cart.findById(req.params.id);

        if (!cart) return res.status(404).json({ message: "Cart not found" });
        if (cart.userId.toString() !== userId)
            return res.status(403).json({ message: "Access denied" });

        return res.status(200).json({
            message: "Cart retrieved successfully",
            cart,
        });
    } catch (error) {
        return res.status(500).json({ message: "Error retrieving cart", error });
    }
};

//CREATE A NEW CART
/**
 * @swagger
 * /api/v1/carts:
 *   post:
 *     summary: Get the logged-in user's cart or create a new one
 *     description: 
 *       If the user already has a cart, it returns the existing cart. 
 *       If not, it creates a new cart. Optionally, a product can be added to the new cart.
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *                 format: ObjectId
 *                 description: Optional product ID to add to the cart
 *                 example: 64fa1b2c3d4e5f6789012345
 *               quantity:
 *                 type: integer
 *                 description: Quantity of the product (defaults to 1 if not provided)
 *                 example: 2
 *     responses:
 *       200:
 *         description: Cart retrieved successfully (existing cart)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Cart retrieved successfully
 *                 cart:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 65fa1e9c8c1d2f4b8a123456
 *                     userId:
 *                       type: string
 *                       example: 64f9a123456789abcdef1234
 *                     items:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           productId:
 *                             type: string
 *                             example: 64fa1b2c3d4e5f6789012345
 *                           quantity:
 *                             type: integer
 *                             example: 1
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2026-01-19T11:30:00.123Z
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2026-01-19T11:30:00.123Z
 *       201:
 *         description: Cart created successfully (new cart)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Cart created successfully
 *                 cart:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 65fa1e9c8c1d2f4b8a123456
 *                     userId:
 *                       type: string
 *                       example: 64f9a123456789abcdef1234
 *                     items:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           productId:
 *                             type: string
 *                             example: 64fa1b2c3d4e5f6789012345
 *                           quantity:
 *                             type: integer
 *                             example: 2
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2026-01-19T11:35:00.123Z
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2026-01-19T11:35:00.123Z
 *       401:
 *         description: Unauthorized - user not logged in or token invalid
 *       404:
 *         description: Product not found (if productId is invalid)
 *       500:
 *         description: Server error
 */
export const createCart = async (req: Request, res: Response) => {
  try {
    const userIdString = getUserId(req);

    if (!userIdString) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Convert string to ObjectId
    const userId = new mongoose.Types.ObjectId(userIdString);

    // Check if user already has a cart
    let cart = await Cart.findOne({ userId });

    if (cart) {
      return res.status(200).json({
        message: "Cart retrieved successfully",
        cart,
      });
    }

    // Optionally add a product to the new cart
    const { productId, quantity } = req.body;

    const items: { productId: mongoose.Types.ObjectId; quantity: number }[] = [];

    if (productId) {
      // Validate product exists
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      items.push({
        productId: product._id,
        quantity: quantity && quantity > 0 ? quantity : 1,
      });
    }

    // Create a new cart
    cart = await Cart.create({
      userId,
      items,
    });

    return res.status(201).json({
      message: "Cart created successfully",
      cart,
    });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({
      message: "Error creating/retrieving cart",
      error: error.message || error,
    });
  }
};

//UPDATE AN EXISTING CART
/**
 * @swagger
 * /api/v1/carts/{id}:
 *   put:
 *     summary: Update a cart (Owner only)
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Cart ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Cart updated successfully
 *       403:
 *         description: Access denied
 *       404:
 *         description: Cart not found
 *       500:
 *         description: Server error
 */
export const updateCart = async (req: Request, res: Response) => {
    try {
        const userId = getUserId(req);

        const cart = await Cart.findById(req.params.id);
        if (!cart) return res.status(404).json({ message: "Cart not found" });
        if (cart.userId.toString() !== userId)
            return res.status(403).json({ message: "Access denied" });

        Object.assign(cart, req.body);
        await cart.save();

        return res.status(200).json({
            message: "Cart updated successfully",
            cart,
        });
    } catch (error) {
        return res.status(500).json({ message: "Error updating cart", error });
    }
};

//DELETE A CART
/**
 * @swagger
 * /api/v1/carts/{id}:
 *   delete:
 *     summary: Delete a cart (Owner only)
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Cart ID
 *     responses:
 *       200:
 *         description: Cart deleted successfully
 *       403:
 *         description: Access denied
 *       404:
 *         description: Cart not found
 *       500:
 *         description: Server error
 */
export const deleteCart = async (req: Request, res: Response) => {
    try {
        const userId = getUserId(req);

        const cart = await Cart.findById(req.params.id);
        if (!cart) return res.status(404).json({ message: "Cart not found" });
        if (cart.userId.toString() !== userId)
            return res.status(403).json({ message: "Access denied" });

        await cart.deleteOne();

        return res.status(200).json({
            message: "Cart deleted successfully",
        });
    } catch (error) {
        return res.status(500).json({ message: "Error deleting cart", error });
    }
};