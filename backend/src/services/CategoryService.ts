import { ConflictError, NotFoundError, ValidationError } from '@/middleware/errorHandler';
import {
  Category,
  CategoryWithItemCount,
  CreateCategoryData,
  UpdateCategoryData,
} from '@/models/Category';
import { CategoryRepository } from '@/repositories/CategoryRepository';

export class CategoryService {
  private categoryRepository: CategoryRepository;

  constructor() {
    this.categoryRepository = new CategoryRepository();
  }

  // Get all categories
  async getAllCategories(): Promise<Category[]> {
    return this.categoryRepository.findAll();
  }

  // Get active categories only
  async getActiveCategories(): Promise<Category[]> {
    return this.categoryRepository.findActive();
  }

  // Get categories with item count
  async getCategoriesWithItemCount(): Promise<CategoryWithItemCount[]> {
    return this.categoryRepository.findWithItemCount();
  }

  // Get popular categories
  async getPopularCategories(limit: number = 10): Promise<CategoryWithItemCount[]> {
    return this.categoryRepository.findPopular(limit);
  }

  // Get category by ID
  async getCategoryById(id: string): Promise<Category> {
    const category = await this.categoryRepository.findById(id);
    if (!category) {
      throw new NotFoundError('Category not found');
    }
    return category;
  }

  // Create new category
  async createCategory(categoryData: CreateCategoryData): Promise<Category> {
    // Check if category with same name already exists
    const existingCategory = await this.categoryRepository.findByName(categoryData.name);
    if (existingCategory) {
      throw new ConflictError('Category with this name already exists');
    }

    // Validate category data
    this.validateCategoryData(categoryData);

    return this.categoryRepository.create(categoryData);
  }

  // Update category
  async updateCategory(id: string, updateData: UpdateCategoryData): Promise<Category> {
    // Check if category exists
    const existingCategory = await this.categoryRepository.findById(id);
    if (!existingCategory) {
      throw new NotFoundError('Category not found');
    }

    // If updating name, check for conflicts
    if (updateData.name && updateData.name !== existingCategory.name) {
      const categoryWithSameName = await this.categoryRepository.findByName(updateData.name);
      if (categoryWithSameName) {
        throw new ConflictError('Category with this name already exists');
      }
    }

    // Validate update data
    if (updateData.name || updateData.description || updateData.icon || updateData.color) {
      this.validateCategoryData(updateData);
    }

    const updatedCategory = await this.categoryRepository.update(id, updateData);
    if (!updatedCategory) {
      throw new NotFoundError('Failed to update category');
    }

    return updatedCategory;
  }

  // Delete category
  async deleteCategory(id: string): Promise<void> {
    // Check if category exists
    const category = await this.categoryRepository.findById(id);
    if (!category) {
      throw new NotFoundError('Category not found');
    }

    // Check if category is being used by items
    const isInUse = await this.categoryRepository.isInUse(id);
    if (isInUse) {
      throw new ConflictError('Cannot delete category that is being used by items');
    }

    const success = await this.categoryRepository.delete(id);
    if (!success) {
      throw new Error('Failed to delete category');
    }
  }

  // Deactivate category (soft delete)
  async deactivateCategory(id: string): Promise<Category> {
    const category = await this.categoryRepository.findById(id);
    if (!category) {
      throw new NotFoundError('Category not found');
    }

    if (!category.is_active) {
      throw new ConflictError('Category is already deactivated');
    }

    const updatedCategory = await this.categoryRepository.update(id, { is_active: false });
    if (!updatedCategory) {
      throw new Error('Failed to deactivate category');
    }

    return updatedCategory;
  }

  // Activate category
  async activateCategory(id: string): Promise<Category> {
    const category = await this.categoryRepository.findById(id);
    if (!category) {
      throw new NotFoundError('Category not found');
    }

    if (category.is_active) {
      throw new ConflictError('Category is already active');
    }

    const updatedCategory = await this.categoryRepository.update(id, { is_active: true });
    if (!updatedCategory) {
      throw new Error('Failed to activate category');
    }

    return updatedCategory;
  }

  // Search categories by name
  async searchCategories(searchTerm: string): Promise<Category[]> {
    if (!searchTerm || searchTerm.trim() === '') {
      throw new ValidationError('Search term is required');
    }

    return this.categoryRepository.searchByName(searchTerm.trim());
  }

  // Get category statistics
  async getCategoryStats(id: string): Promise<{
    items_count: number;
    active_items_count: number;
    total_loans_count: number;
  }> {
    const category = await this.categoryRepository.findById(id);
    if (!category) {
      throw new NotFoundError('Category not found');
    }

    return this.categoryRepository.getCategoryStats(id);
  }

  // Validate category data
  private validateCategoryData(data: CreateCategoryData | UpdateCategoryData): void {
    if ('name' in data && data.name) {
      if (data.name.trim().length < 2) {
        throw new ValidationError('Category name must be at least 2 characters long');
      }

      if (data.name.trim().length > 100) {
        throw new ValidationError('Category name must not exceed 100 characters');
      }
    }

    if ('description' in data && data.description) {
      if (data.description.trim().length > 1000) {
        throw new ValidationError('Category description must not exceed 1000 characters');
      }
    }

    if ('color' in data && data.color) {
      // Validate hex color format
      const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
      if (!hexColorRegex.test(data.color)) {
        throw new ValidationError('Color must be a valid hex color (e.g., #FF0000)');
      }
    }

    if ('icon' in data && data.icon) {
      if (data.icon.trim().length > 100) {
        throw new ValidationError('Icon name must not exceed 100 characters');
      }
    }
  }
}
