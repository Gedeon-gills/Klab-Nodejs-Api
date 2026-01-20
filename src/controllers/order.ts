import { Request, Response } from "express";
import Order from "../models/order.model.js";
import Cart from '../models/cart.model.js';


  //CREATE ORDER (USER)
/**
 * @swagger
 * /api/v1/orders:
 *   post:
 *     summary: Create a new order from user's cart
 *     tags: [Order]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Order created successfully
 *       400:
 *         description: Cart is empty
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
export const createOrder = async (req: Request, res: Response) => {
  try {
    //  Get user ID from JWT
    const userId = (req as any).user?._id;  
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });
    //  Find user's cart
    const cart = await Cart.findOne({ userId });
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    //  Calculate total amount
    const totalAmount = cart.items.reduce((sum, item) => {
      return sum + item.quantity * (item as any).price || 0; // price should be fetched from product if needed
    }, 0);

    //  Generate numeric order ID
    const lastOrder = await Order.findOne().sort({ id: -1 });
    const nextOrderId = lastOrder ? lastOrder.id + 1 : 1;

    //  Create order
    const order = await Order.create({
      id: nextOrderId,
      userId,
      items: cart.items, // copy all cart items
      totalAmount,
      paymentMethod: 'cart', // or ask user later
      status: 'pending',
      isPaid: false,
    });

    // Clear user's cart
    cart.items = [];
    await cart.save();

    return res.status(201).json({
      message: 'Order created successfully',
      order,
    });
  } catch (error: any) {
    return res.status(500).json({ message: 'Order creation failed', error: error.message });
  }
};

//GET ALL ORDERS (ADMIN) 
/**
 * @swagger
 * /api/v1/orders:
 *   get:
 *     summary: Get all orders (Admin only)
 *     tags: [Order]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Orders retrieved successfully
 *       403:
 *         description: Access denied
 *       401:
 *         description: Unauthorized
 */
export const getAllOrders = async (req: Request, res: Response) => {
  try {
    if (!(req as any).user?.isAdmin) {
      return res.status(403).json({ message: "Access denied" });
    }

    const orders = await Order.find().populate("userId", "name email");

    return res.status(200).json({
      message: "Orders retrieved successfully",
      orders,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Error retrieving orders",
      error: error.message,
    });
  }
};

// GET ORDER BY ID (OWNER OR ADMIN)
/**
 * @swagger
 * /api/v1/orders/{id}:
 *   get:
 *     summary: Get order by ID (Owner or Admin)
 *     tags: [Order]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *         description: Numeric order ID
 *     responses:
 *       200:
 *         description: Order retrieved successfully
 *       403:
 *         description: Access denied
 *       404:
 *         description: Order not found
 */
export const getOrderById = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;

    const order = await Order.findOne({ id: Number(req.params.id) });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (!user.isAdmin && order.userId.toString() !== user.id) {
      return res.status(403).json({ message: "Access denied" });
    }

    return res.status(200).json({
      message: "Order retrieved successfully",
      order,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Error retrieving order",
      error: error.message,
    });
  }
};

//UPDATE ORDER (ADMIN)
/**
 * @swagger
 * /api/v1/orders/{id}:
 *   put:
 *     summary: Update order status or payment (Admin only)
 *     tags: [Order]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *         description: Numeric order ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 example: shipped
 *               isPaid:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Order updated successfully
 *       400:
 *         description: Invalid update
 *       403:
 *         description: Access denied
 *       404:
 *         description: Order not found
 */
export const updateOrder = async (req: Request, res: Response) => {
  try {
    if (!(req as any).user?.isAdmin) {
      return res.status(403).json({ message: "Access denied" });
    }

    const { status, isPaid } = req.body;

    const order = await Order.findOne({ id: Number(req.params.id) });
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.status === "cancelled") {
      return res.status(400).json({
        message: "Cancelled orders cannot be updated",
      });
    }

    if (status) {
      order.status = status;
    }

    if (isPaid !== undefined) {
      order.isPaid = isPaid;
      if (isPaid) {
        order.paidAt = new Date();
        order.status = "paid";
      }
    }

    await order.save();

    return res.status(200).json({
      message: "Order updated successfully",
      order,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Error updating order",
      error: error.message,
    });
  }
};

// CANCEL ORDER (USER)
/**
 * @swagger
 * /api/v1/orders/{id}/cancel:
 *   patch:
 *     summary: Cancel an order (Owner only)
 *     tags: [Order]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *         description: Numeric order ID
 *     responses:
 *       200:
 *         description: Order cancelled successfully
 *       400:
 *         description: Order cannot be cancelled
 *       403:
 *         description: Access denied
 *       404:
 *         description: Order not found
 */
export const cancelOrder = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;

    const order = await Order.findOne({
      id: Number(req.params.id),
      userId: user.id,
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.isPaid || order.status !== "pending") {
      return res.status(400).json({
        message: "Order cannot be cancelled at this stage",
      });
    }

    order.status = "cancelled";
    await order.save();

    return res.status(200).json({
      message: "Order cancelled successfully",
      order,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Error cancelling order",
      error: error.message,
    });
  }
};

// DELETE ORDER (ADMIN) — SOFT DELETE
/**
 * @swagger
 * /api/v1/orders/{id}:
 *   delete:
 *     summary: Cancel an order (Admin only)
 *     tags: [Order]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *         description: Numeric order ID
 *     responses:
 *       200:
 *         description: Order cancelled by admin
 *       403:
 *         description: Access denied
 *       404:
 *         description: Order not found
 */
export const deleteOrder = async (req: Request, res: Response) => {
  try {
    if (!(req as any).user?.isAdmin) {
      return res.status(403).json({ message: "Access denied" });
    }

    const order = await Order.findOne({ id: Number(req.params.id) });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.status = "cancelled";
    await order.save();

    return res.status(200).json({
      message: "Order cancelled by admin",
      order,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Error deleting order",
      error: error.message,
    });
  }
};