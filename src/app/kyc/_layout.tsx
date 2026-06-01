import { Colors } from "@/constants/Colors";
import { Stack } from "expo-router";

export default function KYCLayout() {
  return (
    <Stack
      screenOptions={{
        animation: "slide_from_right",
        animationDuration: 200,
        contentStyle: { backgroundColor: Colors.surface },
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" />
    </Stack>
  );
}
