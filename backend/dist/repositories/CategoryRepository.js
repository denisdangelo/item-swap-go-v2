"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryRepository = void 0;
const database_1 = require("@/config/database");
const BaseRepository_1 = require("./BaseRepository");
class CategoryRepository extends BaseRepository_1.BaseRepository {
    constructor() {
        super(...arguments);
        this.tableName = 'categories';
        this.selectFields = `
    id, name, description, icon, color, is_active, created_at, updated_at
  `;
    }
    // Find category by name
    async findByName(name) {
        const query = `SELECT ${this.selectFields} FROM ${this.tableName} WHERE name = ?`;
        const rows = await (0, database_1.executeQuery)(query, [name]);
        return rows.length > 0 ? rows[0] : null;
    }
    // Get active categories only
    async findActive() {
        return this.findAll({ is_active: true });
    }
    // Get categories with item count
    async findWithItemCount() {
        const query = `
      SELECT 
        c.id, c.name, c.description, c.icon, c.color, c.is_active, 
        c.created_at, c.updated_at,
        COUNT(i.id) as items_count
      FROM categories c
      LEFT JOIN items i ON c.id = i.category_id AND i.is_active = true
      WHERE c.is_active = true
      GROUP BY c.id
      ORDER BY c.name
    `;
        return (0, database_1.executeQuery)(query);
    }
    // Get popular categories (with most items)
    async findPopular(limit = 10) {
        const query = `
      SELECT 
        c.id, c.name, c.description, c.icon, c.color, c.is_active, 
        c.created_at, c.updated_at,
        COUNT(i.id) as items_count
      FROM categories c
      LEFT JOIN items i ON c.id = i.category_id AND i.is_active = true
      WHERE c.is_active = true
      GROUP BY c.id
      HAVING items_count > 0
      ORDER BY items_count DESC
      LIMIT ?
    `;
        return (0, database_1.executeQuery)(query, [limit]);
    }
    // Search categories by name
    async searchByName(searchTerm) {
        const query = `
      SELECT ${this.selectFields}
      FROM ${this.tableName}
      WHERE name LIKE ? AND is_active = true
      ORDER BY name
    `;
        const searchPattern = `%${searchTerm}%`;
        return (0, database_1.executeQuery)(query, [searchPattern]);
    }
    // Check if category is being used by items
    async isInUse(id) {
        const query = 'SELECT 1 FROM items WHERE category_id = ? AND is_active = true LIMIT 1';
        const rows = await (0, database_1.executeQuery)(query, [id]);
        return rows.length > 0;
    }
    // Get category statistics
    async getCategoryStats(id) {
        const query = `
      SELECT 
        COUNT(DISTINCT i.id) as items_count,
        COUNT(DISTINCT CASE WHEN i.is_available = true THEN i.id END) as active_items_count,
        COUNT(DISTINCT l.id) as total_loans_count
      FROM categories c
      LEFT JOIN items i ON c.id = i.category_id AND i.is_active = true
      LEFT JOIN loans l ON i.id = l.item_id
      WHERE c.id = ?
      GROUP BY c.id
    `;
        const rows = await (0, database_1.executeQuery)(query, [id]);
        return rows.length > 0
            ? rows[0]
            : {
                items_count: 0,
                active_items_count: 0,
                total_loans_count: 0,
            };
    }
}
exports.CategoryRepository = CategoryRepository;
