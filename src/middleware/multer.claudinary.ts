import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/claudinary.js';

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async ()=>({
    folder: 'products',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif'],
  }),
});

export const uploadToCloudinary = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
});