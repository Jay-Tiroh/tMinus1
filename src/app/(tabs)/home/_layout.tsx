import { Colors } from "@/constants/Colors";
import { Stack } from "expo-router";

export default function HomeLayout() {
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

      <Stack.Screen
        name="notifications"
        options={{
          headerShown: false,
          contentStyle: { backgroundColor: Colors.surfaceDark },
        }}
      />
    </Stack>
  );
}
