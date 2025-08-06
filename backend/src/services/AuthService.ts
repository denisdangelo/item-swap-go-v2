import { env } from '@/config/env';
import { AuthenticationError, ConflictError, ValidationError } from '@/middleware/errorHandler';
import { CreateUserData, User } from '@/models/User';
import { RefreshTokenRepository } from '@/repositories/RefreshTokenRepository';
import { UserRepository } from '@/repositories/UserRepository';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  user: Omit<User, 'password_hash'>;
}

export interface TokenPayload {
  userId: string;
  email: string;
  iat: number;
  exp: number;
}

export class AuthService {
  private userRepository: UserRepository;
  private refreshTokenRepository: RefreshTokenRepository;

  constructor() {
    this.userRepository = new UserRepository();
    this.refreshTokenRepository = new RefreshTokenRepository();
  }

  // Register new user
  async register(userData: CreateUserData): Promise<AuthTokens> {
    // Check if user already exists
    const existingUser = await this.userRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new ConflictError('User with this email already exists');
    }

    // Validate password strength
    this.validatePassword(userData.password);

    // Create user
    const user = await this.userRepository.create(userData);

    // Generate tokens
    return this.generateTokens(user);
  }

  // Login user
  async login(credentials: LoginCredentials): Promise<AuthTokens> {
    const { email, password } = credentials;

    // Find user by email
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new AuthenticationError('Invalid email or password');
    }

    // Check if user is active
    if (!user.is_active) {
      throw new AuthenticationError('Account is deactivated');
    }

    // Verify password
    const isPasswordValid = await this.userRepository.verifyPassword(user, password);
    if (!isPasswordValid) {
      throw new AuthenticationError('Invalid email or password');
    }

    // Generate tokens
    return this.generateTokens(user);
  }

  // Refresh access token
  async refreshToken(refreshToken: string, userId: string): Promise<AuthTokens> {
    // Find valid refresh token
    const tokenRecord = await this.refreshTokenRepository.findValidToken(userId, refreshToken);
    if (!tokenRecord) {
      throw new AuthenticationError('Invalid or expired refresh token');
    }

    // Get user
    const user = await this.userRepository.findById(userId);
    if (!user || !user.is_active) {
      throw new AuthenticationError('User not found or inactive');
    }

    // Revoke old token
    await this.refreshTokenRepository.revokeToken(tokenRecord.id);

    // Generate new tokens
    return this.generateTokens(user);
  }

  // Logout user
  async logout(refreshToken: string, userId: string): Promise<void> {
    const tokenRecord = await this.refreshTokenRepository.findValidToken(userId, refreshToken);
    if (tokenRecord) {
      await this.refreshTokenRepository.revokeToken(tokenRecord.id);
    }
  }

  // Logout from all devices
  async logoutAll(userId: string): Promise<void> {
    await this.refreshTokenRepository.revokeAllUserTokens(userId);
  }

  // Verify access token
  async verifyAccessToken(token: string): Promise<TokenPayload> {
    try {
      const payload = jwt.verify(token, env.JWT_SECRET) as TokenPayload;

      // Check if user still exists and is active
      const user = await this.userRepository.findById(payload.userId);
      if (!user || !user.is_active) {
        throw new AuthenticationError('User not found or inactive');
      }

      return payload;
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        throw new AuthenticationError('Invalid token');
      }
      if (error instanceof jwt.TokenExpiredError) {
        throw new AuthenticationError('Token expired');
      }
      throw error;
    }
  }

  // Change password
  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string
  ): Promise<void> {
    // Get user
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new AuthenticationError('User not found');
    }

    // Verify current password
    const isCurrentPasswordValid = await this.userRepository.verifyPassword(user, currentPassword);
    if (!isCurrentPasswordValid) {
      throw new AuthenticationError('Current password is incorrect');
    }

    // Validate new password
    this.validatePassword(newPassword);

    // Update password
    await this.userRepository.updatePassword(userId, newPassword);

    // Revoke all refresh tokens to force re-login
    await this.refreshTokenRepository.revokeAllUserTokens(userId);
  }

  // Generate access and refresh tokens
  private async generateTokens(user: User): Promise<AuthTokens> {
    // Generate access token
    const accessTokenPayload = {
      userId: user.id,
      email: user.email,
    };

    const accessToken = jwt.sign(accessTokenPayload, env.JWT_SECRET, {
      expiresIn: env.JWT_EXPIRES_IN,
    });

    // Generate refresh token
    const refreshToken = uuidv4();
    const refreshTokenExpiresAt = new Date();
    refreshTokenExpiresAt.setTime(
      refreshTokenExpiresAt.getTime() + this.parseTimeToMs(env.REFRESH_TOKEN_EXPIRES_IN)
    );

    // Store refresh token
    await this.refreshTokenRepository.create({
      user_id: user.id,
      token: refreshToken,
      expires_at: refreshTokenExpiresAt,
    });

    // Return tokens and user data (without password)
    const { password_hash, ...userWithoutPassword } = user;

    return {
      accessToken,
      refreshToken,
      user: userWithoutPassword,
    };
  }

  // Validate password strength
  private validatePassword(password: string): void {
    if (password.length < 8) {
      throw new ValidationError('Password must be at least 8 characters long');
    }

    if (!/(?=.*[a-z])/.test(password)) {
      throw new ValidationError('Password must contain at least one lowercase letter');
    }

    if (!/(?=.*[A-Z])/.test(password)) {
      throw new ValidationError('Password must contain at least one uppercase letter');
    }

    if (!/(?=.*\d)/.test(password)) {
      throw new ValidationError('Password must contain at least one number');
    }

    if (!/(?=.*[@$!%*?&])/.test(password)) {
      throw new ValidationError('Password must contain at least one special character (@$!%*?&)');
    }
  }

  // Parse time string to milliseconds
  private parseTimeToMs(timeString: string): number {
    const unit = timeString.slice(-1);
    const value = parseInt(timeString.slice(0, -1));

    switch (unit) {
      case 's':
        return value * 1000;
      case 'm':
        return value * 60 * 1000;
      case 'h':
        return value * 60 * 60 * 1000;
      case 'd':
        return value * 24 * 60 * 60 * 1000;
      default:
        return value * 1000; // Default to seconds
    }
  }

  // Clean expired tokens (should be called periodically)
  async cleanExpiredTokens(): Promise<number> {
    return this.refreshTokenRepository.cleanExpiredTokens();
  }
}
