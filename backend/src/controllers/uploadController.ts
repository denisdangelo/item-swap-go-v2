import { asyncHandler, ValidationError } from '@/middleware/errorHandler';
import { ImageService } from '@/services/ImageService';
import { ItemService } from '@/services/ItemService';
import { UserService } from '@/services/UserService';
import { sendCreated, sendSuccess } from '@/utils/response';
import { Request, Response } from 'express';

export class UploadController {
  private imageService: ImageService;
  private itemService: ItemService;
  private userService: UserService;

  constructor() {
    this.imageService = new ImageService();
    this.itemService = new ItemService();
    this.userService = new UserService();
  }

  // Upload single image
  uploadSingle = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    if (!req.file) {
      throw new ValidationError('No file uploaded');
    }

    // Validate image
    this.imageService.validateImage(req.file);

    // Process image
    const processedImage = await this.imageService.processImage(req.file);

    sendCreated(res, processedImage, 'Image uploaded successfully');
  });

  // Upload multiple images
  uploadMultiple = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
      throw new ValidationError('No files uploaded');
    }

    // Validate all images
    files.forEach((file) => this.imageService.validateImage(file));

    // Process all images
    const processedImages = await this.imageService.processImages(files);

    sendCreated(res, processedImages, 'Images uploaded successfully');
  });

  // Upload item images
  uploadItemImages = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { itemId } = req.params;
    const userId = req.user?.userId;
    const files = req.files as Express.Multer.File[];

    if (!userId) {
      throw new Error('User ID not found in request');
    }

    if (!files || files.length === 0) {
      throw new ValidationError('No files uploaded');
    }

    // Validate all images
    files.forEach((file) => this.imageService.validateImage(file));

    // Process images
    const processedImages = await this.imageService.processImages(files);

    // Add images to item
    const itemImages = [];
    for (let i = 0; i < processedImages.length; i++) {
      const processed = processedImages[i];
      const isPrimary = i === 0; // First image is primary

      const itemImage = await this.itemService.addItemImage(
        itemId,
        processed.url,
        `Image ${i + 1}`,
        isPrimary,
        userId
      );

      itemImages.push({
        ...itemImage,
        processed_info: processed,
      });
    }

    sendCreated(res, itemImages, 'Item images uploaded successfully');
  });

  // Upload user avatar
  uploadAvatar = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?.userId;

    if (!userId) {
      throw new Error('User ID not found in request');
    }

    if (!req.file) {
      throw new ValidationError('No file uploaded');
    }

    // Validate image
    this.imageService.validateImage(req.file);

    // Process avatar (square thumbnail)
    const processedAvatar = await this.imageService.createThumbnail(req.file, 200);

    // Update user avatar
    const updatedProfile = await this.userService.updateAvatar(userId, processedAvatar.url);

    sendSuccess(
      res,
      {
        avatar: processedAvatar,
        profile: updatedProfile,
      },
      'Avatar uploaded successfully'
    );
  });

  // Upload with multiple sizes
  uploadWithSizes = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    if (!req.file) {
      throw new ValidationError('No file uploaded');
    }

    // Validate image
    this.imageService.validateImage(req.file);

    // Create multiple sizes
    const multipleSizes = await this.imageService.createMultipleSizes(req.file);

    sendCreated(res, multipleSizes, 'Image uploaded with multiple sizes');
  });

  // Delete image
  deleteImage = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { filename } = req.params;

    if (!filename) {
      throw new ValidationError('Filename is required');
    }

    // Delete image file
    const success = await this.imageService.deleteImage(filename);

    if (!success) {
      throw new Error('Failed to delete image');
    }

    sendSuccess(res, null, 'Image deleted successfully');
  });

  // Get image info
  getImageInfo = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { filename } = req.params;

    if (!filename) {
      throw new ValidationError('Filename is required');
    }

    const imageInfo = await this.imageService.getImageInfo(filename);

    if (!imageInfo.exists) {
      throw new ValidationError('Image not found');
    }

    sendSuccess(res, imageInfo, 'Image info retrieved successfully');
  });
}

// Create controller instance
const uploadController = new UploadController();

// Export controller methods
export const uploadSingle = uploadController.uploadSingle;
export const uploadMultiple = uploadController.uploadMultiple;
export const uploadItemImages = uploadController.uploadItemImages;
export const uploadAvatar = uploadController.uploadAvatar;
export const uploadWithSizes = uploadController.uploadWithSizes;
export const deleteImage = uploadController.deleteImage;
export const getImageInfo = uploadController.getImageInfo;
