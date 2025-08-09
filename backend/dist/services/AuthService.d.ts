import { CreateUserData, User } from '@/models/User';
export interface LoginCredentials {
    email: string;
    password: string;
}
export interface SimpleAuthResponse {
    sessionToken: string;
    user: Omit<User, 'password_hash'>;
}
export interface TokenPayload {
    userId: string;
    email: string;
}
export declare class AuthService {
    private userRepository;
    constructor();
    register(userData: CreateUserData): Promise<SimpleAuthResponse>;
    login(credentials: LoginCredentials): Promise<SimpleAuthResponse>;
    refreshToken(): Promise<never>;
    logout(): Promise<void>;
    logoutAll(): Promise<void>;
    verifyAccessToken(token: string): Promise<TokenPayload>;
    changePassword(userId: string, _currentPassword: string, newPassword: string): Promise<void>;
    private generateSimpleSession;
    private validatePassword;
    private parseTimeToMs;
    cleanExpiredTokens(): Promise<number>;
}
