import type { Request, Response } from "express";
import   Cart  from "../models/cart.model.js";

// Helper: get userId from request 
const getUserId = (req: any) => {
    // req.user should be set by your auth middleware after verifying JWT
    return req.user?.id;
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
 *     summary: Create a new cart for the logged-in user
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     productId:
 *                       type: string
 *                     quantity:
 *                       type: number
 *     responses:
 *       201:
 *         description: Cart created successfully
 *       400:
 *         description: Cart already exists for user
 *       500:
 *         description: Server error
 */
export const createCart = async (req: Request, res: Response) => {
    try {
        const userId = getUserId(req);

        // Check if user already has a cart
        let cart = await Cart.findOne({ userId });
        if (cart) {
            return res.status(400).json({ message: "Cart already exists for user" });
        }

        cart = await Cart.create({ ...req.body, userId });
        return res.status(201).json({
            message: "Cart created successfully",
            cart,
        });
    } catch (error: any) {
        return res.status(400).json({
            message: error.message || "Cart creation failed",
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