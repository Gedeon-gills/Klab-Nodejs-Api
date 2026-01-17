import Order from "../models/order.model.js";
//CREATE ORDER (USER)
/**
 * @swagger
 * /api/v1/orders:
 *   post:
 *     summary: Create a new order
 *     tags: [Order]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - items
 *               - totalAmount
 *               - paymentMethod
 *             properties:
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     productId:
 *                       type: number
 *                       example: 101
 *                     quantity:
 *                       type: number
 *                       example: 2
 *               totalAmount:
 *                 type: number
 *                 example: 250
 *               paymentMethod:
 *                 type: string
 *                 example: card
 *     responses:
 *       201:
 *         description: Order created successfully
 *       400:
 *         description: Missing required fields
 *       401:
 *         description: Unauthorized
 */
export const createOrder = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { items, totalAmount, paymentMethod } = req.body;
        if (!items || !totalAmount || !paymentMethod) {
            return res.status(400).json({ message: "Missing required fields" });
        }
        // Generate numeric order ID
        const lastOrder = await Order.findOne().sort({ id: -1 });
        const nextOrderId = lastOrder ? lastOrder.id + 1 : 1;
        const order = await Order.create({
            id: nextOrderId,
            userId,
            items,
            totalAmount,
            paymentMethod,
            status: "pending",
            isPaid: false,
        });
        return res.status(201).json({
            message: "Order created successfully",
            order,
        });
    }
    catch (error) {
        return res.status(500).json({
            message: "Order creation failed",
            error: error.message,
        });
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
export const getAllOrders = async (req, res) => {
    try {
        if (!req.user?.isAdmin) {
            return res.status(403).json({ message: "Access denied" });
        }
        const orders = await Order.find().populate("userId", "name email");
        return res.status(200).json({
            message: "Orders retrieved successfully",
            orders,
        });
    }
    catch (error) {
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
export const getOrderById = async (req, res) => {
    try {
        const user = req.user;
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
    }
    catch (error) {
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
export const updateOrder = async (req, res) => {
    try {
        if (!req.user?.isAdmin) {
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
    }
    catch (error) {
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
export const cancelOrder = async (req, res) => {
    try {
        const user = req.user;
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
    }
    catch (error) {
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
export const deleteOrder = async (req, res) => {
    try {
        if (!req.user?.isAdmin) {
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
    }
    catch (error) {
        return res.status(500).json({
            message: "Error deleting order",
            error: error.message,
        });
    }
};
