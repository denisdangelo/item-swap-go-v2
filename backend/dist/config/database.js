"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.closePool = exports.testConnection = exports.executeQuery = exports.getConnection = exports.createPool = void 0;
const promise_1 = __importDefault(require("mysql2/promise"));
const env_1 = require("./env");
const logger_1 = __importDefault(require("./logger"));
// Database connection pool
let pool = null;
// Create connection pool
const createPool = () => {
    if (!pool) {
        pool = promise_1.default.createPool({
            host: env_1.env.DB_HOST,
            port: env_1.env.DB_PORT,
            user: env_1.env.DB_USER,
            password: env_1.env.DB_PASSWORD,
            database: env_1.env.DB_NAME,
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0,
            charset: 'utf8mb4',
            timezone: '+00:00',
        });
        logger_1.default.info('Database connection pool created');
    }
    return pool;
};
exports.createPool = createPool;
// Get database connection
const getConnection = async () => {
    const dbPool = (0, exports.createPool)();
    return await dbPool.getConnection();
};
exports.getConnection = getConnection;
// Execute query with connection handling
const executeQuery = async (query, params) => {
    const connection = await (0, exports.getConnection)();
    try {
        const [rows] = await connection.execute(query, params);
        return rows;
    }
    finally {
        connection.release();
    }
};
exports.executeQuery = executeQuery;
// Test database connection
const testConnection = async () => {
    try {
        const connection = await (0, exports.getConnection)();
        await connection.ping();
        connection.release();
        logger_1.default.info('Database connection test successful');
        return true;
    }
    catch (error) {
        logger_1.default.error('Database connection test failed:', error);
        return false;
    }
};
exports.testConnection = testConnection;
// Close database pool
const closePool = async () => {
    if (pool) {
        await pool.end();
        pool = null;
        logger_1.default.info('Database connection pool closed');
    }
};
exports.closePool = closePool;
