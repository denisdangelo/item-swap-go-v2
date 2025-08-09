import { Category, CategoryWithItemCount, CreateCategoryData, UpdateCategoryData } from '@/models/Category';
import { BaseRepository } from './BaseRepository';
export declare class CategoryRepository extends BaseRepository<Category, CreateCategoryData, UpdateCategoryData> {
    protected tableName: string;
    protected selectFields: string;
    findByName(name: string): Promise<Category | null>;
    findActive(): Promise<Category[]>;
    findWithItemCount(): Promise<CategoryWithItemCount[]>;
    findPopular(limit?: number): Promise<CategoryWithItemCount[]>;
    searchByName(searchTerm: string): Promise<Category[]>;
    isInUse(id: string): Promise<boolean>;
    getCategoryStats(id: string): Promise<{
        items_count: number;
        active_items_count: number;
        total_loans_count: number;
    }>;
}
