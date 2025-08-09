import { CreateRefreshTokenData, RefreshToken } from '@/models/RefreshToken';
import { BaseRepository } from './BaseRepository';
export declare class RefreshTokenRepository extends BaseRepository<RefreshToken, CreateRefreshTokenData, never> {
    protected tableName: string;
    protected selectFields: string;
    create(data: CreateRefreshTokenData): Promise<RefreshToken>;
    findValidToken(userId: string, token: string): Promise<RefreshToken | null>;
    revokeToken(id: string): Promise<boolean>;
    revokeAllUserTokens(userId: string): Promise<boolean>;
    cleanExpiredTokens(): Promise<number>;
    getUserActiveTokensCount(userId: string): Promise<number>;
    findByUser(userId: string): Promise<RefreshToken[]>;
}
