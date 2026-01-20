import multer from 'multer';
import path from 'path';
import fs from 'fs';

const uploadDir = './uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); 
  },

  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname); 
    const name = path.basename(file.originalname, ext); 
    cb(null, `${name}-${uniqueSuffix}${ext}`);
  }
});

const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  
  const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx/;
  
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true); 
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, GIF, PDF, DOC, DOCX are allowed.'));
  }
};


export const upload = multer({
  storage: storage,           
  limits: {
    fileSize: 10 * 1024 * 1024, 
  },
  fileFilter: fileFilter      
});