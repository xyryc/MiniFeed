import { Router } from 'express';
import { createPost, getPosts, getPostById } from '../controllers/postController';
import { toggleLike } from '../controllers/likeController';
import { addComment, getComments } from '../controllers/commentController';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();

router.use(authenticate);

// POST /api/posts
router.post('/', createPost);

// GET /api/posts?page=1&limit=10
router.get('/', getPosts);

// GET /api/posts/:id
router.get('/:id', getPostById);

// POST /api/posts/:id/like
router.post('/:id/like', toggleLike);

// POST /api/posts/:id/comment
router.post('/:id/comment', addComment);

// GET /api/posts/:id/comments
router.get('/:id/comments', getComments);

export default router;
