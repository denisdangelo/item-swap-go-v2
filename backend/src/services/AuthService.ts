import { AuthenticationError, ConflictError } from '@/middleware/errorHandler';
import { CreateUserData, User } from '@/models/User';
import { UserRepository } from '@/repositories/UserRepository';

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

export class AuthService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  // Register new user
  async register(userData: CreateUserData): Promise<SimpleAuthResponse> {
    // Check if user already exists
    const existingUser = await this.userRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new ConflictError('User with this email already exists');
    }

    // Create user
    const user = await this.userRepository.create(userData);

    return this.generateSimpleSession(user);
  }

  // Login user
  async login(credentials: LoginCredentials): Promise<SimpleAuthResponse> {
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

    return this.generateSimpleSession(user);
  }

  // No refresh token in simplified flow
  async refreshToken(): Promise<never> {
    throw new AuthenticationError('Refresh token not supported');
  }

  // Logout user
  async logout(): Promise<void> {}

  // Logout from all devices
  async logoutAll(): Promise<void> {}

  // Verify access token
  async verifyAccessToken(token: string): Promise<TokenPayload> {
    // Simplified: expect token to be the userId
    const user = await this.userRepository.findById(token);
    if (!user || !user.is_active) {
      throw new AuthenticationError('User not found or inactive');
    }
    return { userId: user.id, email: user.email };
  }

  // Change password
  async changePassword(
    userId: string,
    _currentPassword: string,
    newPassword: string
  ): Promise<void> {
    // Simplified: directly set new password
    await this.userRepository.updatePassword(userId, newPassword);
  }

  // Generate simple session token (userId-as-token)
  private async generateSimpleSession(user: User): Promise<SimpleAuthResponse> {
    const { password_hash, ...userWithoutPassword } = user;
    return {
      sessionToken: user.id,
      user: userWithoutPassword,
    };
  }

  // No password strength rules in simplified flow
  private validatePassword(_password: string): void {}

  // Not used in simplified flow
  private parseTimeToMs(_timeString: string): number {
    return 0;
  }

  // Not used in simplified flow
  async cleanExpiredTokens(): Promise<number> {
    return 0;
  }
}
