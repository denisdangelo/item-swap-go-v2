"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.asyncHandler = exports.notFoundHandler = exports.errorHandler = exports.InternalServerError = exports.ConflictError = exports.NotFoundError = exports.AuthorizationError = exports.AuthenticationError = exports.ValidationError = exports.AppError = void 0;
const env_1 = require("@/config/env");
const logger_1 = __importDefault(require("@/config/logger"));
// Custom error classes
class AppError extends Error {
    constructor(message, context) {
        super(message);
        this.context = context;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.AppError = AppError;
class ValidationError extends AppError {
    constructor() {
        super(...arguments);
        this.statusCode = 400;
        this.isOperational = true;
    }
}
exports.ValidationError = ValidationError;
class AuthenticationError extends AppError {
    constructor() {
        super(...arguments);
        this.statusCode = 401;
        this.isOperational = true;
    }
}
exports.AuthenticationError = AuthenticationError;
class AuthorizationError extends AppError {
    constructor() {
        super(...arguments);
        this.statusCode = 403;
        this.isOperational = true;
    }
}
exports.AuthorizationError = AuthorizationError;
class NotFoundError extends AppError {
    constructor() {
        super(...arguments);
        this.statusCode = 404;
        this.isOperational = true;
    }
}
exports.NotFoundError = NotFoundError;
class ConflictError extends AppError {
    constructor() {
        super(...arguments);
        this.statusCode = 409;
        this.isOperational = true;
    }
}
exports.ConflictError = ConflictError;
class InternalServerError extends AppError {
    constructor() {
        super(...arguments);
        this.statusCode = 500;
        this.isOperational = false;
    }
}
exports.InternalServerError = InternalServerError;
// Global error handler middleware
const errorHandler = (error, req, res, next) => {
    // Log error
    logger_1.default.error(`Error: ${error.message}`, {
        error: error.stack,
        url: req.originalUrl,
        method: req.method,
        ip: req.ip,
        userAgent: req.get('User-Agent'),
    });
    let statusCode = 500;
    let errorCode = 'INTERNAL_SERVER_ERROR';
    let message = 'Something went wrong';
    let details = undefined;
    // Handle different error types
    if (error instanceof AppError) {
        statusCode = error.statusCode;
        errorCode = error.constructor.name;
        message = error.message;
        details = error.context;
    }
    else if (error.name === 'MulterError') {
        statusCode = 400;
        errorCode = 'FILE_UPLOAD_ERROR';
        message = error.message;
    }
    // Prepare error response
    const errorResponse = {
        success: false,
        error: {
            code: errorCode,
            message,
            ...(details && { details }),
            ...(!env_1.isProduction && { stack: error.stack }),
        },
    };
    res.status(statusCode).json(errorResponse);
};
exports.errorHandler = errorHandler;
// 404 handler
const notFoundHandler = (req, res) => {
    res.status(404).json({
        success: false,
        error: {
            code: 'NOT_FOUND',
            message: `Route ${req.originalUrl} not found`,
        },
    });
};
exports.notFoundHandler = notFoundHandler;
// Async error wrapper
const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
exports.asyncHandler = asyncHandler;
