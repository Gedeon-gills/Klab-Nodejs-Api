import express from 'express';
import { getProducts, getProductById, createProductWithImages, updateProduct, deleteProduct } from '../controllers/product.js';
import { upload } from '../config/multer.js'; 
import { uploadToCloudinary } from "../middleware/multer.claudinary.js";
import {authenticate} from '../middleware/auth.js';

const router = express.Router();

router.get('/', getProducts);
router.get('/:id', getProductById);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);
router.post( "/",authenticate,upload.array("images", 5),createProductWithImages);

export default router;