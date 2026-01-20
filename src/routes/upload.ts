import { Router } from 'express';
import { upload } from '../config/multer.js'; 
import { uploadSingleFile } from '../controllers/upload.js';
import {authenticate} from '../middleware/auth.js';

const router = Router();


router.post('/single', authenticate, upload.single('image'), uploadSingleFile);

export default router;