"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("@/config/database");
const logger_1 = __importDefault(require("@/config/logger"));
const migrations_1 = require("@/config/migrations");
async function migrate() {
    try {
        logger_1.default.info('🔄 Starting database migration...');
        // Test database connection
        const isConnected = await (0, database_1.testConnection)();
        if (!isConnected) {
            throw new Error('Database connection failed');
        }
        // Run migrations
        await (0, migrations_1.runMigrations)();
        logger_1.default.info('✅ Database migration completed successfully');
        process.exit(0);
    }
    catch (error) {
        logger_1.default.error('❌ Database migration failed:', error);
        process.exit(1);
    }
}
// Run migration
migrate();
