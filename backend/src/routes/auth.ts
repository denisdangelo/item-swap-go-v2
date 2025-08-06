import {
  changePassword,
  checkEmail,
  login,
  logout,
  logoutAll,
  me,
  refreshToken,
  register,
} from '@/controllers/authController';
import { authenticate } from '@/middleware/auth';
import { Router } from 'express';

const router = Router();

// Public routes
router.post('/register', register);
router.post('/login', login);
router.get('/check-email', checkEmail);

// Protected routes
router.post('/refresh', authenticate, refreshToken);
router.post('/logout', authenticate, logout);
router.post('/logout-all', authenticate, logoutAll);
router.get('/me', authenticate, me);
router.post('/change-password', authenticate, changePassword);

export default router;
