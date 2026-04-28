import Fingerprint from "@/assets/icons/fingerprint.svg";
import CTA from "@/components/auth/CTA";
import { ThemedTextInput } from "@/components/auth/ThemedTextInput";
import { Spacer } from "@/components/Spacer";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { Spacing } from "@/constants/Spacing";
import {
  EmailPasswordFormData,
  MobilePasswordFormData,
  emailPasswordSchema,
  mobilePasswordSchema,
} from "@/schemas/authSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { StyleSheet, View } from "react-native";

type FormData = EmailPasswordFormData | MobilePasswordFormData;

export default function SignInForm() {
  const [isEmail, setIsEmail] = useState(true);

  const { control, handleSubmit, reset } = useForm<FormData>({
    resolver: zodResolver(isEmail ? emailPasswordSchema : mobilePasswordSchema),
  });

  const onSubmit = (data: FormData) => {
    console.log(data);
  };

  const handleToggle = () => {
    reset();
    setIsEmail((prev) => !prev);
  };

  return (
    <View style={styles.container}>
      <ThemedText
        size={32}
        weight="bold"
        style={{ color: Colors.white, lineHeight: 46, alignSelf: "flex-start" }}
      >
        Sign In
      </ThemedText>

      <Spacer size={44} />

      <View style={{ gap: Spacing.lg, width: "100%" }}>
        <View style={styles.inputContainer}>
          <View style={styles.labelRow}>
            <ThemedText size={14} style={styles.label}>
              {isEmail ? "Email" : "Mobile Number"}
            </ThemedText>
            <ThemedText
              size={14}
              style={{ color: Colors.primary }}
              onPress={handleToggle}
            >
              {isEmail ? "Sign in with mobile" : "Sign in with email"}
            </ThemedText>
          </View>

          {isEmail ? (
            <ThemedTextInput
              control={control}
              name="email"
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          ) : (
            <ThemedTextInput
              control={control}
              name="mobileNumber"
              placeholder="Enter your mobile number"
              keyboardType="phone-pad"
              autoCapitalize="none"
            />
          )}
        </View>

        <View style={styles.inputContainer}>
          <ThemedText size={14} style={styles.label}>
            Password
          </ThemedText>
          <ThemedTextInput
            control={control}
            name="password"
            placeholder="Enter your password"
          />
          <ThemedText size={14} style={{ color: Colors.primary }}>
            Forgot password?
          </ThemedText>
        </View>
      </View>

      <Spacer size={40} />
      <CTA page="signin" onPress={handleSubmit(onSubmit)} />
      <Spacer size={55} />

      <View style={{ gap: 20, alignItems: "center" }}>
        <Fingerprint color={Colors.primary} style={{ width: 40, height: 40 }} />
        <ThemedText
          size={14}
          letterSpacing={2.64}
          style={{ color: Colors.textSecondary }}
        >
          Use fingerprint instead?
        </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    alignItems: "center",
  },
  inputContainer: {
    width: "100%",
    gap: 12,
  },
  labelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  label: {
    color: Colors.textSecondary,
  },
});
