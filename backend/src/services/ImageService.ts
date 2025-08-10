import { env } from '@/config/env';
import { ValidationError } from '@/middleware/errorHandler';
import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';

export interface ImageProcessingOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'jpeg' | 'png' | 'webp';
}

export interface ProcessedImage {
  filename: string;
  path: string;
  url: string;
  size: number;
  width: number;
  height: number;
  format: string;
}

export class ImageService {
  private uploadDir: string;
  private baseUrl: string;

  constructor() {
    this.uploadDir = env.UPLOAD_DIR;
    this.baseUrl = `http://localhost:${env.PORT}`;
    this.ensureUploadDir();
  }

  // Ensure upload directory exists
  private async ensureUploadDir(): Promise<void> {
    try {
      await fs.access(this.uploadDir);
    } catch {
      await fs.mkdir(this.uploadDir, { recursive: true });
    }
  }

  // Process single image
  async processImage(
    file: Express.Multer.File,
    options: ImageProcessingOptions = {}
  ): Promise<ProcessedImage> {
    const { width = 800, height = 600, quality = 85, format = 'jpeg' } = options;

    // Generate unique filename
    const uniqueId = uuidv4();
    const filename = `${uniqueId}.${format}`;
    const outputPath = path.join(this.uploadDir, filename);

    try {
      console.log('Processing image:', file.path, 'Size:', file.size, 'Mimetype:', file.mimetype);
      
      // Process image with Sharp - read from file path since Multer saves to disk
      const processedBuffer = await sharp(file.path)
        .resize(width, height, {
          fit: 'inside',
          withoutEnlargement: true,
        })
        .toFormat(format, { quality })
        .toBuffer();

      // Save processed image
      await fs.writeFile(outputPath, processedBuffer);

      // Get image metadata
      const metadata = await sharp(processedBuffer).metadata();

      return {
        filename,
        path: outputPath,
        url: `${this.baseUrl}/uploads/${filename}`,
        size: processedBuffer.length,
        width: metadata.width || 0,
        height: metadata.height || 0,
        format: metadata.format || format,
      };
    } catch (error) {
      throw new ValidationError(`Failed to process image: ${error}`);
    }
  }

  // Process multiple images
  async processImages(
    files: Express.Multer.File[],
    options: ImageProcessingOptions = {}
  ): Promise<ProcessedImage[]> {
    const processedImages: ProcessedImage[] = [];

    for (const file of files) {
      const processed = await this.processImage(file, options);
      processedImages.push(processed);
    }

    return processedImages;
  }

  // Create thumbnail
  async createThumbnail(file: Express.Multer.File, size: number = 150): Promise<ProcessedImage> {
    return this.processImage(file, {
      width: size,
      height: size,
      quality: 80,
      format: 'jpeg',
    });
  }

  // Create multiple sizes
  async createMultipleSizes(file: Express.Multer.File): Promise<{
    original: ProcessedImage;
    large: ProcessedImage;
    medium: ProcessedImage;
    thumbnail: ProcessedImage;
  }> {
    const [original, large, medium, thumbnail] = await Promise.all([
      this.processImage(file, { width: 1200, height: 900, quality: 90 }),
      this.processImage(file, { width: 800, height: 600, quality: 85 }),
      this.processImage(file, { width: 400, height: 300, quality: 80 }),
      this.createThumbnail(file, 150),
    ]);

    return { original, large, medium, thumbnail };
  }

  // Delete image file
  async deleteImage(filename: string): Promise<boolean> {
    try {
      const filePath = path.join(this.uploadDir, filename);
      await fs.unlink(filePath);
      return true;
    } catch (error) {
      console.error('Failed to delete image:', error);
      return false;
    }
  }

  // Delete multiple images
  async deleteImages(filenames: string[]): Promise<{ deleted: string[]; failed: string[] }> {
    const deleted: string[] = [];
    const failed: string[] = [];

    for (const filename of filenames) {
      const success = await this.deleteImage(filename);
      if (success) {
        deleted.push(filename);
      } else {
        failed.push(filename);
      }
    }

    return { deleted, failed };
  }

  // Validate image file
  validateImage(file: Express.Multer.File): void {
    // Check file size
    if (file.size > env.MAX_FILE_SIZE) {
      throw new ValidationError(`File size exceeds limit of ${env.MAX_FILE_SIZE / 1024 / 1024}MB`);
    }

    // Check file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.mimetype)) {
      throw new ValidationError('Invalid file type. Only JPEG, PNG, and WebP images are allowed.');
    }

    // Check file dimensions (basic check)
    if (file.size < 1024) {
      throw new ValidationError('Image file is too small');
    }
  }

  // Get image info
  async getImageInfo(filename: string): Promise<{
    exists: boolean;
    size?: number;
    width?: number;
    height?: number;
    format?: string;
  }> {
    try {
      const filePath = path.join(this.uploadDir, filename);
      const stats = await fs.stat(filePath);
      const metadata = await sharp(filePath).metadata();

      return {
        exists: true,
        size: stats.size,
        width: metadata.width,
        height: metadata.height,
        format: metadata.format,
      };
    } catch {
      return { exists: false };
    }
  }

  // Generate image URL
  generateImageUrl(filename: string): string {
    return `${this.baseUrl}/uploads/${filename}`;
  }

  // Extract filename from URL
  extractFilenameFromUrl(url: string): string | null {
    const match = url.match(/\/uploads\/([^\/]+)$/);
    return match ? match[1] : null;
  }
}
