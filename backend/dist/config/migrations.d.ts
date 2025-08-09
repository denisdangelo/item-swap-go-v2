export interface Migration {
    id: string;
    name: string;
    up: string;
    down: string;
    executed_at?: Date;
}
export declare const createMigrationsTable: () => Promise<void>;
export declare const getExecutedMigrations: () => Promise<string[]>;
export declare const markMigrationAsExecuted: (id: string, name: string) => Promise<void>;
export declare const removeMigrationFromExecuted: (id: string) => Promise<void>;
export declare const loadMigrations: () => Promise<Migration[]>;
export declare const runMigrations: () => Promise<void>;
export declare const rollbackLastMigration: () => Promise<void>;
