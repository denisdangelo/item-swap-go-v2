#!/usr/bin/env tsx
/**
 * Script de Migração para Azure Schema Modernizado
 *
 * Este script migra os dados do schema atual (com IDs inteiros)
 * para o novo schema modernizado (com UUIDs) no Azure.
 *
 * IMPORTANTE: Execute este script em ambiente de teste primeiro!
 */
interface IdMapping {
    [oldId: string]: string;
}
declare class AzureSchemaMigrator {
    private sourceConnection;
    private targetConnection;
    private idMappings;
    u: any;
    IdMapping: any;
    categories: IdMapping;
    items: IdMapping;
    loans: IdMapping;
}
export { AzureSchemaMigrator };
