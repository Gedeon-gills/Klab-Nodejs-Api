import express from 'express';
import { getAllCarts, getCartById, createCart, updateCart, deleteCart } from '../controllers/cart.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticate, getAllCarts);          
router.get('/:id', authenticate, getCartById);      
router.post('/', authenticate, createCart);         
router.put('/:id', authenticate, updateCart);       
router.delete('/:id', authenticate, deleteCart);  

export default router;