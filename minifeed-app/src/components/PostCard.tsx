import { View, Text, TouchableOpacity } from "react-native";
import { MessageSquare, Heart } from "lucide-react-native";
import { Post } from "@/store/api/postsApi";

interface PostCardProps {
  post: Post;
  currentUserId?: number;
  onLikePress: (postId: number) => void;
  onCommentPress?: (postId: number) => void;
}

export function PostCard({
  post,
  currentUserId,
  onLikePress,
  onCommentPress,
}: PostCardProps) {
  const isLikedByMe = post.likes?.some((like) => like.userId === currentUserId);
  const likeCount = post.likes?.length || 0;
  const commentCount = post.comments?.length || 0;

  const formattedDate = new Date(post.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <View className="bg-white rounded-2xl p-4 mb-3 border border-gray-100 shadow-sm">
      {/* Author & Date Header */}
      <View className="flex-row justify-between items-center mb-2">
        <View className="flex-row items-center">
          <View className="w-8 h-8 rounded-full bg-blue-600 items-center justify-center mr-2.5">
            <Text className="text-white font-bold text-xs">
              {post.author.username.charAt(0).toUpperCase()}
            </Text>
          </View>
          <View>
            <Text className="font-semibold text-gray-900 text-sm">
              @{post.author.username}
            </Text>
            <Text className="text-xs text-gray-400">{formattedDate}</Text>
          </View>
        </View>
      </View>

      {/* Content */}
      <Text className="text-gray-800 text-base leading-6 mb-4">
        {post.content}
      </Text>

      {/* Footer Actions */}
      <View className="flex-row items-center pt-3 border-t border-gray-100">
        {/* Like Button */}
        <TouchableOpacity
          onPress={() => onLikePress(post.id)}
          className="flex-row items-center mr-6 py-1 px-2 -ml-2 rounded-lg active:bg-gray-100"
          activeOpacity={0.7}
        >
          <Heart
            size={20}
            color={isLikedByMe ? "#ef4444" : "#6b7280"}
            fill={isLikedByMe ? "#ef4444" : "none"}
          />
          <Text
            className={`text-xs font-semibold ml-1.5 ${
              isLikedByMe ? "text-red-500" : "text-gray-500"
            }`}
          >
            {likeCount} {likeCount === 1 ? "Like" : "Likes"}
          </Text>
        </TouchableOpacity>

        {/* Comment Button */}
        <TouchableOpacity
          onPress={() => onCommentPress && onCommentPress(post.id)}
          className="flex-row items-center py-1 px-2 rounded-lg active:bg-gray-100"
          activeOpacity={0.7}
        >
          <MessageSquare size={20} color="#6b7280" />
          <Text className="text-xs font-semibold text-gray-500 ml-1.5">
            {commentCount} {commentCount === 1 ? "Comment" : "Comments"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
