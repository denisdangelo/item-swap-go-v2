import { useAuthStore } from '@/store/authStore';

export const useAuth = () => {
  const {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    refreshUser,
    changePassword,
    updateProfile,
    updateLocation,
    uploadAvatar,
    checkEmailAvailability,
    setLoading,
    setError,
    clearError,
    reset,
  } = useAuthStore();

  // Mock data for missing properties
  const isVerified = user ? true : false;

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    isVerified,
    login,
    register,
    logout,
    refreshUser,
    changePassword,
    updateProfile,
    updateLocation,
    uploadAvatar,
    checkEmailAvailability,
    setLoading,
    setError,
    clearError,
    reset,
  };
};
