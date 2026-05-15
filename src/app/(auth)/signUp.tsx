import NavHeader from "@/components/auth/NavHeader";
import SignUpForm from "@/components/auth/SignUpForm";
import { ThemedView } from "@/components/ThemedView";
import { Spacing } from "@/constants/Spacing";
import React from "react";
import { ScrollView, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const SignUp = () => {
  const insets = useSafeAreaInsets();
  return (
    <ThemedView avoiding style={[styles.container, { paddingTop: insets.top }]}>
      <NavHeader title="Sign Up" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: Spacing.lg,
          flexGrow: 1,
          width: "100%",
        }}
      >
        <SignUpForm />
      </ScrollView>
    </ThemedView>
  );
};

export default SignUp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    // alignItems: "center",
    width: "100%",
  },
  content: {
    flex: 1,
    // justifyContent: "center",
    // alignItems: "center",
    width: "100%",
  },
});
