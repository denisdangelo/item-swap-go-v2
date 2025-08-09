"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getImageInfo = exports.deleteImage = exports.uploadWithSizes = exports.uploadAvatar = exports.uploadItemImages = exports.uploadMultiple = exports.uploadSingle = exports.UploadController = void 0;
const errorHandler_1 = require("@/middleware/errorHandler");
const ImageService_1 = require("@/services/ImageService");
const ItemService_1 = require("@/services/ItemService");
const UserService_1 = require("@/services/UserService");
const response_1 = require("@/utils/response");
class UploadController {
    constructor() {
        // Upload single image
        this.uploadSingle = (0, errorHandler_1.asyncHandler)(async (req, res) => {
            if (!req.file) {
                throw new errorHandler_1.ValidationError('No file uploaded');
            }
            // Validate image
            this.imageService.validateImage(req.file);
            // Process image
            const processedImage = await this.imageService.processImage(req.file);
            (0, response_1.sendCreated)(res, processedImage, 'Image uploaded successfully');
        });
        // Upload multiple images
        this.uploadMultiple = (0, errorHandler_1.asyncHandler)(async (req, res) => {
            const files = req.files;
            if (!files || files.length === 0) {
                throw new errorHandler_1.ValidationError('No files uploaded');
            }
            // Validate all images
            files.forEach((file) => this.imageService.validateImage(file));
            // Process all images
            const processedImages = await this.imageService.processImages(files);
            (0, response_1.sendCreated)(res, processedImages, 'Images uploaded successfully');
        });
        // Upload item images
        this.uploadItemImages = (0, errorHandler_1.asyncHandler)(async (req, res) => {
            const { itemId } = req.params;
            const userId = req.user?.userId;
            const files = req.files;
            if (!userId) {
                throw new Error('User ID not found in request');
            }
            if (!files || files.length === 0) {
                throw new errorHandler_1.ValidationError('No files uploaded');
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
                const itemImage = await this.itemService.addItemImage(itemId, processed.url, `Image ${i + 1}`, isPrimary, userId);
                itemImages.push({
                    ...itemImage,
                    processed_info: processed,
                });
            }
            (0, response_1.sendCreated)(res, itemImages, 'Item images uploaded successfully');
        });
        // Upload user avatar
        this.uploadAvatar = (0, errorHandler_1.asyncHandler)(async (req, res) => {
            const userId = req.user?.userId;
            if (!userId) {
                throw new Error('User ID not found in request');
            }
            if (!req.file) {
                throw new errorHandler_1.ValidationError('No file uploaded');
            }
            // Validate image
            this.imageService.validateImage(req.file);
            // Process avatar (square thumbnail)
            const processedAvatar = await this.imageService.createThumbnail(req.file, 200);
            // Update user avatar
            const updatedProfile = await this.userService.updateAvatar(userId, processedAvatar.url);
            (0, response_1.sendSuccess)(res, {
                avatar: processedAvatar,
                profile: updatedProfile,
            }, 'Avatar uploaded successfully');
        });
        // Upload with multiple sizes
        this.uploadWithSizes = (0, errorHandler_1.asyncHandler)(async (req, res) => {
            if (!req.file) {
                throw new errorHandler_1.ValidationError('No file uploaded');
            }
            // Validate image
            this.imageService.validateImage(req.file);
            // Create multiple sizes
            const multipleSizes = await this.imageService.createMultipleSizes(req.file);
            (0, response_1.sendCreated)(res, multipleSizes, 'Image uploaded with multiple sizes');
        });
        // Delete image
        this.deleteImage = (0, errorHandler_1.asyncHandler)(async (req, res) => {
            const { filename } = req.params;
            if (!filename) {
                throw new errorHandler_1.ValidationError('Filename is required');
            }
            // Delete image file
            const success = await this.imageService.deleteImage(filename);
            if (!success) {
                throw new Error('Failed to delete image');
            }
            (0, response_1.sendSuccess)(res, null, 'Image deleted successfully');
        });
        // Get image info
        this.getImageInfo = (0, errorHandler_1.asyncHandler)(async (req, res) => {
            const { filename } = req.params;
            if (!filename) {
                throw new errorHandler_1.ValidationError('Filename is required');
            }
            const imageInfo = await this.imageService.getImageInfo(filename);
            if (!imageInfo.exists) {
                throw new errorHandler_1.ValidationError('Image not found');
            }
            (0, response_1.sendSuccess)(res, imageInfo, 'Image info retrieved successfully');
        });
        this.imageService = new ImageService_1.ImageService();
        this.itemService = new ItemService_1.ItemService();
        this.userService = new UserService_1.UserService();
    }
}
exports.UploadController = UploadController;
// Create controller instance
const uploadController = new UploadController();
// Export controller methods
exports.uploadSingle = uploadController.uploadSingle;
exports.uploadMultiple = uploadController.uploadMultiple;
exports.uploadItemImages = uploadController.uploadItemImages;
exports.uploadAvatar = uploadController.uploadAvatar;
exports.uploadWithSizes = uploadController.uploadWithSizes;
exports.deleteImage = uploadController.deleteImage;
exports.getImageInfo = uploadController.getImageInfo;
