import { View, Text, TouchableOpacity, ActivityIndicator, Switch, Alert } from "react-native";
import { useEffect, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDispatch } from "react-redux";
import { User, Mail, Hash, LogOut, RefreshCw, Bell } from "lucide-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { useGetMeQuery, useUpdateFcmTokenMutation } from "@/store/api/authApi";
import { logout } from "@/store/authSlice";
import type { AppDispatch } from "@/store/index";

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch<AppDispatch>();
  const { data, isLoading, isError, refetch } = useGetMeQuery();
  const [updateFcmToken] = useUpdateFcmTokenMutation();
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem("notificationsEnabled").then((val) => {
      if (val === "true") setNotificationsEnabled(true);
    });
  }, []);

  const toggleNotifications = async (value: boolean) => {
    // Optimistic UI update
    setNotificationsEnabled(value);
    
    if (value) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      
      if (finalStatus !== "granted") {
        Alert.alert("Permission required", "Please enable notifications in your phone settings.");
        setNotificationsEnabled(false);
        return;
      }
      
      try {
        const pushTokenData = await Notifications.getDevicePushTokenAsync();
        await updateFcmToken({ token: pushTokenData.data }).unwrap();
        await AsyncStorage.setItem("notificationsEnabled", "true");
      } catch (e) {
        console.error("Failed to enable notifications", e);
        Alert.alert("Error", "Failed to enable notifications on the server.");
        setNotificationsEnabled(false);
      }
    } else {
      try {
        await updateFcmToken({ token: null }).unwrap();
        await AsyncStorage.setItem("notificationsEnabled", "false");
      } catch (e) {
        console.error("Failed to disable notifications", e);
        Alert.alert("Error", "Failed to disable notifications on the server.");
        setNotificationsEnabled(true);
      }
    }
  };

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

      {/* App Preferences */}
      <View className="bg-white rounded-2xl p-5 border border-gray-100 mb-6" style={{ elevation: 2 }}>
        <Text className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">
          Preferences
        </Text>
        
        <View className="flex-row items-center justify-between py-2">
          <View className="flex-row items-center">
            <View className="w-9 h-9 rounded-full bg-yellow-50 items-center justify-center mr-3">
              <Bell size={18} color="#eab308" />
            </View>
            <View>
              <Text className="text-base font-semibold text-gray-900">
                Push Notifications
              </Text>
              <Text className="text-xs text-gray-400">
                Likes & comments on your posts
              </Text>
            </View>
          </View>
          <Switch
            value={notificationsEnabled}
            onValueChange={toggleNotifications}
            trackColor={{ false: "#d1d5db", true: "#bfdbfe" }}
            thumbColor={notificationsEnabled ? "#2563eb" : "#9ca3af"}
          />
        </View>
      </View>

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
