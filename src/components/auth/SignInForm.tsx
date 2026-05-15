import Fingerprint from "@/assets/icons/fingerprint.svg";
import CTA from "@/components/auth/CTA";
import { ThemedTextInput } from "@/components/auth/ThemedTextInput";
import { Spacer } from "@/components/Spacer";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { Spacing } from "@/constants/Spacing";
import {
  EmailPasswordFormData,
  emailPasswordSchema,
  MobilePasswordFormData,
  mobilePasswordSchema,
} from "@/schemas/authSchemas";
import { useAppDispatch } from "@/store/hooks";
import {
  useLoginEmailMutation,
  useLoginMobileMutation,
} from "@/store/services/authApi";
import { setCredentials } from "@/store/slices/authSlice";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { StyleSheet, View } from "react-native";

type FormData = EmailPasswordFormData | MobilePasswordFormData;

export default function SignInForm() {
  const [isEmail, setIsEmail] = useState(true);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const { control, handleSubmit, reset } = useForm<FormData>({
    resolver: zodResolver(isEmail ? emailPasswordSchema : mobilePasswordSchema),
    mode: "onChange",
  });

  // API Mutations
  const [
    loginEmail,
    { isLoading: isLoadingEmail, isError: isErrorEmail, error: errorEmail },
  ] = useLoginEmailMutation();

  const [
    loginMobile,
    { isLoading: isLoadingMobile, isError: isErrorMobile, error: errorMobile },
  ] = useLoginMobileMutation();

  const onSubmit = async (data: FormData) => {
    const result = await (isEmail ? loginEmail(data) : loginMobile(data));
    if ("data" in result && result.data) {
      dispatch(setCredentials(result.data));
      router.replace("/(tabs)/home");
    }
  };

  const handleToggle = () => {
    reset();
    setIsEmail((prev) => !prev);
  };

  const isLoading = isLoadingEmail || isLoadingMobile;
  const isError = isErrorEmail || isErrorMobile;
  const error = errorEmail || errorMobile;

  return (
    <View style={styles.container}>
      <ThemedText size={32} weight="bold" style={styles.headerText}>
        Sign In
      </ThemedText>

      <Spacer size={14} />

      {isError && (
        <ThemedText color={Colors.lossAlt} style={styles.errorText}>
          {(error as any)?.data?.message ?? "Something went wrong"}
        </ThemedText>
      )}

      <Spacer size={44} />

      <View style={styles.formFields}>
        {/* Identity Input (Email or Mobile) */}
        <View style={styles.inputContainer}>
          <View style={styles.labelRow}>
            <ThemedText size={14} style={styles.label}>
              {isEmail ? "Email" : "Mobile Number"}
            </ThemedText>
            <ThemedText
              size={14}
              style={styles.toggleLink}
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
              name="phone"
              placeholder="Enter your mobile number"
              keyboardType="phone-pad"
              autoCapitalize="none"
            />
          )}
        </View>

        {/* Password Input */}
        <View style={styles.inputContainer}>
          <ThemedText size={14} style={styles.label}>
            Password
          </ThemedText>
          <ThemedTextInput
            control={control}
            name="password"
            placeholder="Enter your password"
            secureTextEntry
          />
          <ThemedText size={14} style={styles.toggleLink}>
            Forgot password?
          </ThemedText>
        </View>
      </View>

      <Spacer size={40} />

      <CTA
        page="signin"
        onPress={handleSubmit(onSubmit)}
        isLoading={isLoading}
      />

      <Spacer size={55} />

      {/* Biometric Option */}
      <View style={styles.biometricContainer}>
        <Fingerprint color={Colors.primary} style={styles.fingerprintIcon} />
        <ThemedText size={14} letterSpacing={2.64} style={styles.biometricText}>
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
  headerText: {
    color: Colors.white,
    lineHeight: 46,
    alignSelf: "flex-start",
  },
  errorText: {
    width: "100%",
  },
  formFields: {
    gap: Spacing.lg,
    width: "100%",
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
  toggleLink: {
    color: Colors.primary,
  },
  biometricContainer: {
    gap: 20,
    alignItems: "center",
  },
  biometricText: {
    color: Colors.textSecondary,
  },
  fingerprintIcon: {
    width: 40,
    height: 40,
  },
});
