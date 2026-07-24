import { useEffect, useState } from "react";
import { Stack, useRouter, useSegments, useRootNavigationState } from "expo-router";
import { Provider, useDispatch, useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { store, RootState, AppDispatch } from "@/store/index";
import { restoreSession } from "@/store/authSlice";
import type { AuthUser } from "@/store/authSlice";
import { useUpdateFcmTokenMutation } from "@/store/api/authApi";
import "../../global.css";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

function ProtectedLayout() {
  const dispatch = useDispatch<AppDispatch>();
  const token = useSelector((state: RootState) => state.auth.token);
  const [isRestoring, setIsRestoring] = useState(true);
  const segments = useSegments();
  const router = useRouter();
  const navigationState = useRootNavigationState();
  const [updateFcmToken] = useUpdateFcmTokenMutation();

  useEffect(() => {
    const restoreFromStorage = async () => {
      try {
        const savedToken = await AsyncStorage.getItem("token");
        const savedUser = await AsyncStorage.getItem("user");
        if (savedToken && savedUser) {
          dispatch(
            restoreSession({
              token: savedToken,
              user: JSON.parse(savedUser) as AuthUser,
            })
          );
        }
      } catch {
        // no session
      } finally {
        setIsRestoring(false);
      }
    };
    restoreFromStorage();
  }, [dispatch]);

  useEffect(() => {
    if (isRestoring || !navigationState?.key) return;

    const inAuthGroup = segments[0] === "(auth)";

    if (!token && !inAuthGroup) {
      router.replace("/(auth)/login");
    } else if (token && inAuthGroup) {
      router.replace("/(tabs)/feed");
    }
  }, [token, isRestoring, segments[0], navigationState?.key]);

  useEffect(() => {
    async function registerForPushNotifications() {
      if (!token) return;

      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      
      if (finalStatus !== "granted") {
        await AsyncStorage.setItem("notificationsEnabled", "false");
        return;
      }

      try {
        const pushTokenData = await Notifications.getDevicePushTokenAsync();
        await updateFcmToken({ token: pushTokenData.data }).unwrap();
        await AsyncStorage.setItem("notificationsEnabled", "true");
        console.log("FCM Token saved successfully");
      } catch (e) {
        console.error("Failed to save FCM token", e);
      }
    }

    registerForPushNotifications();
  }, [token]);

  return <Stack screenOptions={{ headerShown: false }} />;
}

export default function RootLayout() {
  return (
    <Provider store={store}>
      <ProtectedLayout />
    </Provider>
  );
}
