import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';

export const uploadSingleFile = (req: AuthRequest, res: Response) => {
  try {
    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded' // User forgot to select a file
      });
    }

    const fileInfo = {
      filename: req.file.filename,        // New filename: "photo-1640995200000-123456789.jpg"
      originalName: req.file.originalname, // Original name: "my-photo.jpg"
      mimetype: req.file.mimetype,        // File type: "image/jpeg"
      size: req.file.size,                // File size in bytes: 1048576
      path: req.file.path,                // Full path: "uploads/photo-1640995200000-123456789.jpg"
      url: `/uploads/${req.file.filename}` // Public URL to access file
    };

    return res.status(200).json({
      success: true,
      message: 'File uploaded successfully',
      file: fileInfo
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'File upload failed',
      error: error.message
    });
  }
};