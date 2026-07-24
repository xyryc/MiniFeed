import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import Comment from '../models/Comment';
import Post from '../models/Post';
import User from '../models/User';

export const addComment = async (req: AuthRequest, res: Response): Promise<void> => {
  const postId = parseInt(req.params['id'] as string);
  const userId = req.user?.id;
  const { content } = req.body as { content: string };

  if (!userId) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  if (isNaN(postId)) {
    res.status(400).json({ message: 'Invalid post ID' });
    return;
  }

  if (!content || content.trim().length === 0) {
    res.status(400).json({ message: 'Comment content cannot be empty' });
    return;
  }

  if (content.length > 300) {
    res.status(400).json({ message: 'Comment cannot exceed 300 characters' });
    return;
  }

  try {
    const post = await Post.findByPk(postId);
    if (!post) {
      res.status(404).json({ message: 'Post not found' });
      return;
    }

    const comment = await Comment.create({ content: content.trim(), userId, postId });

    const commentWithAuthor = await Comment.findByPk(comment.id, {
      include: [{ model: User, as: 'author', attributes: ['id', 'username'] }],
    });

    res.status(201).json({ message: 'Comment added', comment: commentWithAuthor });
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getComments = async (req: AuthRequest, res: Response): Promise<void> => {
  const postId = parseInt(req.params['id'] as string);

  if (isNaN(postId)) {
    res.status(400).json({ message: 'Invalid post ID' });
    return;
  }

  try {
    const post = await Post.findByPk(postId);
    if (!post) {
      res.status(404).json({ message: 'Post not found' });
      return;
    }

    const comments = await Comment.findAll({
      where: { postId },
      include: [{ model: User, as: 'author', attributes: ['id', 'username'] }],
      order: [['createdAt', 'ASC']],
    });

    res.status(200).json({ comments });
  } catch (error) {
    console.error('Get comments error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
