import {
  addItemImage,
  createItem,
  deleteItem,
  getItemById,
  getItemImages,
  getItemsByCategory,
  getItemsByOwner,
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
router.get('/:id', optionalAuthenticate, getItemById);
router.get('/:id/images', getItemImages);

// Simplify: allow creating without auth for demo
router.post('/', createItem);
router.put('/:id', authenticate, updateItem);
router.delete('/:id', authenticate, deleteItem);
router.patch('/:id/availability', authenticate, setItemAvailability);
router.post('/:id/images', authenticate, addItemImage);
router.delete('/images/:imageId', authenticate, removeItemImage);

// Owner-specific routes
router.get('/owner/:ownerId', getItemsByOwner);

export default router;
