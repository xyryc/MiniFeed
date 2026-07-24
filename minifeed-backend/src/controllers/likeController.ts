import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import Like from '../models/Like';
import Post from '../models/Post';
import User from '../models/User';
import { sendPushNotification } from '../config/firebase';

export const toggleLike = async (req: AuthRequest, res: Response): Promise<void> => {
  const postId = parseInt(req.params['id'] as string);
  const userId = req.user?.id;

  if (!userId) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

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

    const existingLike = await Like.findOne({ where: { userId, postId } });

    if (existingLike) {
      await existingLike.destroy();
      const likeCount = await Like.count({ where: { postId } });
      res.status(200).json({ message: 'Post unliked', liked: false, likeCount });
      return;
    }

    await Like.create({ userId, postId });
    const likeCount = await Like.count({ where: { postId } });
    
    // Send push notification to post author
    const postWithAuthor = await Post.findByPk(postId, { include: [{ model: User, as: "author" }] });
    if (postWithAuthor && postWithAuthor.author && postWithAuthor.author.fcmToken && postWithAuthor.author.id !== userId) {
      await sendPushNotification(
        postWithAuthor.author.fcmToken,
        'New Like ❤️',
        `@${req.user?.username} liked your post.`
      );
    }

    res.status(200).json({ message: 'Post liked', liked: true, likeCount });
  } catch (error) {
    console.error('Toggle like error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
