import type { Request, Response } from 'express';
import  Category  from '../models/categorymodel.js';

//PUBLIC
//GET ALL CATEGORIES
export const getAllCategories = async (req: Request, res: Response) => {
    try {
        const categories = await Category.find();
        return res.status(200).json({
        message: "All categories retrieved successfully",
        categories,
        });
  } catch (error) {
    return res.status(500).json({
      message: "Error retrieving categories",
      error,
    });
  }
};

//PUBLIC
// GET A SINGLE CATEGORY BY ID
export const getCategoryById = async (req: Request, res: Response) => {
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
    } catch (error) {
        return res.status(500).json({
            message: "Error retrieving category",
            error,
        });
    }
};

//PROTECTED
//CREATE A NEW CATEGORY

export const createCategory = async (req: Request, res: Response) => {
  try {
    const category = await Category.create(req.body);
    return res.status(201).json({
      message: "Category created successfully",
      category,
    });
  } catch (error: any) {
    return res.status(400).json({
      message: error.message || "Category creation failed",
    });
  }
};

//PROTECTED
//UPDATE AN EXISTING CATEGORY

export const updateCategory = async (req: Request, res: Response) => {
  try {
    const category = await Category.findOneAndUpdate(
      { id: Number(req.params.id) },
      req.body,
      { new: true }
    );

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    return res.status(200).json({
      message: "Category updated successfully",
      category,
    });
  } catch (error: any) {
    return res.status(400).json({
      message: error.message || "Category update failed",
    });
  }
};

//PROTECTED
//DELETE A CATEGORY

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const category = await Category.findOneAndDelete({ id: Number(req.params.id) });

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    return res.status(200).json({
      message: "Category deleted successfully",
      category,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error deleting category",
      error,
    });
  }
};