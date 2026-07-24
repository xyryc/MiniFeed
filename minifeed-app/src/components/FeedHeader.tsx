import { View, Text } from "react-native";

interface FeedHeaderProps {
  username?: string;
}

export function FeedHeader({ username }: FeedHeaderProps) {
  return (
    <View className="px-4 py-3 bg-white border-b border-gray-100 flex-row items-center justify-between">
      <Text className="text-xl font-bold text-gray-900">MiniFeed</Text>
      {username && (
        <Text className="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
          @{username}
        </Text>
      )}
    </View>
  );
}
