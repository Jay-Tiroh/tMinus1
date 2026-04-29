import { Colors } from "@/constants/Colors";
import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right", // smooth horizontal slide
        animationDuration: 200,
        contentStyle: { backgroundColor: Colors.surface },
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="register-mobile" />
      <Stack.Screen name="verify" />
    </Stack>
  );
}
