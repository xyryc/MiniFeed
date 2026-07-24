import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDispatch } from "react-redux";
import { User, Mail, Hash, LogOut, RefreshCw } from "lucide-react-native";
import { useGetMeQuery } from "@/store/api/authApi";
import { logout } from "@/store/authSlice";
import type { AppDispatch } from "@/store/index";

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch<AppDispatch>();
  const { data, isLoading, isError, refetch } = useGetMeQuery();

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#f9fafb", paddingTop: insets.top }} className="p-5">
      <Text className="text-2xl font-bold text-gray-900 mb-6">Settings</Text>

      {isLoading ? (
        <View className="p-8 items-center justify-center">
          <ActivityIndicator size="large" color="#2563eb" />
          <Text className="text-gray-500 mt-2">Loading profile...</Text>
        </View>
      ) : isError ? (
        <View className="bg-red-50 p-4 rounded-xl items-center border border-red-200 mb-6">
          <Text className="text-red-600 font-medium mb-2">
            Failed to load profile info
          </Text>
          <TouchableOpacity
            onPress={() => refetch()}
            className="flex-row items-center bg-red-100 px-3 py-1.5 rounded-lg"
          >
            <RefreshCw size={16} color="#dc2626" />
            <Text className="text-red-700 text-sm font-semibold ml-1.5">
              Retry
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View className="bg-white rounded-2xl p-5 border border-gray-100 mb-6" style={{ elevation: 2 }}>
          <Text className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">
            User Info
          </Text>

          {/* User ID */}
          <View className="flex-row items-center py-3 border-b border-gray-100">
            <View className="w-9 h-9 rounded-full bg-blue-50 items-center justify-center mr-3">
              <Hash size={18} color="#2563eb" />
            </View>
            <View>
              <Text className="text-xs text-gray-400">User ID</Text>
              <Text className="text-base font-semibold text-gray-900">
                #{data?.user?.id}
              </Text>
            </View>
          </View>

          {/* Username */}
          <View className="flex-row items-center py-3 border-b border-gray-100">
            <View className="w-9 h-9 rounded-full bg-purple-50 items-center justify-center mr-3">
              <User size={18} color="#9333ea" />
            </View>
            <View>
              <Text className="text-xs text-gray-400">Username</Text>
              <Text className="text-base font-semibold text-gray-900">
                @{data?.user?.username}
              </Text>
            </View>
          </View>

          {/* Email */}
          <View className="flex-row items-center py-3">
            <View className="w-9 h-9 rounded-full bg-green-50 items-center justify-center mr-3">
              <Mail size={18} color="#16a34a" />
            </View>
            <View>
              <Text className="text-xs text-gray-400">Email Address</Text>
              <Text className="text-base font-semibold text-gray-900">
                {data?.user?.email}
              </Text>
            </View>
          </View>
        </View>
      )}

      {/* Logout Button */}
      <TouchableOpacity
        onPress={handleLogout}
        className="flex-row items-center justify-center bg-red-600 rounded-xl py-4 border border-red-700"
        style={{ elevation: 2 }}
        activeOpacity={0.8}
      >
        <LogOut size={20} color="#ffffff" />
        <Text className="text-white font-bold text-base ml-2">Log Out</Text>
      </TouchableOpacity>
    </View>
  );
}
