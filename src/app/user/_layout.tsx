import ThemedHeader from "@/components/ThemedHeader";
import { Colors } from "@/constants/Colors";
import { Stack } from "expo-router";

export default function UserLayout() {
  return (
    <Stack
      screenOptions={{
        // headerShown: false,
        animation: "slide_from_right",
        animationDuration: 200,
        contentStyle: { backgroundColor: Colors.surface },
      }}
    >
      <Stack.Screen
        name="settings"
        options={{
          header: () => <ThemedHeader goBack title="Settings" basic />,
        }}
      />
      <Stack.Screen
        name="profile"
        options={{
          header: () => <ThemedHeader goBack title="Profile" basic />,
          // contentStyle: { backgroundColor: Colors.surfaceDark },
        }}
      />
      <Stack.Screen
        name="edit-profile"
        options={{
          header: () => <ThemedHeader goBack title="Edit Profile" basic />,
          // contentStyle: { backgroundColor: Colors.surfaceDark },
        }}
      />
    </Stack>
  );
}
