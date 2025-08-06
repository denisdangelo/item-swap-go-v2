import { executeQuery } from '@/config/database';
import { CreateRefreshTokenData, RefreshToken } from '@/models/RefreshToken';
import bcrypt from 'bcryptjs';
import { BaseRepository } from './BaseRepository';

export class RefreshTokenRepository extends BaseRepository<
  RefreshToken,
  CreateRefreshTokenData,
  never
> {
  protected tableName = 'refresh_tokens';
  protected selectFields = `
    id, user_id, token_hash, expires_at, is_revoked, created_at
  `;

  // Create refresh token with hashed token
  async create(data: CreateRefreshTokenData): Promise<RefreshToken> {
    const tokenHash = await bcrypt.hash(data.token, 12);

    const tokenData = {
      user_id: data.user_id,
      token_hash: tokenHash,
      expires_at: data.expires_at,
    };

    return super.create(tokenData as any);
  }

  // Find valid token by user and token
  async findValidToken(userId: string, token: string): Promise<RefreshToken | null> {
    const query = `
      SELECT ${this.selectFields}
      FROM ${this.tableName}
      WHERE user_id = ? 
        AND expires_at > NOW() 
        AND is_revoked = false
    `;

    const tokens = await executeQuery<RefreshToken[]>(query, [userId]);

    // Check each token hash
    for (const tokenRecord of tokens) {
      const isValid = await bcrypt.compare(token, tokenRecord.token_hash);
      if (isValid) {
        return tokenRecord;
      }
    }

    return null;
  }

  // Revoke token
  async revokeToken(id: string): Promise<boolean> {
    const query = 'UPDATE refresh_tokens SET is_revoked = true WHERE id = ?';
    const result = await executeQuery<any>(query, [id]);
    return result.affectedRows > 0;
  }

  // Revoke all tokens for user
  async revokeAllUserTokens(userId: string): Promise<boolean> {
    const query = 'UPDATE refresh_tokens SET is_revoked = true WHERE user_id = ?';
    const result = await executeQuery<any>(query, [userId]);
    return result.affectedRows > 0;
  }

  // Clean expired tokens
  async cleanExpiredTokens(): Promise<number> {
    const query = 'DELETE FROM refresh_tokens WHERE expires_at < NOW() OR is_revoked = true';
    const result = await executeQuery<any>(query);
    return result.affectedRows;
  }

  // Get user active tokens count
  async getUserActiveTokensCount(userId: string): Promise<number> {
    const query = `
      SELECT COUNT(*) as count
      FROM refresh_tokens
      WHERE user_id = ? 
        AND expires_at > NOW() 
        AND is_revoked = false
    `;

    const result = await executeQuery<Array<{ count: number }>>(query, [userId]);
    return result[0].count;
  }

  // Find tokens by user
  async findByUser(userId: string): Promise<RefreshToken[]> {
    return this.findAll({ user_id: userId });
  }
}
