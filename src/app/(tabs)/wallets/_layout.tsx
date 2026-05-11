import ThemedHeader from "@/components/ThemedHeader";
import { Colors } from "@/constants/Colors";
import { Stack } from "expo-router";

export default function WalletsLayout() {
  return (
    <Stack
      screenOptions={{
        animation: "slide_from_right", // smooth horizontal slide
        animationDuration: 200,
        contentStyle: { backgroundColor: Colors.surface },
        header: () => <ThemedHeader avatar headerRight="normal" />,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="myQr" />
      <Stack.Screen name="scanQr" />
    </Stack>
  );
}
