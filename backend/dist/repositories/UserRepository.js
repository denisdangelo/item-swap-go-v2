"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const database_1 = require("@/config/database");
const BaseRepository_1 = require("./BaseRepository");
class UserRepository extends BaseRepository_1.BaseRepository {
    constructor() {
        super(...arguments);
        this.tableName = 'users';
        this.selectFields = `
    id, email, password_hash, first_name, last_name, phone, avatar_url, bio,
    location_lat, location_lng, location_address, is_verified, is_active,
    created_at, updated_at
  `;
    }
    // Create user storing password as plain text (simplified for demo)
    async create(data) {
        const userData = {
            ...data,
            password_hash: data.password,
        };
        // Remove password from data before calling parent create
        const { password, ...createData } = userData;
        return super.create(createData);
    }
    // Find user by email
    async findByEmail(email) {
        const query = `SELECT ${this.selectFields} FROM ${this.tableName} WHERE email = ?`;
        const rows = await (0, database_1.executeQuery)(query, [email]);
        return rows.length > 0 ? rows[0] : null;
    }
    // Verify password (plain text comparison)
    async verifyPassword(user, password) {
        return user.password_hash === password;
    }
    // Update password (store plain text)
    async updatePassword(id, newPassword) {
        const query = 'UPDATE users SET password_hash = ? WHERE id = ?';
        const result = await (0, database_1.executeQuery)(query, [newPassword, id]);
        return result.affectedRows > 0;
    }
    // Get user profile with additional data
    async getProfile(id) {
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
        const rows = await (0, database_1.executeQuery)(query, [id]);
        return rows.length > 0 ? rows[0] : null;
    }
    // Find users by location (within radius in km)
    async findByLocation(lat, lng, radiusKm = 10) {
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
        return (0, database_1.executeQuery)(query, [lat, lng, lat, radiusKm]);
    }
    // Search users by name
    async searchByName(searchTerm) {
        const query = `
      SELECT ${this.selectFields}
      FROM ${this.tableName}
      WHERE (first_name LIKE ? OR last_name LIKE ? OR CONCAT(first_name, ' ', last_name) LIKE ?)
        AND is_active = true
      ORDER BY first_name, last_name
    `;
        const searchPattern = `%${searchTerm}%`;
        return (0, database_1.executeQuery)(query, [searchPattern, searchPattern, searchPattern]);
    }
    // Get user statistics
    async getUserStats(id) {
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
        const rows = await (0, database_1.executeQuery)(query, [id]);
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
    async verifyEmail(id) {
        const query = 'UPDATE users SET is_verified = true WHERE id = ?';
        const result = await (0, database_1.executeQuery)(query, [id]);
        return result.affectedRows > 0;
    }
    // Deactivate user
    async deactivate(id) {
        const query = 'UPDATE users SET is_active = false WHERE id = ?';
        const result = await (0, database_1.executeQuery)(query, [id]);
        return result.affectedRows > 0;
    }
    // Activate user
    async activate(id) {
        const query = 'UPDATE users SET is_active = true WHERE id = ?';
        const result = await (0, database_1.executeQuery)(query, [id]);
        return result.affectedRows > 0;
    }
}
exports.UserRepository = UserRepository;
