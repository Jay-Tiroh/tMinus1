import { Colors } from "@/constants/Colors";
import { Stack } from "expo-router";

export default function MarketsLayout() {
  return (
    <Stack
      screenOptions={{
        animation: "slide_from_right", // smooth horizontal slide
        animationDuration: 200,
        contentStyle: { backgroundColor: Colors.surface },
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="trending" />
      <Stack.Screen name="watchlist" />
    </Stack>
  );
}
