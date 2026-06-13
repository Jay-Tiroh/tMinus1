import { Colors } from "@/constants/Colors";
import { Stack } from "expo-router";

export default function DepositLayout() {
  return (
    <Stack
      screenOptions={{
        animation: "slide_from_right", // smooth horizontal slide
        animationDuration: 200,
        contentStyle: { backgroundColor: Colors.surface },
        headerShown: false,
      }}
    >
      <Stack.Screen name="deposit-asset-selection" />
      <Stack.Screen name="deposit-address" />
      <Stack.Screen name="simulate-deposit" />
    </Stack>
  );
}
