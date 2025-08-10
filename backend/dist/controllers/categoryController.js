"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCategoryStats = exports.searchCategories = exports.activateCategory = exports.deactivateCategory = exports.deleteCategory = exports.updateCategory = exports.createCategory = exports.getCategoryById = exports.getPopularCategories = exports.getCategoriesWithItemCount = exports.getAllCategories = exports.CategoryController = void 0;
const errorHandler_1 = require("@/middleware/errorHandler");
const CategoryService_1 = require("@/services/CategoryService");
const response_1 = require("@/utils/response");
const zod_1 = require("zod");
// Validation schemas
const createCategorySchema = zod_1.z.object({
    name: zod_1.z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name too long'),
    description: zod_1.z.string().max(1000, 'Description too long').optional(),
    icon: zod_1.z.string().max(100, 'Icon name too long').optional(),
    color: zod_1.z
        .string()
        .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Invalid hex color format')
        .optional(),
});
const updateCategorySchema = zod_1.z.object({
    name: zod_1.z
        .string()
        .min(2, 'Name must be at least 2 characters')
        .max(100, 'Name too long')
        .optional(),
    description: zod_1.z.string().max(1000, 'Description too long').optional(),
    icon: zod_1.z.string().max(100, 'Icon name too long').optional(),
    color: zod_1.z
        .string()
        .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Invalid hex color format')
        .optional(),
    is_active: zod_1.z.boolean().optional(),
});
class CategoryController {
    constructor() {
        // Get all categories
        this.getAllCategories = (0, errorHandler_1.asyncHandler)(async (req, res) => {
            const includeInactive = req.query.include_inactive === 'true';
            const categories = includeInactive
                ? await this.categoryService.getAllCategories()
                : await this.categoryService.getActiveCategories();
            (0, response_1.sendSuccess)(res, categories, 'Categories retrieved successfully');
        });
        // Get categories with item count
        this.getCategoriesWithItemCount = (0, errorHandler_1.asyncHandler)(async (req, res) => {
            const categories = await this.categoryService.getCategoriesWithItemCount();
            (0, response_1.sendSuccess)(res, categories, 'Categories with item count retrieved successfully');
        });
        // Get popular categories
        this.getPopularCategories = (0, errorHandler_1.asyncHandler)(async (req, res) => {
            const limit = req.query.limit ? parseInt(req.query.limit) : 10;
            if (isNaN(limit) || limit < 1 || limit > 50) {
                throw new Error('Limit must be between 1 and 50');
            }
            const categories = await this.categoryService.getPopularCategories(limit);
            (0, response_1.sendSuccess)(res, categories, 'Popular categories retrieved successfully');
        });
        // Get category by ID
        this.getCategoryById = (0, errorHandler_1.asyncHandler)(async (req, res) => {
            const { id } = req.params;
            const category = await this.categoryService.getCategoryById(id);
            (0, response_1.sendSuccess)(res, category, 'Category retrieved successfully');
        });
        // Create new category
        this.createCategory = (0, errorHandler_1.asyncHandler)(async (req, res) => {
            const validatedData = createCategorySchema.parse(req.body);
            const category = await this.categoryService.createCategory(validatedData);
            (0, response_1.sendCreated)(res, category, 'Category created successfully');
        });
        // Update category
        this.updateCategory = (0, errorHandler_1.asyncHandler)(async (req, res) => {
            const { id } = req.params;
            const validatedData = updateCategorySchema.parse(req.body);
            const category = await this.categoryService.updateCategory(id, validatedData);
            (0, response_1.sendSuccess)(res, category, 'Category updated successfully');
        });
        // Delete category
        this.deleteCategory = (0, errorHandler_1.asyncHandler)(async (req, res) => {
            const { id } = req.params;
            await this.categoryService.deleteCategory(id);
            (0, response_1.sendSuccess)(res, null, 'Category deleted successfully');
        });
        // Deactivate category
        this.deactivateCategory = (0, errorHandler_1.asyncHandler)(async (req, res) => {
            const { id } = req.params;
            const category = await this.categoryService.deactivateCategory(id);
            (0, response_1.sendSuccess)(res, category, 'Category deactivated successfully');
        });
        // Activate category
        this.activateCategory = (0, errorHandler_1.asyncHandler)(async (req, res) => {
            const { id } = req.params;
            const category = await this.categoryService.activateCategory(id);
            (0, response_1.sendSuccess)(res, category, 'Category activated successfully');
        });
        // Search categories
        this.searchCategories = (0, errorHandler_1.asyncHandler)(async (req, res) => {
            const searchTerm = req.query.q;
            if (!searchTerm) {
                throw new Error('Search term (q) is required');
            }
            const categories = await this.categoryService.searchCategories(searchTerm);
            (0, response_1.sendSuccess)(res, categories, 'Categories search completed successfully');
        });
        // Get category statistics
        this.getCategoryStats = (0, errorHandler_1.asyncHandler)(async (req, res) => {
            const { id } = req.params;
            const stats = await this.categoryService.getCategoryStats(id);
            (0, response_1.sendSuccess)(res, stats, 'Category statistics retrieved successfully');
        });
        this.categoryService = new CategoryService_1.CategoryService();
    }
}
exports.CategoryController = CategoryController;
// Create controller instance
const categoryController = new CategoryController();
// Export controller methods
exports.getAllCategories = categoryController.getAllCategories;
exports.getCategoriesWithItemCount = categoryController.getCategoriesWithItemCount;
exports.getPopularCategories = categoryController.getPopularCategories;
exports.getCategoryById = categoryController.getCategoryById;
exports.createCategory = categoryController.createCategory;
exports.updateCategory = categoryController.updateCategory;
exports.deleteCategory = categoryController.deleteCategory;
exports.deactivateCategory = categoryController.deactivateCategory;
exports.activateCategory = categoryController.activateCategory;
exports.searchCategories = categoryController.searchCategories;
exports.getCategoryStats = categoryController.getCategoryStats;
