import Facebook from "@/assets/icons/facebook.svg";
import Google from "@/assets/icons/google.svg";
import { ThemedButton } from "@/components/ThemedButton";
import { Colors } from "@/constants/Colors";
import { ms, s, vs } from "@/utils/responsive";
import React from "react";
import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { ThemedText } from "../ThemedText";

const CTA = ({
  onPress,
  page,
  isLoading,
}: {
  onPress: () => void;
  page: "signin" | "signup" | "mobile" | "verify";
  isLoading?: boolean;
}) => {
  const title = {
    signin: "Sign in",
    signup: "Sign up",
    mobile: "Send OTP",
    verify: "Continue",
  };
  return (
    <View style={styles.container}>
      <ThemedButton
        title={title[page]}
        variant="primary"
        onPress={onPress}
        disabled={isLoading}
        iconComponent={
          isLoading && <ActivityIndicator color={Colors.surface} />
        }
        textStyle={{ marginLeft: s(20) }}
      />

      {page !== "mobile" && page !== "verify" && (
        <>
          <ThemedText
            size={14}
            letterSpacing={2.64}
            style={{ color: Colors.textMuted }}
          >
            Or {page === "signin" ? "login" : "sign up"} with
          </ThemedText>
          <View style={styles.socials}>
            <TouchableOpacity style={styles.socialButton}>
              <Facebook style={styles.icon} />
              <ThemedText>Facebook</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton}>
              <Google style={styles.icon} />
              <ThemedText>Google</ThemedText>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
};

export default CTA;

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // justifyContent: "center",
    width: "100%",
    alignItems: "center",
    gap: s(20),
  },
  socials: {
    flexDirection: "row",
    // gap: 20,
    justifyContent: "space-between",
    width: "100%",
    maxWidth: s(600),
  },
  socialButton: {
    borderRadius: ms(16),
    backgroundColor: Colors.white,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: s(10),
    height: vs(54),
    width: "48%",
  },
  icon: {
    width: ms(26),
    height: ms(26),
  },
});
