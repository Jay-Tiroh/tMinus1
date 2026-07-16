import Back from "@/assets/icons/back.svg";
import Bell from "@/assets/icons/bell.svg";
import Candle from "@/assets/icons/candle.svg";
import DollarCircle from "@/assets/icons/dollar-circle.svg";
import Menu from "@/assets/icons/menu.svg";
import Scanner from "@/assets/icons/scanner.svg";
import Star from "@/assets/icons/star.svg";
import { ThemedText } from "@/shared/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { useAppDispatch } from "@/store/hooks";
import { toggleMenu } from "@/store/slices/MenuSlice";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Href, useRouter } from "expo-router";
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

  const dispatch = useAppDispatch();
  const handleToggleMenu = () => {
    dispatch(toggleMenu());
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

      {/* headerRight */}
      {headerRight === "normal" ? (
        <NormalRight />
      ) : headerRight === "trade" ? (
        <TradeRight />
      ) : headerRight === "menu" ? (
        <Menu width={15} height={15} onPress={handleToggleMenu} hitSlop={20} />
      ) : null}
    </ThemedView>
  );
};

const NormalRight = () => {
  const router = useRouter();
  const pushTo = (route: Href) => {
    router.replace(route);
  };
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 34 }}>
      <Ionicons
        name="settings-outline"
        size={24}
        color={Colors.profit}
        hitSlop={10}
        onPress={() => pushTo("/user/settings")}
      />
      <Scanner onPress={() => pushTo("/kyc")} hitSlop={10} />
      <Bell onPress={() => pushTo("/home/notifications")} hitSlop={10} />
    </View>
  );
};
const TradeRight = () => {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 34 }}>
      <Candle hitSlop={10} />
      <DollarCircle hitSlop={10} />
      <Star hitSlop={10} />
    </View>
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
