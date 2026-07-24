import { Router } from 'express';
import { signup, login, getMe, updateFcmToken } from '../controllers/authController';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();

// POST /api/auth/signup
router.post('/signup', signup);

// POST /api/auth/login
router.post('/login', login);

// GET /api/auth/me  (protected)
router.get('/me', authenticate, getMe);

// POST /api/auth/fcm-token (protected)
router.post('/fcm-token', authenticate, updateFcmToken);

export default router;
