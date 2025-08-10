import { ConflictError, NotFoundError, ValidationError } from '@/middleware/errorHandler';
import { UpdateUserData, User, UserLocation, UserProfile } from '@/models/User';
import { UserRepository } from '@/repositories/UserRepository';

export interface UserSearchOptions {
  search?: string;
  location?: UserLocation;
  radius?: number;
}

export class UserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  // Get user profile
  async getProfile(userId: string): Promise<UserProfile> {
    const profile = await this.userRepository.getProfile(userId);
    if (!profile) {
      throw new NotFoundError('User not found');
    }
    return profile;
  }

  // Update user profile
  async updateProfile(userId: string, updateData: UpdateUserData): Promise<UserProfile> {
    // Check if user exists
    const existingUser = await this.userRepository.findById(userId);
    if (!existingUser) {
      throw new NotFoundError('User not found');
    }

    // Validate location data
    if (updateData.location_lat !== undefined || updateData.location_lng !== undefined) {
      this.validateLocation(updateData.location_lat, updateData.location_lng);
    }

    // Update user
    await this.userRepository.update(userId, updateData);

    // Return updated profile
    const updatedProfile = await this.userRepository.getProfile(userId);
    if (!updatedProfile) {
      throw new NotFoundError('Failed to retrieve updated profile');
    }

    return updatedProfile;
  }

  // Update user location
  async updateLocation(userId: string, location: UserLocation): Promise<UserProfile> {
    this.validateLocation(location.lat, location.lng);

    const updateData: UpdateUserData = {
      location_lat: location.lat,
      location_lng: location.lng,
      location_address: location.address,
    };

    return this.updateProfile(userId, updateData);
  }

  // Upload user avatar
  async updateAvatar(userId: string, avatarUrl: string): Promise<UserProfile> {
    if (!avatarUrl || avatarUrl.trim() === '') {
      throw new ValidationError('Avatar URL is required');
    }

    return this.updateProfile(userId, { avatar_url: avatarUrl });
  }

  // Get user by ID
  async getUserById(userId: string): Promise<User> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }
    return user;
  }

  // Search users
  async searchUsers(options: UserSearchOptions): Promise<User[]> {
    if (options.search) {
      return this.userRepository.searchByName(options.search);
    }

    if (options.location) {
      const radius = options.radius || 10; // Default 10km radius
      return this.userRepository.findByLocation(options.location.lat, options.location.lng, radius);
    }

    return [];
  }

  // Get users near location
  async getUsersNearLocation(lat: number, lng: number, radiusKm: number = 10): Promise<User[]> {
    this.validateLocation(lat, lng);
    return this.userRepository.findByLocation(lat, lng, radiusKm);
  }

  // Get user statistics
  async getUserStats(userId: string): Promise<{
    items_count: number;
    active_loans_count: number;
    completed_loans_count: number;
    reviews_count: number;
    average_rating: number;
  }> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    return this.userRepository.getUserStats(userId);
  }

  // Verify user email
  async verifyEmail(userId: string): Promise<void> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    if (user.is_verified) {
      throw new ConflictError('Email is already verified');
    }

    const success = await this.userRepository.verifyEmail(userId);
    if (!success) {
      throw new Error('Failed to verify email');
    }
  }

  // Deactivate user account
  async deactivateAccount(userId: string): Promise<void> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    if (!user.is_active) {
      throw new ConflictError('Account is already deactivated');
    }

    const success = await this.userRepository.deactivate(userId);
    if (!success) {
      throw new Error('Failed to deactivate account');
    }
  }

  // Activate user account
  async activateAccount(userId: string): Promise<void> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    if (user.is_active) {
      throw new ConflictError('Account is already active');
    }

    const success = await this.userRepository.activate(userId);
    if (!success) {
      throw new Error('Failed to activate account');
    }
  }

  // Delete user account (soft delete)
  async deleteAccount(userId: string): Promise<void> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    // Soft delete by deactivating
    await this.deactivateAccount(userId);
  }

  // Check if email is available
  async isEmailAvailable(email: string): Promise<boolean> {
    const user = await this.userRepository.findByEmail(email);
    return !user;
  }

  // Validate location coordinates
  private validateLocation(lat?: number, lng?: number): void {
    if (lat !== undefined && (lat < -90 || lat > 90)) {
      throw new ValidationError('Latitude must be between -90 and 90');
    }

    if (lng !== undefined && (lng < -180 || lng > 180)) {
      throw new ValidationError('Longitude must be between -180 and 180');
    }

    if ((lat !== undefined && lng === undefined) || (lat === undefined && lng !== undefined)) {
      throw new ValidationError('Both latitude and longitude must be provided');
    }
  }
}
