import { apiService } from './ApiService';
import { User, UserProfile } from './AuthApiService';

export interface UpdateUserData {
  first_name?: string;
  last_name?: string;
  phone?: string;
  bio?: string;
  location_lat?: number;
  location_lng?: number;
  location_address?: string;
}

export interface UserLocation {
  lat: number;
  lng: number;
  address?: string;
}

export interface UserStats {
  items_count: number;
  active_loans_count: number;
  completed_loans_count: number;
  reviews_count: number;
  average_rating: number;
}

export interface UserSearchOptions {
  search?: string;
  lat?: number;
  lng?: number;
  radius?: number;
}

export class UsersApiService {
  // Get user profile by ID
  async getUserProfile(userId: string): Promise<UserProfile> {
    const response = await apiService.get<UserProfile>(`/users/${userId}`);

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error('Failed to get user profile');
  }

  // Update current user profile
  async updateProfile(data: UpdateUserData): Promise<UserProfile> {
    const response = await apiService.put<UserProfile>('/users/profile', data);

    if (response.success && response.data) {
      // Update stored user data
      localStorage.setItem('user', JSON.stringify(response.data));
      return response.data;
    }

    throw new Error('Failed to update profile');
  }

  // Update user location
  async updateLocation(location: UserLocation): Promise<UserProfile> {
    const response = await apiService.put<UserProfile>('/users/location', location);

    if (response.success && response.data) {
      // Update stored user data
      localStorage.setItem('user', JSON.stringify(response.data));
      return response.data;
    }

    throw new Error('Failed to update location');
  }

  // Upload user avatar
  async uploadAvatar(file: File, onProgress?: (progress: number) => void): Promise<UserProfile> {
    const formData = new FormData();
    formData.append('avatar', file);

    const response = await apiService.upload<{ avatar: any; profile: UserProfile }>(
      '/upload/avatar',
      formData,
      onProgress
    );

    if (response.success && response.data) {
      // Update stored user data
      localStorage.setItem('user', JSON.stringify(response.data.profile));
      return response.data.profile;
    }

    throw new Error('Failed to upload avatar');
  }

  // Search users
  async searchUsers(options: UserSearchOptions): Promise<User[]> {
    const params = new URLSearchParams();

    Object.entries(options).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value.toString());
      }
    });

    const response = await apiService.get<User[]>('/users/search', { params });

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error('Failed to search users');
  }

  // Get nearby users
  async getNearbyUsers(lat: number, lng: number, radius: number = 10): Promise<User[]> {
    const params = { lat, lng, radius };
    const response = await apiService.get<User[]>('/users/nearby', { params });

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error('Failed to get nearby users');
  }

  // Get user statistics
  async getUserStats(userId?: string): Promise<UserStats> {
    const url = userId ? `/users/${userId}/stats` : '/users/stats';
    const response = await apiService.get<UserStats>(url);

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error('Failed to get user statistics');
  }

  // Verify user email
  async verifyEmail(): Promise<void> {
    const response = await apiService.post('/users/verify-email');

    if (!response.success) {
      throw new Error('Failed to verify email');
    }
  }

  // Deactivate account
  async deactivateAccount(): Promise<void> {
    const response = await apiService.post('/users/deactivate');

    if (!response.success) {
      throw new Error('Failed to deactivate account');
    }

    // Clear auth data since account is deactivated
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  }

  // Delete account
  async deleteAccount(): Promise<void> {
    const response = await apiService.delete('/users/account');

    if (!response.success) {
      throw new Error('Failed to delete account');
    }

    // Clear auth data since account is deleted
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  }

  // Get current user profile (from auth context)
  async getCurrentUserProfile(): Promise<UserProfile> {
    const response = await apiService.get<UserProfile>('/auth/me');

    if (response.success && response.data) {
      // Update stored user data
      localStorage.setItem('user', JSON.stringify(response.data));
      return response.data;
    }

    throw new Error('Failed to get current user profile');
  }

  // Get user's items
  async getUserItems(userId?: string): Promise<any[]> {
    const url = userId ? `/items/owner/${userId}` : '/items/owner/me';
    const response = await apiService.get<any[]>(url);

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error('Failed to get user items');
  }

  // Get user's reviews
  async getUserReviews(userId: string): Promise<any[]> {
    const response = await apiService.get<any[]>(`/reviews/user/${userId}`);

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error('Failed to get user reviews');
  }

  // Get user's loans
  async getUserLoans(): Promise<any[]> {
    const response = await apiService.get<any[]>('/loans/user/all');

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error('Failed to get user loans');
  }

  // Get user's messages/conversations
  async getUserConversations(): Promise<any[]> {
    const response = await apiService.get<any[]>('/messages/conversations/all');

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error('Failed to get user conversations');
  }

  // Get unread messages count
  async getUnreadMessagesCount(): Promise<number> {
    const response = await apiService.get<{ unread_count: number }>('/messages/unread/count');

    if (response.success && response.data) {
      return response.data.unread_count;
    }

    return 0;
  }
}

// Export singleton instance
export const usersApiService = new UsersApiService();
