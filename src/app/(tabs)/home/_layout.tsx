import ThemedHeader from "@/components/ThemedHeader";
import { Colors } from "@/constants/Colors";
import { Stack } from "expo-router";

export default function HomeLayout() {
  return (
    <Stack
      screenOptions={{
        animation: "slide_from_right", // smooth horizontal slide
        animationDuration: 200,
        contentStyle: { backgroundColor: Colors.surface },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          header: () => <ThemedHeader avatar headerRight="normal" />,
        }}
      />
      <Stack.Screen
        name="menu"
        options={{
          header: () => <ThemedHeader goBack title="Menu" headerRight="menu" />,
          contentStyle: { backgroundColor: Colors.surfaceDark },
        }}
      />
      <Stack.Screen
        name="notifications"
        options={{
          header: () => <ThemedHeader avatar headerRight="normal" />,
          contentStyle: { backgroundColor: Colors.surfaceDark },
        }}
      />
    </Stack>
  );
}
