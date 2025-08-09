"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("@/config/database");
const logger_1 = __importDefault(require("@/config/logger"));
const migrations_1 = require("@/config/migrations");
async function reset() {
    try {
        logger_1.default.info('🔄 Starting database reset...');
        // Test database connection
        const isConnected = await (0, database_1.testConnection)();
        if (!isConnected) {
            throw new Error('Database connection failed');
        }
        // Drop all tables
        logger_1.default.info('Dropping existing tables...');
        const dropQueries = [
            'SET FOREIGN_KEY_CHECKS = 0',
            'DROP TABLE IF EXISTS refresh_tokens',
            'DROP TABLE IF EXISTS messages',
            'DROP TABLE IF EXISTS reviews',
            'DROP TABLE IF EXISTS loans',
            'DROP TABLE IF EXISTS item_images',
            'DROP TABLE IF EXISTS items',
            'DROP TABLE IF EXISTS categories',
            'DROP TABLE IF EXISTS users',
            'DROP TABLE IF EXISTS migrations',
            'SET FOREIGN_KEY_CHECKS = 1',
        ];
        for (const query of dropQueries) {
            await (0, database_1.executeQuery)(query);
        }
        logger_1.default.info('✅ All tables dropped successfully');
        // Run migrations
        await (0, migrations_1.runMigrations)();
        logger_1.default.info('✅ Database reset completed successfully');
        process.exit(0);
    }
    catch (error) {
        logger_1.default.error('❌ Database reset failed:', error);
        process.exit(1);
    }
}
// Run reset
reset();
