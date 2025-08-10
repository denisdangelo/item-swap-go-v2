"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefreshTokenRepository = void 0;
const database_1 = require("@/config/database");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const BaseRepository_1 = require("./BaseRepository");
class RefreshTokenRepository extends BaseRepository_1.BaseRepository {
    constructor() {
        super(...arguments);
        this.tableName = 'refresh_tokens';
        this.selectFields = `
    id, user_id, token_hash, expires_at, is_revoked, created_at
  `;
    }
    // Create refresh token with hashed token
    async create(data) {
        const tokenHash = await bcryptjs_1.default.hash(data.token, 12);
        const tokenData = {
            user_id: data.user_id,
            token_hash: tokenHash,
            expires_at: data.expires_at,
        };
        return super.create(tokenData);
    }
    // Find valid token by user and token
    async findValidToken(userId, token) {
        const query = `
      SELECT ${this.selectFields}
      FROM ${this.tableName}
      WHERE user_id = ? 
        AND expires_at > NOW() 
        AND is_revoked = false
    `;
        const tokens = await (0, database_1.executeQuery)(query, [userId]);
        // Check each token hash
        for (const tokenRecord of tokens) {
            const isValid = await bcryptjs_1.default.compare(token, tokenRecord.token_hash);
            if (isValid) {
                return tokenRecord;
            }
        }
        return null;
    }
    // Revoke token
    async revokeToken(id) {
        const query = 'UPDATE refresh_tokens SET is_revoked = true WHERE id = ?';
        const result = await (0, database_1.executeQuery)(query, [id]);
        return result.affectedRows > 0;
    }
    // Revoke all tokens for user
    async revokeAllUserTokens(userId) {
        const query = 'UPDATE refresh_tokens SET is_revoked = true WHERE user_id = ?';
        const result = await (0, database_1.executeQuery)(query, [userId]);
        return result.affectedRows > 0;
    }
    // Clean expired tokens
    async cleanExpiredTokens() {
        const query = 'DELETE FROM refresh_tokens WHERE expires_at < NOW() OR is_revoked = true';
        const result = await (0, database_1.executeQuery)(query);
        return result.affectedRows;
    }
    // Get user active tokens count
    async getUserActiveTokensCount(userId) {
        const query = `
      SELECT COUNT(*) as count
      FROM refresh_tokens
      WHERE user_id = ? 
        AND expires_at > NOW() 
        AND is_revoked = false
    `;
        const result = await (0, database_1.executeQuery)(query, [userId]);
        return result[0].count;
    }
    // Find tokens by user
    async findByUser(userId) {
        return this.findAll({ user_id: userId });
    }
}
exports.RefreshTokenRepository = RefreshTokenRepository;
