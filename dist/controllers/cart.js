import Cart from "../models/cart.model.js";
// Helper: get userId from request 
const getUserId = (req) => {
    // req.user should be set by your auth middleware after verifying JWT
    return req.user?.id;
};
//GET ALL CARTS(admin)
export const getAllCarts = async (req, res) => {
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
    }
    catch (error) {
        return res.status(500).json({ message: "Error retrieving carts", error });
    }
};
//GET CART BY ID 
export const getCartById = async (req, res) => {
    try {
        const userId = getUserId(req);
        const cart = await Cart.findById(req.params.id);
        if (!cart)
            return res.status(404).json({ message: "Cart not found" });
        if (cart.userId.toString() !== userId)
            return res.status(403).json({ message: "Access denied" });
        return res.status(200).json({
            message: "Cart retrieved successfully",
            cart,
        });
    }
    catch (error) {
        return res.status(500).json({ message: "Error retrieving cart", error });
    }
};
//CREATE A NEW CART
export const createCart = async (req, res) => {
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
    }
    catch (error) {
        return res.status(400).json({
            message: error.message || "Cart creation failed",
        });
    }
};
//UPDATE AN EXISTING CART
export const updateCart = async (req, res) => {
    try {
        const userId = getUserId(req);
        const cart = await Cart.findById(req.params.id);
        if (!cart)
            return res.status(404).json({ message: "Cart not found" });
        if (cart.userId.toString() !== userId)
            return res.status(403).json({ message: "Access denied" });
        Object.assign(cart, req.body);
        await cart.save();
        return res.status(200).json({
            message: "Cart updated successfully",
            cart,
        });
    }
    catch (error) {
        return res.status(500).json({ message: "Error updating cart", error });
    }
};
//DELETE A CART
export const deleteCart = async (req, res) => {
    try {
        const userId = getUserId(req);
        const cart = await Cart.findById(req.params.id);
        if (!cart)
            return res.status(404).json({ message: "Cart not found" });
        if (cart.userId.toString() !== userId)
            return res.status(403).json({ message: "Access denied" });
        await cart.deleteOne();
        return res.status(200).json({
            message: "Cart deleted successfully",
        });
    }
    catch (error) {
        return res.status(500).json({ message: "Error deleting cart", error });
    }
};
