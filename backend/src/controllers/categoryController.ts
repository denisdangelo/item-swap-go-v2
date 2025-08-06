import { asyncHandler } from '@/middleware/errorHandler';
import { CategoryService } from '@/services/CategoryService';
import { sendCreated, sendSuccess } from '@/utils/response';
import { Request, Response } from 'express';
import { z } from 'zod';

// Validation schemas
const createCategorySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name too long'),
  description: z.string().max(1000, 'Description too long').optional(),
  icon: z.string().max(100, 'Icon name too long').optional(),
  color: z
    .string()
    .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Invalid hex color format')
    .optional(),
});

const updateCategorySchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name too long')
    .optional(),
  description: z.string().max(1000, 'Description too long').optional(),
  icon: z.string().max(100, 'Icon name too long').optional(),
  color: z
    .string()
    .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Invalid hex color format')
    .optional(),
  is_active: z.boolean().optional(),
});

export class CategoryController {
  private categoryService: CategoryService;

  constructor() {
    this.categoryService = new CategoryService();
  }

  // Get all categories
  getAllCategories = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const includeInactive = req.query.include_inactive === 'true';

    const categories = includeInactive
      ? await this.categoryService.getAllCategories()
      : await this.categoryService.getActiveCategories();

    sendSuccess(res, categories, 'Categories retrieved successfully');
  });

  // Get categories with item count
  getCategoriesWithItemCount = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const categories = await this.categoryService.getCategoriesWithItemCount();

    sendSuccess(res, categories, 'Categories with item count retrieved successfully');
  });

  // Get popular categories
  getPopularCategories = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;

    if (isNaN(limit) || limit < 1 || limit > 50) {
      throw new Error('Limit must be between 1 and 50');
    }

    const categories = await this.categoryService.getPopularCategories(limit);

    sendSuccess(res, categories, 'Popular categories retrieved successfully');
  });

  // Get category by ID
  getCategoryById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    const category = await this.categoryService.getCategoryById(id);

    sendSuccess(res, category, 'Category retrieved successfully');
  });

  // Create new category
  createCategory = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const validatedData = createCategorySchema.parse(req.body);

    const category = await this.categoryService.createCategory(validatedData);

    sendCreated(res, category, 'Category created successfully');
  });

  // Update category
  updateCategory = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const validatedData = updateCategorySchema.parse(req.body);

    const category = await this.categoryService.updateCategory(id, validatedData);

    sendSuccess(res, category, 'Category updated successfully');
  });

  // Delete category
  deleteCategory = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    await this.categoryService.deleteCategory(id);

    sendSuccess(res, null, 'Category deleted successfully');
  });

  // Deactivate category
  deactivateCategory = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    const category = await this.categoryService.deactivateCategory(id);

    sendSuccess(res, category, 'Category deactivated successfully');
  });

  // Activate category
  activateCategory = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    const category = await this.categoryService.activateCategory(id);

    sendSuccess(res, category, 'Category activated successfully');
  });

  // Search categories
  searchCategories = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const searchTerm = req.query.q as string;

    if (!searchTerm) {
      throw new Error('Search term (q) is required');
    }

    const categories = await this.categoryService.searchCategories(searchTerm);

    sendSuccess(res, categories, 'Categories search completed successfully');
  });

  // Get category statistics
  getCategoryStats = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    const stats = await this.categoryService.getCategoryStats(id);

    sendSuccess(res, stats, 'Category statistics retrieved successfully');
  });
}

// Create controller instance
const categoryController = new CategoryController();

// Export controller methods
export const getAllCategories = categoryController.getAllCategories;
export const getCategoriesWithItemCount = categoryController.getCategoriesWithItemCount;
export const getPopularCategories = categoryController.getPopularCategories;
export const getCategoryById = categoryController.getCategoryById;
export const createCategory = categoryController.createCategory;
export const updateCategory = categoryController.updateCategory;
export const deleteCategory = categoryController.deleteCategory;
export const deactivateCategory = categoryController.deactivateCategory;
export const activateCategory = categoryController.activateCategory;
export const searchCategories = categoryController.searchCategories;
export const getCategoryStats = categoryController.getCategoryStats;
