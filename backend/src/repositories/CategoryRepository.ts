import { executeQuery } from '@/config/database';
import {
  Category,
  CategoryWithItemCount,
  CreateCategoryData,
  UpdateCategoryData,
} from '@/models/Category';
import { BaseRepository } from './BaseRepository';

export class CategoryRepository extends BaseRepository<
  Category,
  CreateCategoryData,
  UpdateCategoryData
> {
  protected tableName = 'categories';
  protected selectFields = `
    id, name, description, icon, color, is_active, created_at, updated_at
  `;

  // Find category by name
  async findByName(name: string): Promise<Category | null> {
    const query = `SELECT ${this.selectFields} FROM ${this.tableName} WHERE name = ?`;
    const rows = await executeQuery<Category[]>(query, [name]);
    return rows.length > 0 ? rows[0] : null;
  }

  // Get active categories only
  async findActive(): Promise<Category[]> {
    return this.findAll({ is_active: true });
  }

  // Get categories with item count
  async findWithItemCount(): Promise<CategoryWithItemCount[]> {
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

    return executeQuery<CategoryWithItemCount[]>(query);
  }

  // Get popular categories (with most items)
  async findPopular(limit: number = 10): Promise<CategoryWithItemCount[]> {
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

    return executeQuery<CategoryWithItemCount[]>(query, [limit]);
  }

  // Search categories by name
  async searchByName(searchTerm: string): Promise<Category[]> {
    const query = `
      SELECT ${this.selectFields}
      FROM ${this.tableName}
      WHERE name LIKE ? AND is_active = true
      ORDER BY name
    `;

    const searchPattern = `%${searchTerm}%`;
    return executeQuery<Category[]>(query, [searchPattern]);
  }

  // Check if category is being used by items
  async isInUse(id: string): Promise<boolean> {
    const query = 'SELECT 1 FROM items WHERE category_id = ? AND is_active = true LIMIT 1';
    const rows = await executeQuery<any[]>(query, [id]);
    return rows.length > 0;
  }

  // Get category statistics
  async getCategoryStats(id: string): Promise<{
    items_count: number;
    active_items_count: number;
    total_loans_count: number;
  }> {
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

    const rows = await executeQuery<any[]>(query, [id]);
    return rows.length > 0
      ? rows[0]
      : {
          items_count: 0,
          active_items_count: 0,
          total_loans_count: 0,
        };
  }
}
