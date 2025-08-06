import { Router } from 'express';
import authRoutes from './auth';
import categoryRoutes from './categories';
import healthRoutes from './health';
import itemRoutes from './items';
import loanRoutes from './loans';
import messageRoutes from './messages';
import reviewRoutes from './reviews';
import uploadRoutes from './upload';
import userRoutes from './users';

const router = Router();

// Mount routes
router.use('/health', healthRoutes);
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/categories', categoryRoutes);
router.use('/items', itemRoutes);
router.use('/loans', loanRoutes);
router.use('/reviews', reviewRoutes);
router.use('/messages', messageRoutes);
router.use('/upload', uploadRoutes);

export default router;
