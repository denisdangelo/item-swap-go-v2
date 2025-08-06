import { ValidationError } from '@/middleware/errorHandler';
import multer from 'multer';
import path from 'path';
import { env } from './env';

// Allowed file types
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

// File size limit (5MB)
const MAX_FILE_SIZE = env.MAX_FILE_SIZE;

// Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, env.UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const extension = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${extension}`);
  },
});

// File filter
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // Check file type
  if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    return cb(
      new ValidationError('Invalid file type. Only JPEG, PNG, and WebP images are allowed.')
    );
  }

  cb(null, true);
};

// Multer configuration
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE,
    files: 5, // Maximum 5 files per request
  },
});

// Single file upload middleware
export const uploadSingle = (fieldName: string) => upload.single(fieldName);

// Multiple files upload middleware
export const uploadMultiple = (fieldName: string, maxCount: number = 5) =>
  upload.array(fieldName, maxCount);

// Upload error handler
export const handleUploadError = (error: any, req: any, res: any, next: any) => {
  if (error instanceof multer.MulterError) {
    switch (error.code) {
      case 'LIMIT_FILE_SIZE':
        return res.status(400).json({
          success: false,
          error: {
            code: 'FILE_TOO_LARGE',
            message: `File size exceeds limit of ${MAX_FILE_SIZE / 1024 / 1024}MB`,
          },
        });
      case 'LIMIT_FILE_COUNT':
        return res.status(400).json({
          success: false,
          error: {
            code: 'TOO_MANY_FILES',
            message: 'Too many files uploaded',
          },
        });
      case 'LIMIT_UNEXPECTED_FILE':
        return res.status(400).json({
          success: false,
          error: {
            code: 'UNEXPECTED_FILE',
            message: 'Unexpected file field',
          },
        });
      default:
        return res.status(400).json({
          success: false,
          error: {
            code: 'UPLOAD_ERROR',
            message: error.message,
          },
        });
    }
  }

  next(error);
};
