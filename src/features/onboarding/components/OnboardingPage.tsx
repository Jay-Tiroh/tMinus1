import { Colors } from "@/constants/Colors";
import { Spacing } from "@/constants/Spacing";
import { Spacer } from "@/shared/components/Spacer";
import { ThemedText } from "@/shared/components/ThemedText";
import { ms, s, vs } from "@/shared/utils/responsive";
import React from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import type { OnboardingPageConfig } from "../types/onboarding.types";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

type OnboardingPageProps = {
  page: OnboardingPageConfig;
};

export const OnboardingPage = ({ page }: OnboardingPageProps) => {
  const Illustration = page.image;

  return (
    <View style={styles.page}>
      <Illustration style={styles.ill} />
      <Spacer size={55} />
      <View style={styles.textContainer}>
        <ThemedText style={[styles.title, styles.text]}>
          {page.title}
        </ThemedText>
        <ThemedText style={[styles.subtitle, styles.text]}>
          {page.subtitle}
        </ThemedText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  page: {
    width: SCREEN_WIDTH,
    alignItems: "center",
    justifyContent: "flex-end",
    paddingTop: vs(60),
  },
  text: {
    textAlign: "center",
    maxWidth: s(366),
  },
  title: {
    color: Colors.white,
    fontSize: ms(24),
    letterSpacing: 0.0264 * 24,
  },
  subtitle: {
    color: Colors.textMuted,
    fontSize: ms(18),
    letterSpacing: 0.0264 * 18,
  },
  ill: {
    width: "100%",
    height: vs(387),
  },
  textContainer: {
    alignItems: "center",
    paddingHorizontal: s(20),
    gap: vs(Spacing.lg),
  },
});
