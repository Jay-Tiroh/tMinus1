import { Colors } from "@/constants/Colors";
import { Stack } from "expo-router";

export default function UserLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
        animationDuration: 200,
        contentStyle: { backgroundColor: Colors.surface },
      }}
    >
      <Stack.Screen name="profile" />
    </Stack>
  );
}
