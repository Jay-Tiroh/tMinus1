import Back from "@/assets/icons/back.svg";
import Bell from "@/assets/icons/bell.svg";
import Candle from "@/assets/icons/candle.svg";
import DollarCircle from "@/assets/icons/dollar-circle.svg";
import Menu from "@/assets/icons/menu.svg";
import Scanner from "@/assets/icons/scanner.svg";
import Search from "@/assets/icons/search.svg";
import Star from "@/assets/icons/star.svg";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { useAppDispatch } from "@/store/hooks";
import { toggleMenu } from "@/store/slices/MenuSlice";
import { Href, useRouter } from "expo-router";
import React from "react";
import { Image, Pressable, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface ThemedHeaderProps {
  goBack?: true;
  title?: string;
  avatar?: boolean;
  onGoBack?: () => void;
  headerLeft?: React.ReactNode;
  headerRight?: "normal" | "trade" | "menu";
}

const ThemedHeader = ({
  goBack,
  title,
  avatar,
  onGoBack,
  headerLeft,
  headerRight,
}: ThemedHeaderProps) => {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const handleGoBack = () => {
    router.back();
  };

  const dispatch = useAppDispatch();
  const handleToggleMenu = () => {
    dispatch(toggleMenu());
  };
  return (
    <ThemedView safe style={[styles.container, { paddingTop: 40 }]}>
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
    router.push(route);
  };
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 34 }}>
      <Search hitSlop={10} />
      <Scanner onPress={() => pushTo("/wallets/scanQr")} hitSlop={10} />
      <Bell onPress={() => pushTo("/home/notifications")} hitSlop={10} />
    </View>
  );
};
const TradeRight = () => {
  const router = useRouter();
  const pushTo = (route: Href) => {
    router.push(route);
  };
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
    backgroundColor: Colors.surface,
    // flex: 1,
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
