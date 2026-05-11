import Avatar from "@/assets/icons/home/menu/avatar.svg";
import Copy from "@/assets/icons/home/menu/copy.svg";
import { ThemedButton } from "@/components/ThemedButton";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { useAppSelector } from "@/store/hooks";
import { selectIsMenuOpen } from "@/store/slices/MenuSlice";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";
// import * as Clipboard from "expo-clipboard";
const MENU_HEIGHT = 90;

const MenuTab = () => {
  const name = useAppSelector((state) => state.auth.user?.fullName);
  const displayName = name ? name.split(" ")[0] : "User123";
  const id = useAppSelector((state) => state.auth.user?.id);

  const navigation = useRouter();

  const isOpen = useAppSelector(selectIsMenuOpen);
  const heightAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(heightAnim, {
      toValue: isOpen ? MENU_HEIGHT : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [isOpen]);

  return (
    <Animated.View style={{ height: heightAnim, overflow: "hidden" }}>
      <LinearGradient
        colors={[Colors.surface, Colors.primary + "1A"]}
        style={styles.container}
      >
        <View style={styles.userDetails}>
          <Avatar />
          <View style={styles.userInfo}>
            <ThemedText
              weight="bold"
              size={18}
              letterSpacing={2.64}
              style={{ color: Colors.white }}
            >
              {displayName}
            </ThemedText>
            <View
              style={{ gap: 4, flexDirection: "row", alignItems: "center" }}
            >
              <ThemedText
                weight="regular"
                size={14}
                letterSpacing={2.64}
                style={{ color: Colors.textMuted }}
              >
                ID: {id ? id : "1234567890"}
              </ThemedText>
              <Copy />
            </View>
          </View>
        </View>
        <ThemedButton
          title={"Edit Profile"}
          variant="primary"
          style={styles.button}
          onPress={() => navigation.navigate("/user/edit-profile")}
          textStyle={{ fontSize: 14, letterSpacing: 14 * 0.0264 }}
        />
      </LinearGradient>
    </Animated.View>
  );
};

export default MenuTab;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: MENU_HEIGHT,
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    padding: 24,
  },
  userDetails: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  userInfo: {
    justifyContent: "space-between",
  },
  button: {
    boxShadow: "0 20px 60px rgba(94, 213, 168, .16)",
    width: 104,
    height: 33,
  },
});
