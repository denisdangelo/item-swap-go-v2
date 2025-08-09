"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleUploadError = exports.uploadMultiple = exports.uploadSingle = exports.upload = void 0;
const errorHandler_1 = require("@/middleware/errorHandler");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const env_1 = require("./env");
// Allowed file types
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
// File size limit (5MB)
const MAX_FILE_SIZE = env_1.env.MAX_FILE_SIZE;
// Storage configuration
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, env_1.env.UPLOAD_DIR);
    },
    filename: (req, file, cb) => {
        // Generate unique filename
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const extension = path_1.default.extname(file.originalname);
        cb(null, `${file.fieldname}-${uniqueSuffix}${extension}`);
    },
});
// File filter
const fileFilter = (req, file, cb) => {
    // Check file type
    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
        return cb(new errorHandler_1.ValidationError('Invalid file type. Only JPEG, PNG, and WebP images are allowed.'));
    }
    cb(null, true);
};
// Multer configuration
exports.upload = (0, multer_1.default)({
    storage,
    fileFilter,
    limits: {
        fileSize: MAX_FILE_SIZE,
        files: 5, // Maximum 5 files per request
    },
});
// Single file upload middleware
const uploadSingle = (fieldName) => exports.upload.single(fieldName);
exports.uploadSingle = uploadSingle;
// Multiple files upload middleware
const uploadMultiple = (fieldName, maxCount = 5) => exports.upload.array(fieldName, maxCount);
exports.uploadMultiple = uploadMultiple;
// Upload error handler
const handleUploadError = (error, req, res, next) => {
    if (error instanceof multer_1.default.MulterError) {
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
exports.handleUploadError = handleUploadError;
