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
import { Eye, EyeOff } from "lucide-react-native";
import { useDispatch } from "react-redux";
import { useSignupMutation } from "@/store/api/authApi";
import { setCredentials } from "@/store/authSlice";
import type { AppDispatch } from "@/store/index";

export default function SignupScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const [signup, { isLoading }] = useSignupMutation();
  const insets = useSafeAreaInsets();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSignup = async () => {
    if (!username.trim() || !email.trim() || !password.trim()) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
    if (!passwordRegex.test(password)) {
      Alert.alert(
        "Weak Password",
        "Password must be at least 8 characters long and include an uppercase letter, a lowercase letter, a number, and a special character."
      );
      return;
    }

    try {
      const result = await signup({
        username: username.trim(),
        email: email.trim(),
        password,
      }).unwrap();
      dispatch(setCredentials({ token: result.token, user: result.user }));
      router.replace("/(tabs)/feed");
    } catch (error: unknown) {
      const message =
        (error as { data?: { message?: string } })?.data?.message ??
        "Signup failed. Please try again.";
      Alert.alert("Signup Failed", message);
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
              Create account
            </Text>
            <Text className="text-gray-500 mb-8">Join MiniFeed today</Text>

            <Text className="text-sm font-medium text-gray-700 mb-1">Username</Text>
            <TextInput
              className="border border-gray-300 rounded-xl px-4 py-3.5 mb-4 text-gray-900 bg-gray-50"
              placeholder="yourname"
              placeholderTextColor="#9ca3af"
              autoCapitalize="none"
              value={username}
              onChangeText={setUsername}
            />

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
            <View className="relative mb-6">
              <TextInput
                className="border border-gray-300 rounded-xl px-4 py-3.5 text-gray-900 bg-gray-50 pr-12"
                placeholder="Min 8 chars, 1 uppercase, 1 special"
                placeholderTextColor="#9ca3af"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-4"
                activeOpacity={0.7}
              >
                {showPassword ? (
                  <EyeOff size={20} color="#9ca3af" />
                ) : (
                  <Eye size={20} color="#9ca3af" />
                )}
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              onPress={handleSignup}
              disabled={isLoading}
              className="bg-blue-600 rounded-xl py-4 items-center mb-6"
              activeOpacity={0.8}
            >
              {isLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white font-semibold text-base">
                  Create Account
                </Text>
              )}
            </TouchableOpacity>

            <View className="flex-row justify-center">
              <Text className="text-gray-500">Already have an account? </Text>
              <Link href="/(auth)/login">
                <Text className="text-blue-600 font-semibold">Sign In</Text>
              </Link>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
