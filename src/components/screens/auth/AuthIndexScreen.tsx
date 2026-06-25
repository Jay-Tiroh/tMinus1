import SignInForm from "@/components/auth/SignInForm";
import SignUpForm from "@/components/auth/SignUpForm"; // Assuming you rename EmailMobile to this
import { Spacer } from "@/components/Spacer";
import TextBlock from "@/components/TextBlock";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { Spacing } from "@/constants/Spacing";
import React, { useRef, useState } from "react";
import {
  Dimensions,
  ImageBackground,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const AuthIndexScreen = () => {
  const insets = useSafeAreaInsets();
  const scrollRef = useRef<ScrollView>(null);
  const [page, setPage] = useState<"sign in" | "sign up">("sign in");

  const handleTabPress = (newPage: "sign in" | "sign up") => {
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

  const titles = {
    "sign in": {
      title: "Sign in",
      body: "Use your email or phone number to access your portfolio.",
    },
    "sign up": {
      title: "Create account",
      body: "Start your crypto trading sandbox with secure identity checks.",
    },
  };

  return (
    <ImageBackground
      source={require("@/assets/images/new-bg.png")}
      style={[styles.container, { paddingTop: insets.top + 24 }]}
    >
      <ThemedView avoiding style={{ flex: 1, backgroundColor: "transparent" }}>
        {/* Dynamic Header */}
        <View style={{ paddingHorizontal: Spacing.lg }}>
          <TextBlock
            title={titles[page].title}
            body={titles[page].body}
            titleStyle={{ fontSize: 32 }}
            bodyStyle={{ fontSize: 14, lineHeight: 20 }}
          />
        </View>

        <Spacer size={32} />

        {/* Segmented Control Tabs */}
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

        <Spacer size={32} />

        {/* Paged horizontal scroll */}
        <ScrollView
          ref={scrollRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          scrollEventThrottle={16}
          onMomentumScrollEnd={handleMomentumScrollEnd}
          contentContainerStyle={{ flexGrow: 1 }}
        >
          <View style={{ width: SCREEN_WIDTH, paddingHorizontal: Spacing.lg }}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scrollContent}
            >
              <SignInForm />
            </ScrollView>
          </View>
          <View style={{ width: SCREEN_WIDTH, paddingHorizontal: Spacing.lg }}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scrollContent}
            >
              <SignUpForm />
            </ScrollView>
          </View>
        </ScrollView>
      </ThemedView>
    </ImageBackground>
  );
};

export default AuthIndexScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    paddingBottom: Spacing.lg + 50,
    flexGrow: 1,
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: Colors.surfaceNavy,
    borderRadius: 14,
    padding: 4,
    height: 48,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },
  activeTab: {
    backgroundColor: Colors.surfaceDark,
  },
  tabText: {
    color: Colors.textMidGray,
    fontSize: 14,
    fontWeight: "500",
  },
  activeTabText: {
    color: Colors.snowGray,
    fontSize: 14,
    fontWeight: "600",
  },
});
