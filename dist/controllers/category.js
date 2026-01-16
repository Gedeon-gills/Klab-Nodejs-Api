import Category from '../models/categorymodel.js';
//PUBLIC
//GET ALL CATEGORIES
/**
 * @swagger
 * /api/v1/categories:
 *   get:
 *     summary: Get all categories
 *     tags: [Category]
 *     responses:
 *       200:
 *         description: All categories retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: All categories retrieved successfully
 *                 categories:
 *                   type: array
 *                   items:
 *                     type: object
 *       500:
 *         description: Server error
 */
export const getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        return res.status(200).json({
            message: "All categories retrieved successfully",
            categories,
        });
    }
    catch (error) {
        return res.status(500).json({
            message: "Error retrieving categories",
            error,
        });
    }
};
//PUBLIC
// GET A SINGLE CATEGORY BY ID
/**
 * @swagger
 * /api/v1/categories/{id}:
 *   get:
 *     summary: Get a single category by ID
 *     tags: [Category]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *         description: Category numeric ID
 *     responses:
 *       200:
 *         description: Category retrieved successfully
 *       404:
 *         description: Category not found
 *       500:
 *         description: Server error
 */
export const getCategoryById = async (req, res) => {
    try {
        const category = await Category.findOne({ id: Number(req.params.id) });
        if (!category) {
            return res.status(404).json({
                message: "Category not found"
            });
        }
        return res.status(200).json({
            message: "Category retrieved successfully",
            category,
        });
    }
    catch (error) {
        return res.status(500).json({
            message: "Error retrieving category",
            error,
        });
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
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               id:
 *                 type: number
 *                 example: 1
 *               name:
 *                 type: string
 *                 example: Electronics
 *               description:
 *                 type: string
 *                 example: Devices and electronic items
 *     responses:
 *       201:
 *         description: Category created successfully
 *       400:
 *         description: Validation or creation error
 */
export const createCategory = async (req, res) => {
    try {
        const category = await Category.create(req.body);
        return res.status(201).json({
            message: "Category created successfully",
            category,
        });
    }
    catch (error) {
        return res.status(400).json({
            message: error.message || "Category creation failed",
        });
    }
};
//PROTECTED
//UPDATE AN EXISTING CATEGORY
/**
 * @swagger
 * /api/v1/categories/{id}:
 *   put:
 *     summary: Update an existing category (Admin only)
 *     tags: [Category]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *         description: Category numeric ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Home Appliances
 *               description:
 *                 type: string
 *                 example: Appliances for home use
 *     responses:
 *       200:
 *         description: Category updated successfully
 *       404:
 *         description: Category not found
 *       400:
 *         description: Update failed
 */
export const updateCategory = async (req, res) => {
    try {
        const category = await Category.findOneAndUpdate({ id: Number(req.params.id) }, req.body, { new: true });
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }
        return res.status(200).json({
            message: "Category updated successfully",
            category,
        });
    }
    catch (error) {
        return res.status(400).json({
            message: error.message || "Category update failed",
        });
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
 *           type: number
 *         description: Category numeric ID
 *     responses:
 *       200:
 *         description: Category deleted successfully
 *       404:
 *         description: Category not found
 *       500:
 *         description: Server error
 */
export const deleteCategory = async (req, res) => {
    try {
        const category = await Category.findOneAndDelete({ id: Number(req.params.id) });
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }
        return res.status(200).json({
            message: "Category deleted successfully",
            category,
        });
    }
    catch (error) {
        return res.status(500).json({
            message: "Error deleting category",
            error,
        });
    }
};
