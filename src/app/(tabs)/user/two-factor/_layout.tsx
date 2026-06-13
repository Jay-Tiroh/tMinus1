import { Colors } from "@/constants/Colors";
import { Stack } from "expo-router";

export default function TwoFactorAuthLayout() {
  return (
    <Stack
      screenOptions={{
        animation: "slide_from_right", // smooth horizontal slide
        animationDuration: 200,
        contentStyle: { backgroundColor: Colors.surface },
        headerShown: false,
      }}
    >
      <Stack.Screen name="disable" />
      <Stack.Screen name="setup" />
      <Stack.Screen name="recovery-codes" />
    </Stack>
  );
}
