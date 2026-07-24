import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Link, router } from "expo-router";
import { useDispatch } from "react-redux";
import { useLoginMutation } from "@/store/api/authApi";
import { setCredentials } from "@/store/authSlice";
import type { AppDispatch } from "@/store/index";

export default function LoginScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const [login, { isLoading }] = useLoginMutation();
  const insets = useSafeAreaInsets();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    try {
      const result = await login({ email: email.trim(), password }).unwrap();
      dispatch(setCredentials({ token: result.token, user: result.user }));
      router.replace("/(tabs)/feed");
    } catch (error: unknown) {
      const message =
        (error as { data?: { message?: string } })?.data?.message ??
        "Login failed. Please try again.";
      Alert.alert("Login Failed", message);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#ffffff" }}
      behavior="padding"
      keyboardVerticalOffset={Platform.OS === "ios" ? insets.top : insets.bottom}
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: 24,
          paddingTop: insets.top + 40,
          paddingBottom: insets.bottom + 32,
        }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View>
            <Text className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back
            </Text>
            <Text className="text-gray-500 mb-8">Sign in to your account</Text>

            <Text className="text-sm font-medium text-gray-700 mb-1">Email</Text>
            <TextInput
              className="border border-gray-300 rounded-xl px-4 py-3.5 mb-4 text-gray-900 bg-gray-50"
              placeholder="you@example.com"
              placeholderTextColor="#9ca3af"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />

            <Text className="text-sm font-medium text-gray-700 mb-1">Password</Text>
            <TextInput
              className="border border-gray-300 rounded-xl px-4 py-3.5 mb-6 text-gray-900 bg-gray-50"
              placeholder="Enter your password"
              placeholderTextColor="#9ca3af"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />

            <TouchableOpacity
              onPress={handleLogin}
              disabled={isLoading}
              className="bg-blue-600 rounded-xl py-4 items-center mb-6"
              activeOpacity={0.8}
            >
              {isLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white font-semibold text-base">Sign In</Text>
              )}
            </TouchableOpacity>

            <View className="flex-row justify-center">
              <Text className="text-gray-500">Don't have an account? </Text>
              <Link href="/(auth)/signup">
                <Text className="text-blue-600 font-semibold">Sign Up</Text>
              </Link>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
