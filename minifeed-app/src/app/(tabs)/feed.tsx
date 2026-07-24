import { useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import { RefreshCw } from "lucide-react-native";
import {
  useGetPostsQuery,
  useToggleLikeMutation,
  Post,
} from "@/store/api/postsApi";
import type { RootState } from "@/store/index";
import { PostCard } from "@/components/PostCard";
import { FeedHeader } from "@/components/FeedHeader";
import { CommentsModal } from "@/components/CommentsModal";

export default function FeedScreen() {
  const insets = useSafeAreaInsets();
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const [page] = useState(1);

  const [activePostId, setActivePostId] = useState<number | null>(null);
  const [commentsVisible, setCommentsVisible] = useState(false);

  const { data, isLoading, isFetching, isError, refetch } = useGetPostsQuery({
    page,
    limit: 10,
  });
  const [toggleLike] = useToggleLikeMutation();

  const handleToggleLike = async (postId: number) => {
    try {
      await toggleLike(postId).unwrap();
    } catch (error) {
      console.error("Toggle like failed:", error);
    }
  };

  const handleOpenComments = (postId: number) => {
    setActivePostId(postId);
    setCommentsVisible(true);
  };

  const handleCloseComments = () => {
    setCommentsVisible(false);
    setActivePostId(null);
  };

  const posts = data?.posts || [];

  return (
    <View style={{ flex: 1, backgroundColor: "#f9fafb", paddingTop: insets.top }}>
      <FeedHeader username={currentUser?.username} />

      <View className="flex-1 px-4 pt-3">
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
            renderItem={({ item }: { item: Post }) => (
              <PostCard
                post={item}
                currentUserId={currentUser?.id}
                onLikePress={handleToggleLike}
                onCommentPress={handleOpenComments}
              />
            )}
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

      {/* Comments Modal */}
      <CommentsModal
        postId={activePostId}
        visible={commentsVisible}
        onClose={handleCloseComments}
      />
    </View>
  );
}
