"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImageService = void 0;
const env_1 = require("@/config/env");
const errorHandler_1 = require("@/middleware/errorHandler");
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const sharp_1 = __importDefault(require("sharp"));
const uuid_1 = require("uuid");
class ImageService {
    constructor() {
        this.uploadDir = env_1.env.UPLOAD_DIR;
        this.baseUrl = `http://localhost:${env_1.env.PORT}`;
        this.ensureUploadDir();
    }
    // Ensure upload directory exists
    async ensureUploadDir() {
        try {
            await promises_1.default.access(this.uploadDir);
        }
        catch {
            await promises_1.default.mkdir(this.uploadDir, { recursive: true });
        }
    }
    // Process single image
    async processImage(file, options = {}) {
        const { width = 800, height = 600, quality = 85, format = 'jpeg' } = options;
        // Generate unique filename
        const uniqueId = (0, uuid_1.v4)();
        const filename = `${uniqueId}.${format}`;
        const outputPath = path_1.default.join(this.uploadDir, filename);
        try {
            // Process image with Sharp
            const processedBuffer = await (0, sharp_1.default)(file.buffer)
                .resize(width, height, {
                fit: 'inside',
                withoutEnlargement: true,
            })
                .toFormat(format, { quality })
                .toBuffer();
            // Save processed image
            await promises_1.default.writeFile(outputPath, processedBuffer);
            // Get image metadata
            const metadata = await (0, sharp_1.default)(processedBuffer).metadata();
            return {
                filename,
                path: outputPath,
                url: `${this.baseUrl}/uploads/${filename}`,
                size: processedBuffer.length,
                width: metadata.width || 0,
                height: metadata.height || 0,
                format: metadata.format || format,
            };
        }
        catch (error) {
            throw new errorHandler_1.ValidationError(`Failed to process image: ${error}`);
        }
    }
    // Process multiple images
    async processImages(files, options = {}) {
        const processedImages = [];
        for (const file of files) {
            const processed = await this.processImage(file, options);
            processedImages.push(processed);
        }
        return processedImages;
    }
    // Create thumbnail
    async createThumbnail(file, size = 150) {
        return this.processImage(file, {
            width: size,
            height: size,
            quality: 80,
            format: 'jpeg',
        });
    }
    // Create multiple sizes
    async createMultipleSizes(file) {
        const [original, large, medium, thumbnail] = await Promise.all([
            this.processImage(file, { width: 1200, height: 900, quality: 90 }),
            this.processImage(file, { width: 800, height: 600, quality: 85 }),
            this.processImage(file, { width: 400, height: 300, quality: 80 }),
            this.createThumbnail(file, 150),
        ]);
        return { original, large, medium, thumbnail };
    }
    // Delete image file
    async deleteImage(filename) {
        try {
            const filePath = path_1.default.join(this.uploadDir, filename);
            await promises_1.default.unlink(filePath);
            return true;
        }
        catch (error) {
            console.error('Failed to delete image:', error);
            return false;
        }
    }
    // Delete multiple images
    async deleteImages(filenames) {
        const deleted = [];
        const failed = [];
        for (const filename of filenames) {
            const success = await this.deleteImage(filename);
            if (success) {
                deleted.push(filename);
            }
            else {
                failed.push(filename);
            }
        }
        return { deleted, failed };
    }
    // Validate image file
    validateImage(file) {
        // Check file size
        if (file.size > env_1.env.MAX_FILE_SIZE) {
            throw new errorHandler_1.ValidationError(`File size exceeds limit of ${env_1.env.MAX_FILE_SIZE / 1024 / 1024}MB`);
        }
        // Check file type
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        if (!allowedTypes.includes(file.mimetype)) {
            throw new errorHandler_1.ValidationError('Invalid file type. Only JPEG, PNG, and WebP images are allowed.');
        }
        // Check file dimensions (basic check)
        if (file.size < 1024) {
            throw new errorHandler_1.ValidationError('Image file is too small');
        }
    }
    // Get image info
    async getImageInfo(filename) {
        try {
            const filePath = path_1.default.join(this.uploadDir, filename);
            const stats = await promises_1.default.stat(filePath);
            const metadata = await (0, sharp_1.default)(filePath).metadata();
            return {
                exists: true,
                size: stats.size,
                width: metadata.width,
                height: metadata.height,
                format: metadata.format,
            };
        }
        catch {
            return { exists: false };
        }
    }
    // Generate image URL
    generateImageUrl(filename) {
        return `${this.baseUrl}/uploads/${filename}`;
    }
    // Extract filename from URL
    extractFilenameFromUrl(url) {
        const match = url.match(/\/uploads\/([^\/]+)$/);
        return match ? match[1] : null;
    }
}
exports.ImageService = ImageService;
