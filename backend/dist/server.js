"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("@/config/database");
const env_1 = require("@/config/env");
const logger_1 = __importDefault(require("@/config/logger"));
const app_1 = __importDefault(require("./app"));
// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
    logger_1.default.error('Uncaught Exception:', error);
    process.exit(1);
});
// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
    logger_1.default.error('Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
});
// Graceful shutdown
process.on('SIGTERM', () => {
    logger_1.default.info('SIGTERM received. Shutting down gracefully...');
    process.exit(0);
});
process.on('SIGINT', () => {
    logger_1.default.info('SIGINT received. Shutting down gracefully...');
    process.exit(0);
});
// Start the server
const startServer = async () => {
    try {
        logger_1.default.info('🚀 Starting Empresta aê API server...');
        logger_1.default.info(`📝 Environment: ${env_1.env.NODE_ENV}`);
        logger_1.default.info(`🔧 Port: ${env_1.env.PORT}`);
        // Initialize database connection
        logger_1.default.info('🔌 Initializing database connection...');
        (0, database_1.createPool)();
        // Test database connection
        const isConnected = await (0, database_1.testConnection)();
        if (!isConnected) {
            throw new Error('Failed to connect to database');
        }
        logger_1.default.info('✅ Database connection established');
        const app = new app_1.default();
        app.listen();
    }
    catch (error) {
        logger_1.default.error('Failed to start server:', error);
        process.exit(1);
    }
};
// Initialize server
startServer();
