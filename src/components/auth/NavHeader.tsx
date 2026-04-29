import Back from "@/assets/icons/back.svg";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { Spacing } from "@/constants/Spacing";
import { useRouter } from "expo-router";
import { View } from "react-native";
export default function NavHeader({ title }: { title: string }) {
  const router = useRouter();
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 33,
        padding: Spacing.lg,
      }}
    >
      <Back
        onPress={() => router.back()}
        color={Colors.textMuted}
        hitSlop={30}
      />
      <ThemedText
        size={18}
        letterSpacing={2.64}
        weight="bold"
        style={{ color: Colors.textSecondary }}
      >
        {title}
      </ThemedText>
    </View>
  );
}
