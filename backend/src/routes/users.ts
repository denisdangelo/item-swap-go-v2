import {
  deactivateAccount,
  deleteAccount,
  getNearbyUsers,
  getProfile,
  getUserStats,
  searchUsers,
  updateAvatar,
  updateLocation,
  updateProfile,
  verifyEmail,
} from '@/controllers/userController';
import { authenticate, optionalAuthenticate } from '@/middleware/auth';
import { Router } from 'express';

const router = Router();

// Public routes
router.get('/search', searchUsers);
router.get('/nearby', getNearbyUsers);
router.get('/:id', optionalAuthenticate, getProfile);
router.get('/:id/stats', getUserStats);

// Protected routes
router.put('/profile', authenticate, updateProfile);
router.put('/location', authenticate, updateLocation);
router.put('/avatar', authenticate, updateAvatar);
router.post('/verify-email', authenticate, verifyEmail);
router.post('/deactivate', authenticate, deactivateAccount);
router.delete('/account', authenticate, deleteAccount);

export default router;
