import type { Request, Response } from 'express';
import  Category  from '../models/categorymodel.js';

//PUBLIC
//GET ALL CATEGORIES
/**
 * @swagger
 * tags:
 *   name: Category
 *   description: Product categories management
 */

/**
 * @swagger
 * /api/v1/categories:
 *   get:
 *     summary: Get all categories
 *     tags: [Category]
 *     responses:
 *       200:
 *         description: Categories retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 categories:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Category'
 *       500:
 *         description: Server error
 */
export const getAllCategories = async (_req: Request, res: Response) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    return res.status(200).json({
      message: "All categories retrieved successfully",
      categories,
    });
  } catch {
    return res.status(500).json({ message: "Internal server error" });
  }
};

//PUBLIC
// GET A SINGLE CATEGORY BY ID
/**
 * @swagger
 * /api/v1/categories/{id}:
 *   get:
 *     summary: Get category by ID
 *     tags: [Category]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB category ID
 *     responses:
 *       200:
 *         description: Category retrieved successfully
 *       404:
 *         description: Category not found
 *       400:
 *         description: Invalid ID
 */
export const getCategoryById = async (req: Request, res: Response) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    return res.status(200).json({
      message: "Category retrieved successfully",
      category,
    });
  } catch {
    return res.status(400).json({ message: "Invalid category ID" });
  }
};

//PROTECTED
//CREATE A NEW CATEGORY
/**
 * @swagger
 * /api/v1/categories:
 *   post:
 *     summary: Create a new category (Admin only)
 *     tags: [Category]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CategoryInput'
 *     responses:
 *       201:
 *         description: Category created successfully
 *       400:
 *         description: Validation error
 *       409:
 *         description: Category already exists
 */
export const createCategory = async (req: Request, res: Response) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Category name is required" });
    }

    const exists = await Category.findOne({ name });
    if (exists) {
      return res.status(409).json({ message: "Category already exists" });
    }

    const category = await Category.create({ name, description });

    return res.status(201).json({
      message: "Category created successfully",
      category,
    });
  } catch {
    return res.status(500).json({ message: "Category creation failed" });
  }
};

//PROTECTED
//UPDATE AN EXISTING CATEGORY
/**
 * @swagger
 * /api/v1/categories/{id}:
 *   put:
 *     summary: Update a category (Admin only)
 *     tags: [Category]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CategoryInput'
 *     responses:
 *       200:
 *         description: Category updated successfully
 *       404:
 *         description: Category not found
 */
export const updateCategory = async (req: Request, res: Response) => {
  try {
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    return res.status(200).json({
      message: "Category updated successfully",
      category,
    });
  } catch {
    return res.status(400).json({ message: "Category update failed" });
  }
};

//PROTECTED
//DELETE A CATEGORY
/**
 * @swagger
 * /api/v1/categories/{id}:
 *   delete:
 *     summary: Delete a category (Admin only)
 *     tags: [Category]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Category deleted successfully
 *       404:
 *         description: Category not found
 */
export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    return res.status(200).json({ message: "Category deleted successfully" });
  } catch {
    return res.status(400).json({ message: "Category deletion failed" });
  }
};