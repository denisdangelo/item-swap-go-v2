"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseRepository = void 0;
const database_1 = require("@/config/database");
const uuid_1 = require("uuid");
class BaseRepository {
    // Generate UUID
    generateId() {
        return (0, uuid_1.v4)();
    }
    // Build WHERE clause from filters
    buildWhereClause(filters) {
        const conditions = [];
        const params = [];
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                conditions.push(`${key} = ?`);
                params.push(value);
            }
        });
        const clause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
        return { clause, params };
    }
    // Find by ID
    async findById(id) {
        const query = `SELECT ${this.selectFields} FROM ${this.tableName} WHERE id = ?`;
        const rows = await (0, database_1.executeQuery)(query, [id]);
        return rows.length > 0 ? rows[0] : null;
    }
    // Find all with optional filters
    async findAll(filters = {}) {
        const { clause, params } = this.buildWhereClause(filters);
        const query = `SELECT ${this.selectFields} FROM ${this.tableName} ${clause} ORDER BY created_at DESC`;
        return await (0, database_1.executeQuery)(query, params);
    }
    // Find with pagination
    async findWithPagination(filters = {}, pagination) {
        const { page, limit } = pagination;
        const offset = (page - 1) * limit;
        const { clause, params } = this.buildWhereClause(filters);
        // Get total count
        const countQuery = `SELECT COUNT(*) as total FROM ${this.tableName} ${clause}`;
        const countResult = await (0, database_1.executeQuery)(countQuery, params);
        const total = countResult[0].total;
        // Get data
        const dataQuery = `
      SELECT ${this.selectFields} 
      FROM ${this.tableName} 
      ${clause} 
      ORDER BY created_at DESC 
      LIMIT ? OFFSET ?
    `;
        const data = await (0, database_1.executeQuery)(dataQuery, [...params, limit, offset]);
        return {
            data,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    // Create
    async create(data) {
        const id = this.generateId();
        const fields = Object.keys(data);
        const values = Object.values(data);
        const placeholders = fields.map(() => '?').join(', ');
        const fieldNames = ['id', ...fields].join(', ');
        const allValues = [id, ...values];
        const query = `INSERT INTO ${this.tableName} (${fieldNames}) VALUES (?, ${placeholders})`;
        await (0, database_1.executeQuery)(query, allValues);
        const created = await this.findById(id);
        if (!created) {
            throw new Error('Failed to create record');
        }
        return created;
    }
    // Update
    async update(id, data) {
        const fields = Object.keys(data).filter((key) => data[key] !== undefined);
        if (fields.length === 0) {
            return this.findById(id);
        }
        const setClause = fields.map((field) => `${field} = ?`).join(', ');
        const values = fields.map((field) => data[field]);
        const query = `UPDATE ${this.tableName} SET ${setClause} WHERE id = ?`;
        await (0, database_1.executeQuery)(query, [...values, id]);
        return this.findById(id);
    }
    // Delete
    async delete(id) {
        const query = `DELETE FROM ${this.tableName} WHERE id = ?`;
        const result = await (0, database_1.executeQuery)(query, [id]);
        return result.affectedRows > 0;
    }
    // Soft delete (if table has is_active field)
    async softDelete(id) {
        return this.update(id, { is_active: false });
    }
    // Check if record exists
    async exists(id) {
        const query = `SELECT 1 FROM ${this.tableName} WHERE id = ? LIMIT 1`;
        const rows = await (0, database_1.executeQuery)(query, [id]);
        return rows.length > 0;
    }
    // Count records
    async count(filters = {}) {
        const { clause, params } = this.buildWhereClause(filters);
        const query = `SELECT COUNT(*) as total FROM ${this.tableName} ${clause}`;
        const result = await (0, database_1.executeQuery)(query, params);
        return result[0].total;
    }
}
exports.BaseRepository = BaseRepository;
