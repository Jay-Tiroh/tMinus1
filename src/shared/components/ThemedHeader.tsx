import Back from "@/assets/icons/back.svg";
import { Colors } from "@/constants/Colors";
import { ThemedText } from "@/shared/components/ThemedText";
import { ThemedView } from "@/shared/components/ThemedView";
import { useRouter } from "expo-router";
import React from "react";
import { Image, Pressable, StyleSheet, View } from "react-native";
interface ThemedHeaderProps {
  goBack?: true;
  title?: string;
  avatar?: boolean;
  onGoBack?: () => void;
  headerLeft?: React.ReactNode;
  headerRight?: "normal" | "trade" | "menu";
  basic?: boolean;
}

const ThemedHeader = ({
  goBack,
  title,
  avatar,
  onGoBack,
  headerLeft,
  headerRight,
  basic,
}: ThemedHeaderProps) => {
  const router = useRouter();
  const handleGoBack = () => {
    router.back();
  };

  return (
    <ThemedView
      safe
      style={[
        styles.container,
        {
          paddingTop: 40,
          boxShadow: basic ? "none" : "0px 12px 10px rgba(0, 0, 0, 0.1)",
        },
      ]}
    >
      {/* headerLeft */}
      {headerLeft && <>{headerLeft}</>}

      {/* Avatar */}
      {avatar && (
        <Pressable onPress={() => router.navigate("/user/profile")}>
          <Image source={require("@/assets/images/avatar.png")} />
        </Pressable>
      )}

      {/* Title + back button */}
      <View style={styles.titleContainer}>
        {goBack && (
          <Back
            color={Colors.textMuted}
            onPress={onGoBack ?? handleGoBack}
            hitSlop={20}
          />
        )}
        {title && (
          <ThemedText
            size={18}
            weight="bold"
            letterSpacing={2.64}
            style={{
              color: Colors.white,
            }}
          >
            {title}
          </ThemedText>
        )}
      </View>
    </ThemedView>
  );
};

export default ThemedHeader;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingBottom: 0,
    backgroundColor: Colors.backgroundDark + "cc",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
  },
  titleContainer: {
    flexDirection: "row",
    gap: 34,
    alignItems: "center",
  },
});
