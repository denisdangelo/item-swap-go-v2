import { executeQuery } from '@/config/database';
import { CreateUserData, UpdateUserData, User, UserProfile } from '@/models/User';
import { BaseRepository } from './BaseRepository';

export class UserRepository extends BaseRepository<User, CreateUserData, UpdateUserData> {
  protected tableName = 'users';
  protected selectFields = `
    id, email, password_hash, first_name, last_name, phone, avatar_url, bio,
    location_lat, location_lng, location_address, is_verified, is_active,
    created_at, updated_at
  `;

  // Create user storing password as plain text (simplified for demo)
  async create(data: CreateUserData): Promise<User> {
    const userData = {
      ...data,
      password_hash: data.password,
    } as any;

    // Remove password from data before calling parent create
    const { password, ...createData } = userData;

    return super.create(createData as any);
  }

  // Find user by email
  async findByEmail(email: string): Promise<User | null> {
    const query = `SELECT ${this.selectFields} FROM ${this.tableName} WHERE email = ?`;
    const rows = await executeQuery<User[]>(query, [email]);
    return rows.length > 0 ? rows[0] : null;
  }

  // Verify password (plain text comparison)
  async verifyPassword(user: User, password: string): Promise<boolean> {
    return user.password_hash === password;
  }

  // Update password (store plain text)
  async updatePassword(id: string, newPassword: string): Promise<boolean> {
    const query = 'UPDATE users SET password_hash = ? WHERE id = ?';
    const result = await executeQuery<any>(query, [newPassword, id]);
    return result.affectedRows > 0;
  }

  // Get user profile with additional data
  async getProfile(id: string): Promise<UserProfile | null> {
    const query = `
      SELECT 
        u.id, u.email, u.first_name, u.last_name, u.phone, u.avatar_url, u.bio,
        u.location_lat, u.location_lng, u.location_address, u.is_verified, u.is_active,
        u.created_at, u.updated_at,
        CONCAT(u.first_name, ' ', u.last_name) as full_name,
        COUNT(DISTINCT i.id) as items_count,
        COUNT(DISTINCT r.id) as reviews_count,
        COALESCE(AVG(r.rating), 0) as average_rating
      FROM users u
      LEFT JOIN items i ON u.id = i.owner_id AND i.is_active = true
      LEFT JOIN reviews r ON u.id = r.reviewed_id
      WHERE u.id = ?
      GROUP BY u.id
    `;

    const rows = await executeQuery<UserProfile[]>(query, [id]);
    return rows.length > 0 ? rows[0] : null;
  }

  // Find users by location (within radius in km)
  async findByLocation(lat: number, lng: number, radiusKm: number = 10): Promise<User[]> {
    const query = `
      SELECT ${this.selectFields},
        (6371 * acos(cos(radians(?)) * cos(radians(location_lat)) * 
         cos(radians(location_lng) - radians(?)) + 
         sin(radians(?)) * sin(radians(location_lat)))) AS distance
      FROM ${this.tableName}
      WHERE location_lat IS NOT NULL 
        AND location_lng IS NOT NULL
        AND is_active = true
      HAVING distance < ?
      ORDER BY distance
    `;

    return executeQuery<User[]>(query, [lat, lng, lat, radiusKm]);
  }

  // Search users by name
  async searchByName(searchTerm: string): Promise<User[]> {
    const query = `
      SELECT ${this.selectFields}
      FROM ${this.tableName}
      WHERE (first_name LIKE ? OR last_name LIKE ? OR CONCAT(first_name, ' ', last_name) LIKE ?)
        AND is_active = true
      ORDER BY first_name, last_name
    `;

    const searchPattern = `%${searchTerm}%`;
    return executeQuery<User[]>(query, [searchPattern, searchPattern, searchPattern]);
  }

  // Get user statistics
  async getUserStats(id: string): Promise<{
    items_count: number;
    active_loans_count: number;
    completed_loans_count: number;
    reviews_count: number;
    average_rating: number;
  }> {
    const query = `
      SELECT 
        COUNT(DISTINCT i.id) as items_count,
        COUNT(DISTINCT CASE WHEN l.status IN ('approved', 'active') THEN l.id END) as active_loans_count,
        COUNT(DISTINCT CASE WHEN l.status = 'completed' THEN l.id END) as completed_loans_count,
        COUNT(DISTINCT r.id) as reviews_count,
        COALESCE(AVG(r.rating), 0) as average_rating
      FROM users u
      LEFT JOIN items i ON u.id = i.owner_id AND i.is_active = true
      LEFT JOIN loans l ON u.id = l.lender_id OR u.id = l.borrower_id
      LEFT JOIN reviews r ON u.id = r.reviewed_id
      WHERE u.id = ?
      GROUP BY u.id
    `;

    const rows = await executeQuery<any[]>(query, [id]);
    return rows.length > 0
      ? rows[0]
      : {
          items_count: 0,
          active_loans_count: 0,
          completed_loans_count: 0,
          reviews_count: 0,
          average_rating: 0,
        };
  }

  // Verify user email
  async verifyEmail(id: string): Promise<boolean> {
    const query = 'UPDATE users SET is_verified = true WHERE id = ?';
    const result = await executeQuery<any>(query, [id]);
    return result.affectedRows > 0;
  }

  // Deactivate user
  async deactivate(id: string): Promise<boolean> {
    const query = 'UPDATE users SET is_active = false WHERE id = ?';
    const result = await executeQuery<any>(query, [id]);
    return result.affectedRows > 0;
  }

  // Activate user
  async activate(id: string): Promise<boolean> {
    const query = 'UPDATE users SET is_active = true WHERE id = ?';
    const result = await executeQuery<any>(query, [id]);
    return result.affectedRows > 0;
  }
}
