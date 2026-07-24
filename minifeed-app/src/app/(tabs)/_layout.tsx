import { Tabs } from "expo-router";
import { Home, PlusSquare, Settings } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Platform } from "react-native";

export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#2563eb",
        tabBarInactiveTintColor: "#6b7280",
        tabBarStyle: {
          paddingBottom: Platform.OS === 'ios' ? insets.bottom : insets.bottom + 6,
          paddingTop: 6,
          height: 60 + insets.bottom,
        },
      }}
    >
      <Tabs.Screen
        name="feed"
        options={{
          title: "MiniFeed",
          tabBarLabel: "Feed",
          tabBarIcon: ({ color, size }) => (
            <Home size={size || 24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          title: "Create Post",
          tabBarLabel: "Create",
          tabBarIcon: ({ color, size }) => (
            <PlusSquare size={size || 24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarLabel: "Settings",
          tabBarIcon: ({ color, size }) => (
            <Settings size={size || 24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
