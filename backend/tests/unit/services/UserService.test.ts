import { NotFoundError, ValidationError } from '@/middleware/errorHandler';
import { UserRepository } from '@/repositories/UserRepository';
import { UserService } from '@/services/UserService';
import { cleanupDatabase } from '../../helpers/testHelpers';

jest.mock('@/repositories/UserRepository');

describe('UserService', () => {
  let userService: UserService;
  let mockUserRepo: jest.Mocked<UserRepository>;

  beforeEach(() => {
    userService = new UserService();
    mockUserRepo = new UserRepository() as jest.Mocked<UserRepository>;
    jest.clearAllMocks();
  });

  afterEach(async () => {
    await cleanupDatabase();
  });

  describe('getProfile', () => {
    it('should return user profile successfully', async () => {
      const mockProfile = {
        id: 'user-id',
        email: 'test@example.com',
        first_name: 'Test',
        last_name: 'User',
        full_name: 'Test User',
        items_count: 5,
        reviews_count: 3,
        average_rating: 4.5,
      };

      mockUserRepo.getProfile.mockResolvedValue(mockProfile as any);

      const result = await userService.getProfile('user-id');

      expect(result).toEqual(mockProfile);
      expect(mockUserRepo.getProfile).toHaveBeenCalledWith('user-id');
    });

    it('should throw NotFoundError if user not found', async () => {
      mockUserRepo.getProfile.mockResolvedValue(null);

      await expect(userService.getProfile('non-existent-id')).rejects.toThrow(NotFoundError);
    });
  });

  describe('updateProfile', () => {
    const updateData = {
      first_name: 'Updated',
      last_name: 'Name',
      bio: 'Updated bio',
    };

    it('should update user profile successfully', async () => {
      const mockUser = { id: 'user-id', email: 'test@example.com' };
      const mockUpdatedProfile = { ...mockUser, ...updateData };

      mockUserRepo.findById.mockResolvedValue(mockUser as any);
      mockUserRepo.update.mockResolvedValue({} as any);
      mockUserRepo.getProfile.mockResolvedValue(mockUpdatedProfile as any);

      const result = await userService.updateProfile('user-id', updateData);

      expect(result).toEqual(mockUpdatedProfile);
      expect(mockUserRepo.findById).toHaveBeenCalledWith('user-id');
      expect(mockUserRepo.update).toHaveBeenCalledWith('user-id', updateData);
      expect(mockUserRepo.getProfile).toHaveBeenCalledWith('user-id');
    });

    it('should throw NotFoundError if user not found', async () => {
      mockUserRepo.findById.mockResolvedValue(null);

      await expect(userService.updateProfile('non-existent-id', updateData)).rejects.toThrow(
        NotFoundError
      );
      expect(mockUserRepo.update).not.toHaveBeenCalled();
    });
  });

  describe('updateLocation', () => {
    const locationData = {
      lat: -23.5505,
      lng: -46.6333,
      address: 'São Paulo, SP',
    };

    it('should update user location successfully', async () => {
      const mockUser = { id: 'user-id', email: 'test@example.com' };
      const mockUpdatedProfile = { ...mockUser, ...locationData };

      mockUserRepo.findById.mockResolvedValue(mockUser as any);
      mockUserRepo.update.mockResolvedValue({} as any);
      mockUserRepo.getProfile.mockResolvedValue(mockUpdatedProfile as any);

      const result = await userService.updateLocation('user-id', locationData);

      expect(result).toEqual(mockUpdatedProfile);
      expect(mockUserRepo.update).toHaveBeenCalledWith('user-id', {
        location_lat: locationData.lat,
        location_lng: locationData.lng,
        location_address: locationData.address,
      });
    });

    it('should throw ValidationError for invalid coordinates', async () => {
      const invalidLocation = { lat: 100, lng: 200 }; // Invalid coordinates

      await expect(userService.updateLocation('user-id', invalidLocation)).rejects.toThrow(
        ValidationError
      );
      expect(mockUserRepo.findById).not.toHaveBeenCalled();
    });
  });

  describe('getUsersNearLocation', () => {
    it('should return nearby users successfully', async () => {
      const mockUsers = [
        { id: 'user-1', first_name: 'User', last_name: 'One' },
        { id: 'user-2', first_name: 'User', last_name: 'Two' },
      ];

      mockUserRepo.findByLocation.mockResolvedValue(mockUsers as any);

      const result = await userService.getUsersNearLocation(-23.5505, -46.6333, 10);

      expect(result).toEqual(mockUsers);
      expect(mockUserRepo.findByLocation).toHaveBeenCalledWith(-23.5505, -46.6333, 10);
    });

    it('should throw ValidationError for invalid coordinates', async () => {
      await expect(userService.getUsersNearLocation(100, 200)).rejects.toThrow(ValidationError);
      expect(mockUserRepo.findByLocation).not.toHaveBeenCalled();
    });
  });

  describe('isEmailAvailable', () => {
    it('should return true if email is available', async () => {
      mockUserRepo.findByEmail.mockResolvedValue(null);

      const result = await userService.isEmailAvailable('new@example.com');

      expect(result).toBe(true);
      expect(mockUserRepo.findByEmail).toHaveBeenCalledWith('new@example.com');
    });

    it('should return false if email is taken', async () => {
      mockUserRepo.findByEmail.mockResolvedValue({} as any);

      const result = await userService.isEmailAvailable('taken@example.com');

      expect(result).toBe(false);
      expect(mockUserRepo.findByEmail).toHaveBeenCalledWith('taken@example.com');
    });
  });
});
