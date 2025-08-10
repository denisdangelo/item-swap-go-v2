import fs from 'fs/promises';
import path from 'path';
import { executeQuery } from './database';
import logger from './logger';

export interface Migration {
  id: string;
  name: string;
  up: string;
  down: string;
  executed_at?: Date;
}

// Create migrations table if it doesn't exist
export const createMigrationsTable = async (): Promise<void> => {
  const query = `
    CREATE TABLE IF NOT EXISTS migrations (
      id VARCHAR(255) PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `;

  await executeQuery(query);
  logger.info('Migrations table created or verified');
};

// Get executed migrations
export const getExecutedMigrations = async (): Promise<string[]> => {
  const query = 'SELECT id FROM migrations ORDER BY executed_at ASC';
  const rows = await executeQuery<Array<{ id: string }>>(query);
  return rows.map((row) => row.id);
};

// Mark migration as executed
export const markMigrationAsExecuted = async (id: string, name: string): Promise<void> => {
  const query = 'INSERT INTO migrations (id, name) VALUES (?, ?)';
  await executeQuery(query, [id, name]);
};

// Remove migration from executed list
export const removeMigrationFromExecuted = async (id: string): Promise<void> => {
  const query = 'DELETE FROM migrations WHERE id = ?';
  await executeQuery(query, [id]);
};

// Load migration files
export const loadMigrations = async (): Promise<Migration[]> => {
  const migrationsDir = path.join(__dirname, '../../migrations');

  try {
    const files = await fs.readdir(migrationsDir);
    const migrationFiles = files.filter((file) => file.endsWith('.sql'));

    const migrations: Migration[] = [];

    for (const file of migrationFiles) {
      const filePath = path.join(migrationsDir, file);
      const content = await fs.readFile(filePath, 'utf-8');

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
  } catch (error) {
    logger.error('Error loading migrations:', error);
    return [];
  }
};

// Run migrations
export const runMigrations = async (): Promise<void> => {
  await createMigrationsTable();

  const migrations = await loadMigrations();
  const executedMigrations = await getExecutedMigrations();

  const pendingMigrations = migrations.filter(
    (migration) => !executedMigrations.includes(migration.id)
  );

  if (pendingMigrations.length === 0) {
    logger.info('No pending migrations');
    return;
  }

  logger.info(`Running ${pendingMigrations.length} pending migrations`);

  for (const migration of pendingMigrations) {
    try {
      logger.info(`Running migration: ${migration.id} - ${migration.name}`);

      // Execute migration
      await executeQuery(migration.up);

      // Mark as executed
      await markMigrationAsExecuted(migration.id, migration.name);

      logger.info(`Migration completed: ${migration.id}`);
    } catch (error) {
      logger.error(`Migration failed: ${migration.id}`, error);
      throw error;
    }
  }

  logger.info('All migrations completed successfully');
};

// Rollback last migration
export const rollbackLastMigration = async (): Promise<void> => {
  const executedMigrations = await getExecutedMigrations();

  if (executedMigrations.length === 0) {
    logger.info('No migrations to rollback');
    return;
  }

  const lastMigrationId = executedMigrations[executedMigrations.length - 1];
  const migrations = await loadMigrations();
  const migration = migrations.find((m) => m.id === lastMigrationId);

  if (!migration) {
    throw new Error(`Migration file not found: ${lastMigrationId}`);
  }

  try {
    logger.info(`Rolling back migration: ${migration.id} - ${migration.name}`);

    // Execute rollback
    await executeQuery(migration.down);

    // Remove from executed list
    await removeMigrationFromExecuted(migration.id);

    logger.info(`Migration rolled back: ${migration.id}`);
  } catch (error) {
    logger.error(`Migration rollback failed: ${migration.id}`, error);
    throw error;
  }
};
