"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendError = exports.sendNoContent = exports.sendCreated = exports.sendPaginatedSuccess = exports.sendSuccess = void 0;
// Success response helper
const sendSuccess = (res, data, message, statusCode = 200) => {
    const response = {
        success: true,
        data,
        ...(message && { message }),
    };
    res.status(statusCode).json(response);
};
exports.sendSuccess = sendSuccess;
// Paginated response helper
const sendPaginatedSuccess = (res, data, pagination, message, statusCode = 200) => {
    const response = {
        success: true,
        data,
        pagination,
        ...(message && { message }),
    };
    res.status(statusCode).json(response);
};
exports.sendPaginatedSuccess = sendPaginatedSuccess;
// Created response helper
const sendCreated = (res, data, message = 'Resource created successfully') => {
    (0, exports.sendSuccess)(res, data, message, 201);
};
exports.sendCreated = sendCreated;
// No content response helper
const sendNoContent = (res) => {
    res.status(204).send();
};
exports.sendNoContent = sendNoContent;
// Error response helper
const sendError = (res, code, message, statusCode = 400, details) => {
    const response = {
        success: false,
        error: {
            code,
            message,
            ...(details && { details }),
        },
    };
    res.status(statusCode).json(response);
};
exports.sendError = sendError;
