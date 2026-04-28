import Cross from "@/assets/icons/cross.svg";
import SignInForm from "@/components/auth/SignInForm";
import SignUpForm from "@/components/auth/SignUpForm";
import { Spacer } from "@/components/Spacer";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { Spacing } from "@/constants/Spacing";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useRef } from "react";
import {
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const AuthScreen = () => {
  const insets = useSafeAreaInsets();
  const scrollRef = useRef<ScrollView>(null);
  const [page, setPage] = React.useState<"sign in" | "sign up">("sign in");

  const handleTabPress = (newPage: "sign in" | "sign up") => {
    // Only scroll — let onMomentumScrollEnd update the tab state
    scrollRef.current?.scrollTo({
      x: newPage === "sign in" ? 0 : SCREEN_WIDTH,
      animated: true,
    });
  };

  const handleMomentumScrollEnd = (
    e: NativeSyntheticEvent<NativeScrollEvent>,
  ) => {
    const x = e.nativeEvent.contentOffset.x;
    setPage(x < SCREEN_WIDTH / 2 ? "sign in" : "sign up");
  };

  const navigation = useRouter();
  return (
    <ThemedView
      style={[
        styles.container,
        {
          paddingTop: insets.top,
          paddingLeft: insets.left,
          paddingRight: insets.right,
        },
      ]}
    >
      <LinearGradient
        colors={["transparent", Colors.surfaceCard]}
        locations={[0, 0.9]}
        style={{ width: "100%", flex: 1, paddingBottom: insets.bottom }}
      >
        <View style={{ padding: Spacing.lg }}>
          <Cross color={Colors.textMuted} onPress={() => navigation.back()} />
        </View>

        <Spacer size={34} />

        {/* Tabs */}
        <View style={{ paddingHorizontal: Spacing.lg }}>
          <View style={styles.tabContainer}>
            <Pressable
              style={[styles.tab, page === "sign in" && styles.activeTab]}
              onPress={() => handleTabPress("sign in")}
            >
              <ThemedText
                style={
                  page === "sign in" ? styles.activeTabText : styles.tabText
                }
              >
                Sign in
              </ThemedText>
            </Pressable>
            <Pressable
              style={[styles.tab, page === "sign up" && styles.activeTab]}
              onPress={() => handleTabPress("sign up")}
            >
              <ThemedText
                style={
                  page === "sign up" ? styles.activeTabText : styles.tabText
                }
              >
                Sign up
              </ThemedText>
            </Pressable>
          </View>
        </View>

        <Spacer size={40} />

        {/* Paged horizontal scroll */}
        <ScrollView
          ref={scrollRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          scrollEventThrottle={16}
          onMomentumScrollEnd={handleMomentumScrollEnd}
        >
          <View style={{ width: SCREEN_WIDTH }}>
            <ScrollView>
              <SignInForm />
            </ScrollView>
          </View>
          <View style={{ width: SCREEN_WIDTH }}>
            <ScrollView>
              <SignUpForm />
            </ScrollView>
          </View>
        </ScrollView>
      </LinearGradient>
    </ThemedView>
  );
};

export default AuthScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Spacing.xs,
    backgroundColor: Colors.surfaceCard,
    height: 46,
    borderRadius: 16,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    height: 38,
  },
  activeTab: {
    backgroundColor: Colors.surface,
  },
  tabText: {
    color: Colors.textMuted,
    fontSize: 14,
  },
  activeTabText: {
    color: Colors.textFaint,
    fontSize: 14,
  },
});
