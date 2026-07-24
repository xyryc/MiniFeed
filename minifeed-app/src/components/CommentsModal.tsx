import { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { X, Send } from "lucide-react-native";
import {
  useGetCommentsQuery,
  useAddCommentMutation,
  Comment,
} from "@/store/api/postsApi";

interface CommentsModalProps {
  postId: number | null;
  visible: boolean;
  onClose: () => void;
}

export function CommentsModal({ postId, visible, onClose }: CommentsModalProps) {
  const insets = useSafeAreaInsets();
  const [content, setContent] = useState("");

  const { data, isLoading, isFetching, isError } = useGetCommentsQuery(postId!, {
    skip: !postId || !visible,
  });

  const [addComment, { isLoading: isSubmitting }] = useAddCommentMutation();

  const comments = data?.comments || [];
  const isCommentsLoading = isLoading || isFetching;

  const handleSendComment = async () => {
    if (!content.trim() || !postId) return;

    try {
      await addComment({ postId, content: content.trim() }).unwrap();
      setContent("");
      Keyboard.dismiss();
    } catch (error: unknown) {
      const message =
        (error as { data?: { message?: string } })?.data?.message ??
        "Failed to post comment.";
      Alert.alert("Error", message);
    }
  };

  const handleClose = () => {
    Keyboard.dismiss();
    setContent("");
    onClose();
  };

  const renderCommentItem = ({ item }: { item: Comment }) => {
    const formattedDate = new Date(item.createdAt).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    return (
      <View className="flex-row mb-4">
        <View className="w-8 h-8 rounded-full bg-blue-100 items-center justify-center mr-2.5 mt-0.5">
          <Text className="text-blue-700 font-bold text-xs">
            {item.author.username.charAt(0).toUpperCase()}
          </Text>
        </View>

        <View className="flex-1 bg-gray-100 p-3 rounded-2xl">
          <View className="flex-row justify-between items-center mb-1">
            <Text className="font-bold text-gray-900 text-xs">
              @{item.author.username}
            </Text>
            <Text className="text-[10px] text-gray-400">{formattedDate}</Text>
          </View>
          <Text className="text-gray-800 text-sm leading-5">{item.content}</Text>
        </View>
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      statusBarTranslucent
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <View className="flex-1 justify-end bg-black/50">
          {/* Backdrop Tap to Close */}
          <TouchableWithoutFeedback onPress={handleClose}>
            <View className="flex-1" />
          </TouchableWithoutFeedback>

          {/* Bottom Sheet Card Container */}
          <View className="bg-white rounded-t-3xl h-[65%] max-h-[85%] shadow-2xl flex-col">
            {/* Handle bar indicator */}
            <View className="w-10 h-1 rounded-full bg-gray-300 self-center mt-2.5 mb-1" />

            {/* Sheet Header */}
            <View className="px-4 py-2 border-b border-gray-100 flex-row items-center justify-between">
              <Text className="text-base font-bold text-gray-900">Comments</Text>
              <TouchableOpacity
                onPress={handleClose}
                className="p-1.5 rounded-full bg-gray-100"
              >
                <X size={18} color="#374151" />
              </TouchableOpacity>
            </View>

            {/* Comment List */}
            <View className="flex-1 px-4 pt-3">
              {isCommentsLoading ? (
                <View className="flex-1 items-center justify-center">
                  <ActivityIndicator size="small" color="#2563eb" />
                  <Text className="text-gray-400 text-xs mt-2">
                    Loading comments...
                  </Text>
                </View>
              ) : isError ? (
                <View className="flex-1 items-center justify-center">
                  <Text className="text-red-500 text-sm">
                    Failed to load comments.
                  </Text>
                </View>
              ) : (
                <FlatList
                  data={comments}
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={renderCommentItem}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={{ paddingBottom: 16 }}
                  keyboardShouldPersistTaps="handled"
                  ListEmptyComponent={
                    <View className="py-12 items-center justify-center">
                      <Text className="text-gray-400 font-medium text-sm">
                        No comments yet.
                      </Text>
                      <Text className="text-gray-400 text-xs mt-0.5">
                        Start the conversation!
                      </Text>
                    </View>
                  }
                />
              )}
            </View>

            {/* Comment Input Bar */}
            <View
              style={{
                paddingBottom:
                  Platform.OS === "ios" ? insets.bottom + 8 : 12,
              }}
              className="p-3 border-t border-gray-100 bg-white flex-row items-center"
            >
              <TextInput
                className="flex-1 bg-gray-100 border border-gray-200 rounded-full px-4 py-2.5 text-sm text-gray-900 mr-2 max-h-24"
                placeholder="Add a comment..."
                placeholderTextColor="#9ca3af"
                value={content}
                onChangeText={setContent}
                multiline
              />
              <TouchableOpacity
                onPress={handleSendComment}
                disabled={isSubmitting || !content.trim()}
                className={`w-10 h-10 rounded-full items-center justify-center ${
                  isSubmitting || !content.trim()
                    ? "bg-blue-300"
                    : "bg-blue-600"
                }`}
              >
                {isSubmitting ? (
                  <ActivityIndicator size="small" color="#ffffff" />
                ) : (
                  <Send size={18} color="#ffffff" />
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
