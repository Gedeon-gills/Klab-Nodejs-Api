import { Request, Response } from "express";
import Product from "../models/product.model.js";
import claudinary from "../config/claudinary.js";



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
export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.find();
    res.status(200).json({ products });
  } catch (error) {
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
export const getProductById = async (req: Request, res: Response) => {
  try {
    const product = await Product.findOne({ id: Number(req.params.id) });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ product });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch product" });
  }
};

//PROTECTED
//CREATE A NEW PRODUCT
/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Create a new product with images
 *     tags:
 *       - Products
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *               - category
 *               - quantity
 *             properties:
 *               name:
 *                 type: string
 *                 example: iPhone 15
 *               price:
 *                 type: number
 *                 example: 1200
 *               description:
 *                 type: string
 *                 example: Latest Apple smartphone
 *               category:
 *                 type: string
 *                 example: Electronics
 *               quantity:
 *                 type: number
 *                 example: 10
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Product created successfully
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
 *                   example: Product created successfully with images
 *                 product:
 *                   type: object
 *       400:
 *         description: Product creation failed
 */

export const createProductWithImages = async (req: Request, res: Response) => {
  try {
    const { name, price, description, category, quantity } = req.body;


    console.log(req.files);
    

  const Images: any[] = [];

if (req.files) {
  for (const file of req.files as any[]) {
    const imageUrl = await claudinary.uploader.upload(file.path);
    Images.push(imageUrl.secure_url); // or imageUrl
    console.log(imageUrl);
  }
}


    const product = await Product.create({
      name,
      price,
      description,
      category,
      quantity,
      images: Images,
      inStock: quantity > 0,
    });

    return res.status(201).json({
      success: true,
      message: "Product created successfully with images",
      product,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
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
export const updateProduct = async (req: Request, res: Response) => {
  try {
    const product = await Product.findOneAndUpdate(
      { id: Number(req.params.id) },
      req.body,
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.status(200).json({
      message: "Product updated successfully",
      product,
    });
  } catch (error: any) {
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
export const deleteProduct = async (req: Request, res: Response) => {
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
  } catch (error) {
    return res.status(500).json({
      message: "Error deleting product",
      error,
    });
  }
};