import { handleUploadError, uploadMultiple, uploadSingle } from '@/config/upload';
import {
  deleteImage,
  getImageInfo,
  uploadAvatar,
  uploadItemImages,
  uploadMultiple as uploadMultipleController,
  uploadSingle as uploadSingleController,
  uploadWithSizes,
} from '@/controllers/uploadController';
import { authenticate } from '@/middleware/auth';
import { Router } from 'express';

const router = Router();

// All upload routes require authentication
router.use(authenticate);

// Single image upload
router.post('/single', uploadSingle('image'), handleUploadError, uploadSingleController);

// Multiple images upload
router.post('/multiple', uploadMultiple('images', 5), handleUploadError, uploadMultipleController);

// Upload with multiple sizes
router.post('/sizes', uploadSingle('image'), handleUploadError, uploadWithSizes);

// Item images upload
router.post('/item/:itemId', uploadMultiple('images', 5), handleUploadError, uploadItemImages);

// Avatar upload
router.post('/avatar', uploadSingle('avatar'), handleUploadError, uploadAvatar);

// Image management
router.delete('/:filename', deleteImage);
router.get('/info/:filename', getImageInfo);

export default router;
