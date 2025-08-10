import type { UserProfile } from '@/services/types';
import type { User } from '@/types';

export function userProfileToUser(userProfile: UserProfile): User {
  return {
    id: 'temp-id', // In real implementation, this would come from the API
    name: userProfile.name,
    email: userProfile.email,
    avatar: userProfile.avatar,
    phone: userProfile.phone,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export function userToUserProfile(user: User): UserProfile {
  return {
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    phone: user.phone,
  };
}
