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
export declare class ImageService {
    private uploadDir;
    private baseUrl;
    constructor();
    private ensureUploadDir;
    processImage(file: Express.Multer.File, options?: ImageProcessingOptions): Promise<ProcessedImage>;
    processImages(files: Express.Multer.File[], options?: ImageProcessingOptions): Promise<ProcessedImage[]>;
    createThumbnail(file: Express.Multer.File, size?: number): Promise<ProcessedImage>;
    createMultipleSizes(file: Express.Multer.File): Promise<{
        original: ProcessedImage;
        large: ProcessedImage;
        medium: ProcessedImage;
        thumbnail: ProcessedImage;
    }>;
    deleteImage(filename: string): Promise<boolean>;
    deleteImages(filenames: string[]): Promise<{
        deleted: string[];
        failed: string[];
    }>;
    validateImage(file: Express.Multer.File): void;
    getImageInfo(filename: string): Promise<{
        exists: boolean;
        size?: number;
        width?: number;
        height?: number;
        format?: string;
    }>;
    generateImageUrl(filename: string): string;
    extractFilenameFromUrl(url: string): string | null;
}
