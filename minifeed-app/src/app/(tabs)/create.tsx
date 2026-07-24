import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Send } from "lucide-react-native";
import { useCreatePostMutation } from "@/store/api/postsApi";

const MAX_CHARS = 500;

export default function CreatePostScreen() {
  const insets = useSafeAreaInsets();
  const [content, setContent] = useState("");
  const [createPost, { isLoading }] = useCreatePostMutation();

  const handleCreatePost = async () => {
    if (!content.trim()) {
      Alert.alert("Error", "Post content cannot be empty.");
      return;
    }

    if (content.length > MAX_CHARS) {
      Alert.alert("Error", `Post cannot exceed ${MAX_CHARS} characters.`);
      return;
    }

    try {
      await createPost({ content: content.trim() }).unwrap();
      setContent("");
      Keyboard.dismiss();
      router.push("/(tabs)/feed");
    } catch (error: unknown) {
      const message =
        (error as { data?: { message?: string } })?.data?.message ??
        "Failed to publish post. Please try again.";
      Alert.alert("Error", message);
    }
  };

  const charsRemaining = MAX_CHARS - content.length;

  return (
    <View style={{ flex: 1, backgroundColor: "#f9fafb", paddingTop: insets.top }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1"
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
            className="p-5"
          >
            <Text className="text-2xl font-bold text-gray-900 mb-2">
              Create Post
            </Text>
            <Text className="text-gray-500 mb-6">
              Share what's on your mind with the community.
            </Text>

            {/* Card Container */}
            <View className="bg-white rounded-2xl p-4 border border-gray-100 mb-6" style={{ elevation: 1 }}>
              <TextInput
                className="text-gray-900 text-base leading-6 min-h-[160px] align-top"
                placeholder="What's happening?"
                placeholderTextColor="#9ca3af"
                multiline
                textAlignVertical="top"
                maxLength={MAX_CHARS}
                value={content}
                onChangeText={setContent}
                autoFocus
              />

              {/* Character Counter */}
              <View className="flex-row justify-end pt-3 border-t border-gray-100">
                <Text
                  className={`text-xs font-semibold ${
                    charsRemaining < 50 ? "text-red-500" : "text-gray-400"
                  }`}
                >
                  {charsRemaining} / {MAX_CHARS}
                </Text>
              </View>
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              onPress={handleCreatePost}
              disabled={isLoading || !content.trim()}
              className={`flex-row items-center justify-center rounded-xl py-4 ${
                isLoading || !content.trim()
                  ? "bg-blue-300"
                  : "bg-blue-600 active:bg-blue-700"
              }`}
              style={{ elevation: 2 }}
              activeOpacity={0.8}
            >
              {isLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <>
                  <Send size={18} color="#ffffff" />
                  <Text className="text-white font-bold text-base ml-2">
                    Publish Post
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </View>
  );
}
