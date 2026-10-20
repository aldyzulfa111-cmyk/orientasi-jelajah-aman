// app/(tabs)/_layout.tsx
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ headerShown: true }}>
      <Tabs.Screen name="index" options={{ title: "Beranda" }} />
      <Tabs.Screen name="riwayat" options={{ title: "Riwayat" }} />
      <Tabs.Screen name="pengaturan" options={{ title: "Pengaturan" }} />
      <Tabs.Screen name="tentang" options={{ title: "Tentang" }} />
      <Tabs screenOptions={{ tabBarActiveTintColor: "#007AFF" }}>
        <Tabs.Screen
          name="index"
          options={{
            title: "Beranda",
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? "home" : "home-outline"}
                size={24}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="riwayat" // atau nama file tab riwayat kamu
          options={{
            title: "Riwayat",
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? "time" : "time-outline"}
                size={24}
                color={color}
              />
            ),
          }}
        />
        {/* Lakukan hal serupa untuk tab pengaturan dan tentang */}
      </Tabs>
    </Tabs>
  );
}
