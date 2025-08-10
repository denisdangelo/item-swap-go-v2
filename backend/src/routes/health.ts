import { detailedHealthCheck, healthCheck } from '@/controllers/healthController';
import { Router } from 'express';

const router = Router();

// Basic health check
router.get('/', healthCheck);

// Detailed health check
router.get('/detailed', detailedHealthCheck);

export default router;
