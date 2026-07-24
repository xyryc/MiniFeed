import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import Post from '../models/Post';
import User from '../models/User';
import Like from '../models/Like';
import Comment from '../models/Comment';

export const createPost = async (req: AuthRequest, res: Response): Promise<void> => {
  const { content } = req.body as { content: string };
  const userId = req.user?.id;

  if (!content || content.trim().length === 0) {
    res.status(400).json({ message: 'Post content cannot be empty' });
    return;
  }

  if (content.length > 500) {
    res.status(400).json({ message: 'Post content cannot exceed 500 characters' });
    return;
  }

  if (!userId) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  try {
    const post = await Post.create({ content: content.trim(), userId });

    const postWithAuthor = await Post.findByPk(post.id, {
      include: [{ model: User, as: 'author', attributes: ['id', 'username'] }],
    });

    res.status(201).json({ message: 'Post created', post: postWithAuthor });
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getPosts = async (req: AuthRequest, res: Response): Promise<void> => {
  const page = parseInt(req.query['page'] as string) || 1;
  const limit = parseInt(req.query['limit'] as string) || 10;
  const offset = (page - 1) * limit;

  try {
    const total = await Post.count();

    const posts = await Post.findAll({
      include: [
        { model: User, as: 'author', attributes: ['id', 'username'] },
        { model: Like, as: 'likes', attributes: ['id', 'userId'] },
        { model: Comment, as: 'comments', attributes: ['id'] },
      ],
      order: [['createdAt', 'DESC']],
      limit,
      offset,
    });

    res.status(200).json({
      posts,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getPostById = async (req: AuthRequest, res: Response): Promise<void> => {
  const id = parseInt(req.params['id'] as string);

  if (isNaN(id)) {
    res.status(400).json({ message: 'Invalid post ID' });
    return;
  }

  try {
    const post = await Post.findByPk(id, {
      include: [
        { model: User, as: 'author', attributes: ['id', 'username'] },
        { model: Like, as: 'likes', attributes: ['id', 'userId'] },
        {
          model: Comment,
          as: 'comments',
          include: [{ model: User, as: 'author', attributes: ['id', 'username'] }],
        },
      ],
    });

    if (!post) {
      res.status(404).json({ message: 'Post not found' });
      return;
    }

    res.status(200).json({ post });
  } catch (error) {
    console.error('Get post error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
