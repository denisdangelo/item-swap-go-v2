import {
  authApiService,
  type ChangePasswordData,
  type LoginData,
  type RegisterData,
  type UserProfile,
} from '@/services/api';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface AuthState {
  // User data
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (data: LoginData) => Promise<{ success: boolean; error?: string }>;
  register: (data: RegisterData) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  changePassword: (data: ChangePasswordData) => Promise<void>;
  updateProfile: (data: any) => Promise<void>;
  updateLocation: (location: { lat: number; lng: number; address?: string }) => Promise<void>;
  uploadAvatar: (file: File) => Promise<void>;

  // Utility actions
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  reset: () => void;

  // Initialize from stored data
  initialize: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Login action
      login: async (data: LoginData) => {
        set({ isLoading: true, error: null });

        try {
          const result = await authApiService.login(data);
          set({
            user: (result as any).user as UserProfile,
            isAuthenticated: true,
            isLoading: false,
          });
          return { success: true };
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Login failed';
          set({
            error: errorMessage,
            isLoading: false,
            isAuthenticated: false,
            user: null,
          });
          return { success: false, error: errorMessage };
        }
      },

      // Register action
      register: async (data: RegisterData) => {
        set({ isLoading: true, error: null });

        try {
          const result = await authApiService.register(data);
          set({
            user: (result as any).user as UserProfile,
            isAuthenticated: true,
            isLoading: false,
          });
          return { success: true };
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Registration failed';
          set({
            error: errorMessage,
            isLoading: false,
            isAuthenticated: false,
            user: null,
          });
          return { success: false, error: errorMessage };
        }
      },

      // Logout action
      logout: async () => {
        set({ isLoading: true });

        try {
          await authApiService.logout();
        } catch (error) {
          console.error('Logout error:', error);
        } finally {
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
        }
      },

      // Refresh user data
      refreshUser: async () => {
        if (!get().isAuthenticated) return;

        set({ isLoading: true, error: null });

        try {
          // Mock refresh - in real implementation would call API
          set({ isLoading: false });
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : 'Failed to refresh user data';
          set({ error: errorMessage, isLoading: false });

          // If refresh fails due to auth error, logout
          if (error instanceof Error && error.message.includes('401')) {
            get().logout();
          }
        }
      },

      // Change password
      changePassword: async (data: ChangePasswordData) => {
        set({ isLoading: true, error: null });

        try {
          await authApiService.changePassword(data);
          set({ isLoading: false });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to change password';
          set({ error: errorMessage, isLoading: false });
          throw error;
        }
      },

      // Update profile
      updateProfile: async (data: any) => {
        set({ isLoading: true, error: null });

        try {
          // Mock update - in real implementation would call API
          const updatedUser = get().user;
          set({ user: updatedUser, isLoading: false });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to update profile';
          set({ error: errorMessage, isLoading: false });
          throw error;
        }
      },

      // Update location
      updateLocation: async (_location: { lat: number; lng: number; address?: string }) => {
        set({ isLoading: true, error: null });

        try {
          // This would call the users API service
          // For now, we'll just refresh the user data
          await get().refreshUser();
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to update location';
          set({ error: errorMessage, isLoading: false });
          throw error;
        }
      },

      // Upload avatar
      uploadAvatar: async (_file: File) => {
        set({ isLoading: true, error: null });

        try {
          // This would call the users API service
          // For now, we'll just refresh the user data
          await get().refreshUser();
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to upload avatar';
          set({ error: errorMessage, isLoading: false });
          throw error;
        }
      },

      // Utility actions
      setLoading: (loading: boolean) => set({ isLoading: loading }),

      setError: (error: string | null) => set({ error }),

      clearError: () => set({ error: null }),

      reset: () =>
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        }),

      // Initialize from stored data
      initialize: () => {
        // Mock initialization - in real implementation would check stored tokens
        set({
          user: null,
          isAuthenticated: false,
        });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// Initialize auth store on app start
if (typeof window !== 'undefined') {
  useAuthStore.getState().initialize();
}
