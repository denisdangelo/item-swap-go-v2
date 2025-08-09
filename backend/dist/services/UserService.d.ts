import { UpdateUserData, User, UserLocation, UserProfile } from '@/models/User';
export interface UserSearchOptions {
    search?: string;
    location?: UserLocation;
    radius?: number;
}
export declare class UserService {
    private userRepository;
    constructor();
    getProfile(userId: string): Promise<UserProfile>;
    updateProfile(userId: string, updateData: UpdateUserData): Promise<UserProfile>;
    updateLocation(userId: string, location: UserLocation): Promise<UserProfile>;
    updateAvatar(userId: string, avatarUrl: string): Promise<UserProfile>;
    getUserById(userId: string): Promise<User>;
    searchUsers(options: UserSearchOptions): Promise<User[]>;
    getUsersNearLocation(lat: number, lng: number, radiusKm?: number): Promise<User[]>;
    getUserStats(userId: string): Promise<{
        items_count: number;
        active_loans_count: number;
        completed_loans_count: number;
        reviews_count: number;
        average_rating: number;
    }>;
    verifyEmail(userId: string): Promise<void>;
    deactivateAccount(userId: string): Promise<void>;
    activateAccount(userId: string): Promise<void>;
    deleteAccount(userId: string): Promise<void>;
    isEmailAvailable(email: string): Promise<boolean>;
    private validateLocation;
}
