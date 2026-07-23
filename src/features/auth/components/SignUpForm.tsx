import { Colors } from "@/constants/Colors";
import { Spacer } from "@/shared/components/Spacer";
import { ThemedButton } from "@/shared/components/ThemedButton";
import { ThemedText } from "@/shared/components/ThemedText";
import { formatPhoneInternational } from "@/shared/utils/formatPhoneNumber";
import { ms, vs } from "@/shared/utils/responsive";
import Feather from "@expo/vector-icons/Feather";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React from "react";
import { StyleSheet, View } from "react-native";
import { useSignUpFlow } from "../hooks/useSignUpFlow";
import { ThemedInput } from "./ThemedTextInput";

const SignUpForm = () => {
  const { control, isLoading, handleSubmit } = useSignUpFlow();

  return (
    <View style={{ flex: 1 }}>
      <View style={{ gap: vs(16) }}>
        <ThemedInput
          control={control}
          name="fullName"
          icon={<Feather name="user" size={20} color={Colors.primaryClean} />}
          placeholder="Full name"
        />
        <ThemedInput
          control={control}
          name="email"
          icon={<Feather name="mail" size={20} color={Colors.primaryClean} />}
          placeholder="Email address"
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <ThemedInput
          control={control}
          name="phone"
          icon={<Feather name="phone" size={20} color={Colors.primaryClean} />}
          placeholder="Phone number"
          keyboardType="phone-pad"
          formatter={formatPhoneInternational}
        />
        <ThemedInput
          control={control}
          name="password"
          icon={
            <MaterialIcons
              name="lock-outline"
              size={20}
              color={Colors.primaryClean}
            />
          }
          placeholder="Create password"
          secureTextEntry
          hasToggle
        />
        <ThemedInput
          control={control}
          name="confirm"
          icon={
            <MaterialIcons
              name="lock-outline"
              size={20}
              color={Colors.primaryClean}
            />
          }
          placeholder="Confirm password"
          secureTextEntry
          hasToggle
        />
      </View>

      <Spacer size={16} />

      <ThemedText
        color={Colors.textMidGray}
        size={13}
        style={{ lineHeight: ms(18) }}
      >
        Use your real name and an international phone number for verification.
      </ThemedText>

      <Spacer size={32} />

      <ThemedButton
        title={isLoading ? "Signing up..." : "Sign up"}
        variant="primary"
        disabled={isLoading}
        onPress={handleSubmit}
      />

      <Spacer size={40} />

      <View style={styles.centerRow}>
        <ThemedText color={Colors.textMidGray} size={14}>
          Already have an account?{" "}
          <ThemedText
            color={Colors.snowGray}
            weight="medium"
            style={{ padding: ms(4) }}
          >
            Sign in
          </ThemedText>
        </ThemedText>
      </View>
    </View>
  );
};

export default SignUpForm;

const styles = StyleSheet.create({
  centerRow: { alignItems: "center", width: "100%" },
});
