import { AuthenticationError, ConflictError, ValidationError } from '@/middleware/errorHandler';
import { RefreshTokenRepository } from '@/repositories/RefreshTokenRepository';
import { UserRepository } from '@/repositories/UserRepository';
import { AuthService } from '@/services/AuthService';
import { cleanupDatabase } from '../../helpers/testHelpers';

// Mock repositories
jest.mock('@/repositories/UserRepository');
jest.mock('@/repositories/RefreshTokenRepository');

describe('AuthService', () => {
  let authService: AuthService;
  let mockUserRepo: jest.Mocked<UserRepository>;
  let mockRefreshTokenRepo: jest.Mocked<RefreshTokenRepository>;

  beforeEach(() => {
    authService = new AuthService();
    mockUserRepo = new UserRepository() as jest.Mocked<UserRepository>;
    mockRefreshTokenRepo = new RefreshTokenRepository() as jest.Mocked<RefreshTokenRepository>;

    // Reset mocks
    jest.clearAllMocks();
  });

  afterEach(async () => {
    await cleanupDatabase();
  });

  describe('register', () => {
    const validUserData = {
      email: 'test@example.com',
      password: 'TestPassword123!',
      first_name: 'Test',
      last_name: 'User',
    };

    it('should register a new user successfully', async () => {
      // Mock repository methods
      mockUserRepo.findByEmail.mockResolvedValue(null);
      mockUserRepo.create.mockResolvedValue({
        id: 'user-id',
        email: validUserData.email,
        first_name: validUserData.first_name,
        last_name: validUserData.last_name,
        is_active: true,
        is_verified: false,
        created_at: new Date(),
        updated_at: new Date(),
      } as any);

      mockRefreshTokenRepo.create.mockResolvedValue({} as any);

      const result = await authService.register(validUserData);

      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
      expect(result).toHaveProperty('user');
      expect(result.user.email).toBe(validUserData.email);
      expect(mockUserRepo.findByEmail).toHaveBeenCalledWith(validUserData.email);
      expect(mockUserRepo.create).toHaveBeenCalled();
    });

    it('should throw ConflictError if user already exists', async () => {
      mockUserRepo.findByEmail.mockResolvedValue({} as any);

      await expect(authService.register(validUserData)).rejects.toThrow(ConflictError);
      expect(mockUserRepo.create).not.toHaveBeenCalled();
    });

    it('should throw ValidationError for weak password', async () => {
      const weakPasswordData = { ...validUserData, password: '123' };
      mockUserRepo.findByEmail.mockResolvedValue(null);

      await expect(authService.register(weakPasswordData)).rejects.toThrow(ValidationError);
      expect(mockUserRepo.create).not.toHaveBeenCalled();
    });
  });

  describe('login', () => {
    const loginCredentials = {
      email: 'test@example.com',
      password: 'TestPassword123!',
    };

    it('should login user successfully', async () => {
      const mockUser = {
        id: 'user-id',
        email: loginCredentials.email,
        is_active: true,
      };

      mockUserRepo.findByEmail.mockResolvedValue(mockUser as any);
      mockUserRepo.verifyPassword.mockResolvedValue(true);
      mockRefreshTokenRepo.create.mockResolvedValue({} as any);

      const result = await authService.login(loginCredentials);

      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
      expect(result).toHaveProperty('user');
      expect(mockUserRepo.findByEmail).toHaveBeenCalledWith(loginCredentials.email);
      expect(mockUserRepo.verifyPassword).toHaveBeenCalledWith(mockUser, loginCredentials.password);
    });

    it('should throw AuthenticationError for invalid email', async () => {
      mockUserRepo.findByEmail.mockResolvedValue(null);

      await expect(authService.login(loginCredentials)).rejects.toThrow(AuthenticationError);
      expect(mockUserRepo.verifyPassword).not.toHaveBeenCalled();
    });

    it('should throw AuthenticationError for invalid password', async () => {
      const mockUser = { id: 'user-id', email: loginCredentials.email, is_active: true };
      mockUserRepo.findByEmail.mockResolvedValue(mockUser as any);
      mockUserRepo.verifyPassword.mockResolvedValue(false);

      await expect(authService.login(loginCredentials)).rejects.toThrow(AuthenticationError);
    });

    it('should throw AuthenticationError for inactive user', async () => {
      const mockUser = { id: 'user-id', email: loginCredentials.email, is_active: false };
      mockUserRepo.findByEmail.mockResolvedValue(mockUser as any);

      await expect(authService.login(loginCredentials)).rejects.toThrow(AuthenticationError);
      expect(mockUserRepo.verifyPassword).not.toHaveBeenCalled();
    });
  });

  describe('verifyAccessToken', () => {
    it('should verify valid token successfully', async () => {
      const mockUser = { id: 'user-id', email: 'test@example.com', is_active: true };
      mockUserRepo.findById.mockResolvedValue(mockUser as any);

      // Mock JWT verification
      const jwt = require('jsonwebtoken');
      jest.spyOn(jwt, 'verify').mockReturnValue({
        userId: 'user-id',
        email: 'test@example.com',
        iat: Date.now(),
        exp: Date.now() + 3600,
      });

      const result = await authService.verifyAccessToken('valid-token');

      expect(result).toHaveProperty('userId', 'user-id');
      expect(result).toHaveProperty('email', 'test@example.com');
      expect(mockUserRepo.findById).toHaveBeenCalledWith('user-id');
    });

    it('should throw AuthenticationError for invalid token', async () => {
      const jwt = require('jsonwebtoken');
      jest.spyOn(jwt, 'verify').mockImplementation(() => {
        throw new jwt.JsonWebTokenError('Invalid token');
      });

      await expect(authService.verifyAccessToken('invalid-token')).rejects.toThrow(
        AuthenticationError
      );
    });

    it('should throw AuthenticationError for inactive user', async () => {
      const mockUser = { id: 'user-id', email: 'test@example.com', is_active: false };
      mockUserRepo.findById.mockResolvedValue(mockUser as any);

      const jwt = require('jsonwebtoken');
      jest.spyOn(jwt, 'verify').mockReturnValue({
        userId: 'user-id',
        email: 'test@example.com',
      });

      await expect(authService.verifyAccessToken('valid-token')).rejects.toThrow(
        AuthenticationError
      );
    });
  });
});
