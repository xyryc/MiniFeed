import { useEffect, useState } from "react";
import { Stack, useRouter, useSegments } from "expo-router";
import { Provider, useDispatch, useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { store, RootState, AppDispatch } from "@/store/index";
import { restoreSession } from "@/store/authSlice";
import type { AuthUser } from "@/store/authSlice";
import "../../global.css";

function useProtectedRoute(token: string | null, isRestoring: boolean) {
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isRestoring) return;

    const inAuthGroup = segments[0] === "(auth)";

    if (!token && !inAuthGroup) {
      // Redirect to login if not logged in and trying to access app
      router.replace("/(auth)/login");
    } else if (token && inAuthGroup) {
      // Redirect to feed only if logged in AND currently on login/signup screen
      router.replace("/(tabs)/feed");
    }
  }, [token, isRestoring, segments]);
}

function RootNavigator() {
  const dispatch = useDispatch<AppDispatch>();
  const token = useSelector((state: RootState) => state.auth.token);
  const [isRestoring, setIsRestoring] = useState(true);

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
        // no saved session
      } finally {
        setIsRestoring(false);
      }
    };
    restoreFromStorage();
  }, [dispatch]);

  useProtectedRoute(token, isRestoring);

  return <Stack screenOptions={{ headerShown: false }} />;
}

export default function RootLayout() {
  return (
    <Provider store={store}>
      <RootNavigator />
    </Provider>
  );
}
