import { executeQuery } from '@/config/database';
import { v4 as uuidv4 } from 'uuid';

export interface PaginationOptions {
  page: number;
  limit: number;
}

export interface PaginationResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export abstract class BaseRepository<T, CreateData, UpdateData> {
  protected abstract tableName: string;
  protected abstract selectFields: string;

  // Generate UUID
  protected generateId(): string {
    return uuidv4();
  }

  // Build WHERE clause from filters
  protected buildWhereClause(filters: Record<string, any>): { clause: string; params: any[] } {
    const conditions: string[] = [];
    const params: any[] = [];

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
  async findById(id: string): Promise<T | null> {
    const query = `SELECT ${this.selectFields} FROM ${this.tableName} WHERE id = ?`;
    const rows = await executeQuery<T[]>(query, [id]);
    return rows.length > 0 ? rows[0] : null;
  }

  // Find all with optional filters
  async findAll(filters: Record<string, any> = {}): Promise<T[]> {
    const { clause, params } = this.buildWhereClause(filters);
    const query = `SELECT ${this.selectFields} FROM ${this.tableName} ${clause} ORDER BY created_at DESC`;
    return await executeQuery<T[]>(query, params);
  }

  // Find with pagination
  async findWithPagination(
    filters: Record<string, any> = {},
    pagination: PaginationOptions
  ): Promise<PaginationResult<T>> {
    const { page, limit } = pagination;
    const offset = (page - 1) * limit;

    const { clause, params } = this.buildWhereClause(filters);

    // Get total count
    const countQuery = `SELECT COUNT(*) as total FROM ${this.tableName} ${clause}`;
    const countResult = await executeQuery<Array<{ total: number }>>(countQuery, params);
    const total = countResult[0].total;

    // Get data
    const dataQuery = `
      SELECT ${this.selectFields} 
      FROM ${this.tableName} 
      ${clause} 
      ORDER BY created_at DESC 
      LIMIT ? OFFSET ?
    `;
    const data = await executeQuery<T[]>(dataQuery, [...params, limit, offset]);

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
  async create(data: CreateData): Promise<T> {
    const id = this.generateId();
    const fields = Object.keys(data as any);
    const values = Object.values(data as any);

    const placeholders = fields.map(() => '?').join(', ');
    const fieldNames = ['id', ...fields].join(', ');
    const allValues = [id, ...values];

    const query = `INSERT INTO ${this.tableName} (${fieldNames}) VALUES (?, ${placeholders})`;
    await executeQuery(query, allValues);

    const created = await this.findById(id);
    if (!created) {
      throw new Error('Failed to create record');
    }

    return created;
  }

  // Update
  async update(id: string, data: UpdateData): Promise<T | null> {
    const fields = Object.keys(data as any).filter((key) => (data as any)[key] !== undefined);

    if (fields.length === 0) {
      return this.findById(id);
    }

    const setClause = fields.map((field) => `${field} = ?`).join(', ');
    const values = fields.map((field) => (data as any)[field]);

    const query = `UPDATE ${this.tableName} SET ${setClause} WHERE id = ?`;
    await executeQuery(query, [...values, id]);

    return this.findById(id);
  }

  // Delete
  async delete(id: string): Promise<boolean> {
    const query = `DELETE FROM ${this.tableName} WHERE id = ?`;
    const result = await executeQuery<any>(query, [id]);
    return result.affectedRows > 0;
  }

  // Soft delete (if table has is_active field)
  async softDelete(id: string): Promise<T | null> {
    return this.update(id, { is_active: false } as UpdateData);
  }

  // Check if record exists
  async exists(id: string): Promise<boolean> {
    const query = `SELECT 1 FROM ${this.tableName} WHERE id = ? LIMIT 1`;
    const rows = await executeQuery<any[]>(query, [id]);
    return rows.length > 0;
  }

  // Count records
  async count(filters: Record<string, any> = {}): Promise<number> {
    const { clause, params } = this.buildWhereClause(filters);
    const query = `SELECT COUNT(*) as total FROM ${this.tableName} ${clause}`;
    const result = await executeQuery<Array<{ total: number }>>(query, params);
    return result[0].total;
  }
}
