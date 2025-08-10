import { useAuthStore } from '@/store/authStore';
import { useMemo } from 'react';
import type { User } from '@/types';

// Função para adaptar UserProfile do backend para User do frontend
const adaptUserProfile = (userProfile: any): User | null => {
  if (!userProfile) return null;
  
  return {
    id: userProfile.id,
    name: userProfile.full_name || `${userProfile.first_name || ''} ${userProfile.last_name || ''}`.trim() || userProfile.email,
    email: userProfile.email,
    avatar: userProfile.avatar_url,
    phone: userProfile.phone,
    rating: userProfile.average_rating,
    location: userProfile.location_lat && userProfile.location_lng ? {
      latitude: userProfile.location_lat,
      longitude: userProfile.location_lng,
      address: userProfile.location_address || '',
    } : undefined,
    createdAt: userProfile.created_at,
    updatedAt: userProfile.updated_at,
  };
};

export const useAuth = () => {
  const {
    user: userProfile,
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

  // Adaptar o userProfile para o formato esperado pelo frontend - memoizado
  const user = useMemo(() => adaptUserProfile(userProfile), [userProfile]);
  const isVerified = userProfile ? userProfile.is_verified : false;

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
