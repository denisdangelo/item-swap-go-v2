import { apiService } from './ApiService';

export interface Category {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CategoryWithItemCount extends Category {
  items_count: number;
}

export interface CreateCategoryData {
  name: string;
  description?: string;
  icon?: string;
  color?: string;
}

export interface UpdateCategoryData {
  name?: string;
  description?: string;
  icon?: string;
  color?: string;
  is_active?: boolean;
}

export interface CategoryStats {
  items_count: number;
  active_items_count: number;
  total_loans_count: number;
}

export class CategoriesApiService {
  // Get all categories
  async getAllCategories(includeInactive: boolean = false): Promise<Category[]> {
    const params = includeInactive ? { include_inactive: 'true' } : {};
    const response = await apiService.get<Category[]>('/categories', { params });

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error('Failed to get categories');
  }

  // Get active categories only
  async getActiveCategories(): Promise<Category[]> {
    return this.getAllCategories(false);
  }

  // Get categories with item count
  async getCategoriesWithItemCount(): Promise<CategoryWithItemCount[]> {
    const response = await apiService.get<CategoryWithItemCount[]>('/categories/with-count');

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error('Failed to get categories with item count');
  }

  // Get popular categories
  async getPopularCategories(limit: number = 10): Promise<CategoryWithItemCount[]> {
    const params = { limit };
    const response = await apiService.get<CategoryWithItemCount[]>('/categories/popular', {
      params,
    });

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error('Failed to get popular categories');
  }

  // Get category by ID
  async getCategoryById(id: string): Promise<Category> {
    const response = await apiService.get<Category>(`/categories/${id}`);

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error('Failed to get category');
  }

  // Create new category (admin only)
  async createCategory(data: CreateCategoryData): Promise<Category> {
    const response = await apiService.post<Category>('/categories', data);

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error('Failed to create category');
  }

  // Update category (admin only)
  async updateCategory(id: string, data: UpdateCategoryData): Promise<Category> {
    const response = await apiService.put<Category>(`/categories/${id}`, data);

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error('Failed to update category');
  }

  // Delete category (admin only)
  async deleteCategory(id: string): Promise<void> {
    const response = await apiService.delete(`/categories/${id}`);

    if (!response.success) {
      throw new Error('Failed to delete category');
    }
  }

  // Deactivate category (admin only)
  async deactivateCategory(id: string): Promise<Category> {
    const response = await apiService.post<Category>(`/categories/${id}/deactivate`);

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error('Failed to deactivate category');
  }

  // Activate category (admin only)
  async activateCategory(id: string): Promise<Category> {
    const response = await apiService.post<Category>(`/categories/${id}/activate`);

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error('Failed to activate category');
  }

  // Search categories by name
  async searchCategories(searchTerm: string): Promise<Category[]> {
    const params = { q: searchTerm };
    const response = await apiService.get<Category[]>('/categories/search', { params });

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error('Failed to search categories');
  }

  // Get category statistics
  async getCategoryStats(id: string): Promise<CategoryStats> {
    const response = await apiService.get<CategoryStats>(`/categories/${id}/stats`);

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error('Failed to get category statistics');
  }

  // Get categories for dropdown/select (cached)
  private categoriesCache: Category[] | null = null;
  private cacheTimestamp: number = 0;
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  async getCategoriesForSelect(): Promise<Category[]> {
    const now = Date.now();

    // Return cached data if still valid
    if (this.categoriesCache && now - this.cacheTimestamp < this.CACHE_DURATION) {
      return this.categoriesCache;
    }

    // Fetch fresh data
    try {
      const categories = await this.getActiveCategories();
      this.categoriesCache = categories;
      this.cacheTimestamp = now;
      return categories;
    } catch (error) {
      // Return cached data if available, even if expired
      if (this.categoriesCache) {
        return this.categoriesCache;
      }
      throw error;
    }
  }

  // Clear categories cache
  clearCache(): void {
    this.categoriesCache = null;
    this.cacheTimestamp = 0;
  }

  // Get category by name (for filtering)
  async getCategoryByName(name: string): Promise<Category | null> {
    try {
      const categories = await this.getActiveCategories();
      return categories.find((cat) => cat.name.toLowerCase() === name.toLowerCase()) || null;
    } catch {
      return null;
    }
  }

  // Get category color by ID (for UI theming)
  async getCategoryColor(id: string): Promise<string> {
    try {
      const category = await this.getCategoryById(id);
      return category.color || '#6B7280'; // Default gray color
    } catch {
      return '#6B7280';
    }
  }

  // Get category icon by ID (for UI display)
  async getCategoryIcon(id: string): Promise<string> {
    try {
      const category = await this.getCategoryById(id);
      return category.icon || 'folder'; // Default folder icon
    } catch {
      return 'folder';
    }
  }
}

// Export singleton instance
export const categoriesApiService = new CategoriesApiService();
