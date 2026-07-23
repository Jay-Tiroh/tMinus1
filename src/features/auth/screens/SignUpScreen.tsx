import { Spacing } from "@/constants/Spacing";
import { ThemedView } from "@/shared/components/ThemedView";
import { vs } from "@/utils/responsive";
import React from "react";
import { ScrollView, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import NavHeader from "../components/NavHeader";
import SignUpForm from "../components/SignUpForm";

const SignUpScreen = () => {
  const insets = useSafeAreaInsets();
  return (
    <ThemedView avoiding style={[styles.container, { paddingTop: insets.top }]}>
      <NavHeader title="Sign Up" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: vs(Spacing.lg),
          flexGrow: 1,
          width: "100%",
        }}
      >
        <SignUpForm />
      </ScrollView>
    </ThemedView>
  );
};

export default SignUpScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    width: "100%",
  },
  content: {
    flex: 1,
    width: "100%",
  },
});
