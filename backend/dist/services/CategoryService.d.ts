import { Category, CategoryWithItemCount, CreateCategoryData, UpdateCategoryData } from '@/models/Category';
export declare class CategoryService {
    private categoryRepository;
    constructor();
    getAllCategories(): Promise<Category[]>;
    getActiveCategories(): Promise<Category[]>;
    getCategoriesWithItemCount(): Promise<CategoryWithItemCount[]>;
    getPopularCategories(limit?: number): Promise<CategoryWithItemCount[]>;
    getCategoryById(id: string): Promise<Category>;
    createCategory(categoryData: CreateCategoryData): Promise<Category>;
    updateCategory(id: string, updateData: UpdateCategoryData): Promise<Category>;
    deleteCategory(id: string): Promise<void>;
    deactivateCategory(id: string): Promise<Category>;
    activateCategory(id: string): Promise<Category>;
    searchCategories(searchTerm: string): Promise<Category[]>;
    getCategoryStats(id: string): Promise<{
        items_count: number;
        active_items_count: number;
        total_loans_count: number;
    }>;
    private validateCategoryData;
}
