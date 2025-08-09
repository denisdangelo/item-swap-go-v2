import { CreateUserData, UpdateUserData, User, UserProfile } from '@/models/User';
import { BaseRepository } from './BaseRepository';
export declare class UserRepository extends BaseRepository<User, CreateUserData, UpdateUserData> {
    protected tableName: string;
    protected selectFields: string;
    create(data: CreateUserData): Promise<User>;
    findByEmail(email: string): Promise<User | null>;
    verifyPassword(user: User, password: string): Promise<boolean>;
    updatePassword(id: string, newPassword: string): Promise<boolean>;
    getProfile(id: string): Promise<UserProfile | null>;
    findByLocation(lat: number, lng: number, radiusKm?: number): Promise<User[]>;
    searchByName(searchTerm: string): Promise<User[]>;
    getUserStats(id: string): Promise<{
        items_count: number;
        active_loans_count: number;
        completed_loans_count: number;
        reviews_count: number;
        average_rating: number;
    }>;
    verifyEmail(id: string): Promise<boolean>;
    deactivate(id: string): Promise<boolean>;
    activate(id: string): Promise<boolean>;
}
