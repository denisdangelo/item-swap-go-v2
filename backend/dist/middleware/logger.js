"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.httpLogger = void 0;
const logger_1 = __importDefault(require("@/config/logger"));
// HTTP request logging middleware
const httpLogger = (req, res, next) => {
    const start = Date.now();
    // Log request
    logger_1.default.http(`${req.method} ${req.originalUrl} - ${req.ip}`);
    // Override res.end to log response
    const originalEnd = res.end;
    res.end = function (chunk, encoding) {
        const duration = Date.now() - start;
        logger_1.default.http(`${req.method} ${req.originalUrl} - ${res.statusCode} - ${duration}ms`);
        return originalEnd.call(this, chunk, encoding);
    };
    next();
};
exports.httpLogger = httpLogger;
