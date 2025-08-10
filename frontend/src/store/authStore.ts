import {
  authApiService,
  usersApiService,
  type ChangePasswordData,
  type LoginData,
  type RegisterData,
  type UserProfile,
} from '@/services/api/index';
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
  checkEmailAvailability: (email: string) => Promise<{ success: boolean; available?: boolean }>;

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
          console.debug('[authStore] login() -> calling API with', { email: data.email });
          const result = await authApiService.login(data);
          console.debug('[authStore] login() -> success, received user id', (result as any)?.user?.id);
          set({
            user: (result as any).user as UserProfile,
            isAuthenticated: true,
            isLoading: false,
          });
          return { success: true };
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Login failed';
          console.error('[authStore] login() -> error', errorMessage);
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
          console.debug('[authStore] register() -> calling API with', { email: data.email });
          const result = await authApiService.register(data);
          console.debug('[authStore] register() -> success, received user id', (result as any)?.user?.id);
          set({
            user: (result as any).user as UserProfile,
            isAuthenticated: true,
            isLoading: false,
          });
          return { success: true };
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Registration failed';
          console.error('[authStore] register() -> error', errorMessage);
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
          console.debug('[authStore] logout() -> calling API');
          await authApiService.logout();
        } catch (error) {
          console.error('Logout error:', error);
        } finally {
          console.debug('[authStore] logout() -> clearing state');
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
          const profile = await authApiService.getCurrentUser();
          set({ user: profile as any, isLoading: false });
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
          console.debug('[authStore] updateProfile() -> calling API');
          const updatedUser = await usersApiService.updateProfile(data);
          set({ user: updatedUser as any, isLoading: false });
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
          console.debug('[authStore] updateLocation() -> calling API');
          const updated = await usersApiService.updateLocation({
            lat: _location.lat,
            lng: _location.lng,
            address: _location.address,
          });
          set({ user: updated as any, isLoading: false });
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
          console.debug('[authStore] uploadAvatar() -> calling API');
          const profile = await usersApiService.uploadAvatar(_file);
          set({ user: profile as any, isLoading: false });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to upload avatar';
          set({ error: errorMessage, isLoading: false });
          throw error;
        }
      },

      // Check email availability
      checkEmailAvailability: async (email: string) => {
        try {
          console.debug('[authStore] checkEmailAvailability() ->', email);
          const available = await authApiService.checkEmailAvailability(email);
          return { success: true, available };
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to check email';
          console.warn('[authStore] checkEmailAvailability() -> error', errorMessage);
          return { success: false };
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
        try {
          const accessToken = localStorage.getItem('accessToken');
          const storedUser = localStorage.getItem('user');
          
          if (accessToken && storedUser) {
            const parsedUser = JSON.parse(storedUser);
            set({ user: parsedUser as any, isAuthenticated: true });
            // Fire and forget refresh
            get().refreshUser().catch((err) =>
              console.warn('[authStore] initialize() -> refreshUser failed', err)
            );
          } else {
            set({ user: null, isAuthenticated: false });
          }
        } catch (e) {
          console.warn('[authStore] initialize() -> failed to parse stored user');
          set({ user: null, isAuthenticated: false });
        }
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
