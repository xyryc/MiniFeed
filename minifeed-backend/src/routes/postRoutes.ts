import { Router } from 'express';
import { createPost, getPosts, getPostById } from '../controllers/postController';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();

// All post routes require authentication
router.use(authenticate);

// POST /api/posts
router.post('/', createPost);

// GET /api/posts?page=1&limit=10
router.get('/', getPosts);

// GET /api/posts/:id
router.get('/:id', getPostById);

export default router;
