import { useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { useSelector } from "react-redux";
import { MessageSquare, Heart, RefreshCw } from "lucide-react-native";
import { useGetPostsQuery, Post } from "@/store/api/postsApi";
import type { RootState } from "@/store/index";

export default function FeedScreen() {
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const [page] = useState(1);
  const { data, isLoading, isFetching, isError, refetch } = useGetPostsQuery({
    page,
    limit: 10,
  });

  const posts = data?.posts || [];

  const renderPostItem = ({ item }: { item: Post }) => {
    const isLikedByMe = item.likes?.some(
      (like) => like.userId === currentUser?.id
    );
    const likeCount = item.likes?.length || 0;
    const commentCount = item.comments?.length || 0;

    const formattedDate = new Date(item.createdAt).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    return (
      <View className="bg-white rounded-2xl p-4 mb-3 border border-gray-100 shadow-sm">
        {/* Post Author & Date Header */}
        <View className="flex-row justify-between items-center mb-2">
          <View className="flex-row items-center">
            <View className="w-8 h-8 rounded-full bg-blue-600 items-center justify-center mr-2.5">
              <Text className="text-white font-bold text-xs">
                {item.author.username.charAt(0).toUpperCase()}
              </Text>
            </View>
            <View>
              <Text className="font-semibold text-gray-900 text-sm">
                @{item.author.username}
              </Text>
              <Text className="text-xs text-gray-400">{formattedDate}</Text>
            </View>
          </View>
        </View>

        {/* Post Content */}
        <Text className="text-gray-800 text-base leading-6 mb-4">
          {item.content}
        </Text>

        {/* Post Footer Actions (Counts) */}
        <View className="flex-row items-center pt-3 border-t border-gray-100">
          {/* Likes info */}
          <View className="flex-row items-center mr-6">
            <Heart
              size={18}
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
          </View>

          {/* Comments info */}
          <View className="flex-row items-center">
            <MessageSquare size={18} color="#6b7280" />
            <Text className="text-xs font-semibold text-gray-500 ml-1.5">
              {commentCount} {commentCount === 1 ? "Comment" : "Comments"}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View className="flex-1 bg-gray-50 px-4 pt-2">
      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#2563eb" />
          <Text className="text-gray-500 mt-2 font-medium">
            Loading feed...
          </Text>
        </View>
      ) : isError ? (
        <View className="flex-1 items-center justify-center p-6">
          <Text className="text-red-500 font-semibold mb-2 text-center">
            Unable to fetch posts. Check your server connection.
          </Text>
          <TouchableOpacity
            onPress={() => refetch()}
            className="flex-row items-center bg-blue-600 px-4 py-2.5 rounded-xl"
          >
            <RefreshCw size={16} color="#ffffff" />
            <Text className="text-white font-semibold ml-2">Try Again</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderPostItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 24 }}
          refreshControl={
            <RefreshControl
              refreshing={isFetching}
              onRefresh={refetch}
              tintColor="#2563eb"
            />
          }
          ListEmptyComponent={
            <View className="py-16 items-center justify-center">
              <Text className="text-gray-400 font-semibold text-base">
                No posts yet!
              </Text>
              <Text className="text-gray-400 text-xs mt-1">
                Be the first to share an update.
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}
