import { Colors } from "@/constants/Colors";
import { Stack } from "expo-router";

export default function TradesLayout() {
  return (
    <Stack
      screenOptions={{
        animation: "slide_from_right", // smooth horizontal slide
        animationDuration: 200,
        contentStyle: { backgroundColor: Colors.surface },
        headerShown: false,
      }}
      initialRouteName="asset"
    >
      <Stack.Screen name="asset" />
    </Stack>
  );
}
