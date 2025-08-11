import {
  addItemImage,
  createItem,
  deleteItem,
  getItemById,
  getItemImages,
  getItemsByCategory,
  getItemsByOwner,
  getMyItems,
  getNearbyItems,
  removeItemImage,
  searchItems,
  setItemAvailability,
  updateItem,
} from '@/controllers/itemController';
import { authenticate, optionalAuthenticate } from '@/middleware/auth';
import { Router } from 'express';

const router = Router();

// Public routes
router.get('/search', optionalAuthenticate, searchItems);
router.get('/nearby', getNearbyItems);
router.get('/category/:categoryId', getItemsByCategory);

// Protected routes - require authentication
router.get('/my-items', authenticate, getMyItems);

// Item-specific routes (must come after specific routes)
router.get('/:id', optionalAuthenticate, getItemById);
router.get('/:id/images', getItemImages);
router.post('/', authenticate, createItem);
router.put('/:id', authenticate, updateItem);
router.delete('/:id', authenticate, deleteItem);
router.patch('/:id/availability', authenticate, setItemAvailability);
router.post('/:id/images', authenticate, addItemImage);
router.delete('/images/:imageId', authenticate, removeItemImage);

// Owner-specific routes
router.get('/owner/:ownerId', getItemsByOwner);

export default router;
