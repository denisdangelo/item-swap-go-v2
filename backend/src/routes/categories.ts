import {
  activateCategory,
  createCategory,
  deactivateCategory,
  deleteCategory,
  getAllCategories,
  getCategoriesWithItemCount,
  getCategoryById,
  getCategoryStats,
  getPopularCategories,
  searchCategories,
  updateCategory,
} from '@/controllers/categoryController';
import { authenticate } from '@/middleware/auth';
import { Router } from 'express';

const router = Router();

// Public routes
router.get('/', getAllCategories);
router.get('/with-count', getCategoriesWithItemCount);
router.get('/popular', getPopularCategories);
router.get('/search', searchCategories);
router.get('/:id', getCategoryById);
router.get('/:id/stats', getCategoryStats);

// Protected routes (admin only - for now, any authenticated user can manage categories)
router.post('/', authenticate, createCategory);
router.put('/:id', authenticate, updateCategory);
router.delete('/:id', authenticate, deleteCategory);
router.post('/:id/deactivate', authenticate, deactivateCategory);
router.post('/:id/activate', authenticate, activateCategory);

export default router;
