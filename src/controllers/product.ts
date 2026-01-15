import { Request, Response } from "express";
import Product from "../models/product.model.js";


//GET ALL PRODUCTS

export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.find();
    res.status(200).json({ products });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch products" });
  }
};

//GET A SINGLE PRODUCT BY ID

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

export const createProduct = async (req: Request, res: Response) => {
  try {
    const product = await Product.create(req.body);

    return res.status(201).json({
      message: "Product created successfully",
      product,
    });
  } catch (error: any) {
    return res.status(400).json({
      message: error.message || "Product creation failed",
    });
  }
};

//UPDATE AN EXISTING PRODUCT

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