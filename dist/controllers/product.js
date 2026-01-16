import Product from "../models/product.model.js";
//GET ALL PRODUCTS
/**
 * @swagger
 * /api/v1/products:
 *   get:
 *     summary: Get all products
 *     tags: [Product]
 *     responses:
 *       200:
 *         description: Products retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 products:
 *                   type: array
 *                   items:
 *                     type: object
 *       500:
 *         description: Failed to fetch products
 */
export const getProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json({ products });
    }
    catch (error) {
        res.status(500).json({ message: "Failed to fetch products" });
    }
};
//GET A SINGLE PRODUCT BY ID
/**
 * @swagger
 * /api/v1/products/{id}:
 *   get:
 *     summary: Get a single product by ID
 *     tags: [Product]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *         description: Product numeric ID
 *     responses:
 *       200:
 *         description: Product retrieved successfully
 *       404:
 *         description: Product not found
 *       500:
 *         description: Failed to fetch product
 */
export const getProductById = async (req, res) => {
    try {
        const product = await Product.findOne({ id: Number(req.params.id) });
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json({ product });
    }
    catch (error) {
        res.status(500).json({ message: "Failed to fetch product" });
    }
};
//PROTECTED
//CREATE A NEW PRODUCT
/**
 * @swagger
 * /api/v1/products:
 *   post:
 *     summary: Create a new product (Admin only)
 *     tags: [Product]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *             properties:
 *               id:
 *                 type: number
 *                 example: 101
 *               name:
 *                 type: string
 *                 example: iPhone 15
 *               description:
 *                 type: string
 *                 example: Latest Apple smartphone
 *               price:
 *                 type: number
 *                 example: 1200
 *               category:
 *                 type: string
 *                 example: Electronics
 *               stock:
 *                 type: number
 *                 example: 50
 *     responses:
 *       201:
 *         description: Product created successfully
 *       400:
 *         description: Product creation failed
 */
export const createProduct = async (req, res) => {
    try {
        const product = await Product.create(req.body);
        return res.status(201).json({
            message: "Product created successfully",
            product,
        });
    }
    catch (error) {
        return res.status(400).json({
            message: error.message || "Product creation failed",
        });
    }
};
//UPDATE AN EXISTING PRODUCT
/**
 * @swagger
 * /api/v1/products/{id}:
 *   put:
 *     summary: Update an existing product (Admin only)
 *     tags: [Product]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *         description: Product numeric ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Product updated successfully
 *       404:
 *         description: Product not found
 *       400:
 *         description: Product update failed
 */
export const updateProduct = async (req, res) => {
    try {
        const product = await Product.findOneAndUpdate({ id: Number(req.params.id) }, req.body, { new: true });
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        return res.status(200).json({
            message: "Product updated successfully",
            product,
        });
    }
    catch (error) {
        return res.status(400).json({
            message: error.message || "Product update failed",
        });
    }
};
//DELETE A PRODUCT
/**
 * @swagger
 * /api/v1/products/{id}:
 *   delete:
 *     summary: Delete a product (Admin only)
 *     tags: [Product]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *         description: Product numeric ID
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *       404:
 *         description: Product not found
 *       500:
 *         description: Error deleting product
 */
export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findOneAndDelete({
            id: Number(req.params.id),
        });
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        return res.status(200).json({
            message: "Product deleted successfully",
            product,
        });
    }
    catch (error) {
        return res.status(500).json({
            message: "Error deleting product",
            error,
        });
    }
};
