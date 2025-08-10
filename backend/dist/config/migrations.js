"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rollbackLastMigration = exports.runMigrations = exports.loadMigrations = exports.removeMigrationFromExecuted = exports.markMigrationAsExecuted = exports.getExecutedMigrations = exports.createMigrationsTable = void 0;
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const database_1 = require("./database");
const logger_1 = __importDefault(require("./logger"));
// Create migrations table if it doesn't exist
const createMigrationsTable = async () => {
    const query = `
    CREATE TABLE IF NOT EXISTS migrations (
      id VARCHAR(255) PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `;
    await (0, database_1.executeQuery)(query);
    logger_1.default.info('Migrations table created or verified');
};
exports.createMigrationsTable = createMigrationsTable;
// Get executed migrations
const getExecutedMigrations = async () => {
    const query = 'SELECT id FROM migrations ORDER BY executed_at ASC';
    const rows = await (0, database_1.executeQuery)(query);
    return rows.map((row) => row.id);
};
exports.getExecutedMigrations = getExecutedMigrations;
// Mark migration as executed
const markMigrationAsExecuted = async (id, name) => {
    const query = 'INSERT INTO migrations (id, name) VALUES (?, ?)';
    await (0, database_1.executeQuery)(query, [id, name]);
};
exports.markMigrationAsExecuted = markMigrationAsExecuted;
// Remove migration from executed list
const removeMigrationFromExecuted = async (id) => {
    const query = 'DELETE FROM migrations WHERE id = ?';
    await (0, database_1.executeQuery)(query, [id]);
};
exports.removeMigrationFromExecuted = removeMigrationFromExecuted;
// Load migration files
const loadMigrations = async () => {
    const migrationsDir = path_1.default.join(__dirname, '../../migrations');
    try {
        const files = await promises_1.default.readdir(migrationsDir);
        const migrationFiles = files.filter((file) => file.endsWith('.sql'));
        const migrations = [];
        for (const file of migrationFiles) {
            const filePath = path_1.default.join(migrationsDir, file);
            const content = await promises_1.default.readFile(filePath, 'utf-8');
            // Split up and down migrations
            const [up, down] = content.split('-- DOWN');
            if (!up || !down) {
                throw new Error(`Invalid migration file format: ${file}`);
            }
            const id = file.replace('.sql', '');
            const name = id.replace(/^\d+_/, '').replace(/_/g, ' ');
            migrations.push({
                id,
                name,
                up: up.replace('-- UP', '').trim(),
                down: down.trim(),
            });
        }
        return migrations.sort((a, b) => a.id.localeCompare(b.id));
    }
    catch (error) {
        logger_1.default.error('Error loading migrations:', error);
        return [];
    }
};
exports.loadMigrations = loadMigrations;
// Run migrations
const runMigrations = async () => {
    await (0, exports.createMigrationsTable)();
    const migrations = await (0, exports.loadMigrations)();
    const executedMigrations = await (0, exports.getExecutedMigrations)();
    const pendingMigrations = migrations.filter((migration) => !executedMigrations.includes(migration.id));
    if (pendingMigrations.length === 0) {
        logger_1.default.info('No pending migrations');
        return;
    }
    logger_1.default.info(`Running ${pendingMigrations.length} pending migrations`);
    for (const migration of pendingMigrations) {
        try {
            logger_1.default.info(`Running migration: ${migration.id} - ${migration.name}`);
            // Execute migration
            await (0, database_1.executeQuery)(migration.up);
            // Mark as executed
            await (0, exports.markMigrationAsExecuted)(migration.id, migration.name);
            logger_1.default.info(`Migration completed: ${migration.id}`);
        }
        catch (error) {
            logger_1.default.error(`Migration failed: ${migration.id}`, error);
            throw error;
        }
    }
    logger_1.default.info('All migrations completed successfully');
};
exports.runMigrations = runMigrations;
// Rollback last migration
const rollbackLastMigration = async () => {
    const executedMigrations = await (0, exports.getExecutedMigrations)();
    if (executedMigrations.length === 0) {
        logger_1.default.info('No migrations to rollback');
        return;
    }
    const lastMigrationId = executedMigrations[executedMigrations.length - 1];
    const migrations = await (0, exports.loadMigrations)();
    const migration = migrations.find((m) => m.id === lastMigrationId);
    if (!migration) {
        throw new Error(`Migration file not found: ${lastMigrationId}`);
    }
    try {
        logger_1.default.info(`Rolling back migration: ${migration.id} - ${migration.name}`);
        // Execute rollback
        await (0, database_1.executeQuery)(migration.down);
        // Remove from executed list
        await (0, exports.removeMigrationFromExecuted)(migration.id);
        logger_1.default.info(`Migration rolled back: ${migration.id}`);
    }
    catch (error) {
        logger_1.default.error(`Migration rollback failed: ${migration.id}`, error);
        throw error;
    }
};
exports.rollbackLastMigration = rollbackLastMigration;
