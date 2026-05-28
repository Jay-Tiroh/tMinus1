import Fingerprint from "@/assets/icons/fingerprint.svg";
import CTA from "@/components/auth/CTA";
import { ThemedTextInput } from "@/components/auth/ThemedTextInput";
import { Spacer } from "@/components/Spacer";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { Spacing } from "@/constants/Spacing";
import { useBiometrics } from "@/hooks/useBiometrics";
import {
  EmailPasswordFormData,
  emailPasswordSchema,
  MobilePasswordFormData,
  mobilePasswordSchema,
} from "@/schemas/authSchemas";
import { useAppDispatch } from "@/store/hooks";
import { authApi, useLoginMutation } from "@/store/services/authApi";
import { setCredentials } from "@/store/slices/authSlice";
import { LoginRequest } from "@/types/auth";
import { getToken, saveToken } from "@/utils/secureStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Pressable, StyleSheet, View } from "react-native";

type FormData = EmailPasswordFormData | MobilePasswordFormData;

export default function SignInForm() {
  const [isEmail, setIsEmail] = useState(true);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const { control, handleSubmit, reset } = useForm<FormData>({
    resolver: zodResolver(isEmail ? emailPasswordSchema : mobilePasswordSchema),
    mode: "onChange",
  });

  const [login, { isLoading, isError, error }] = useLoginMutation();
  const { isSupported, isEnrolled, authenticate } = useBiometrics();

  const onSubmit = async (data: FormData) => {
    const formattedData: LoginRequest = {
      loginType: isEmail ? "email" : "phone",
      identifier: "email" in data ? data.email : data.phone,
      password: data.password,
    };

    const result = await login(formattedData);

    if ("data" in result && result.data) {
      dispatch(
        setCredentials({
          user: result.data.user,
          token: result.data.accessToken,
          refreshToken: result.data.refreshToken,
        }),
      );
      await saveToken("ACCESS_TOKEN", result.data.accessToken);
      await saveToken("REFRESH_TOKEN", result.data.refreshToken);
      router.replace("/(tabs)/home");
    }
  };

  const handleToggle = () => {
    reset();
    setIsEmail((prev) => !prev);
  };

  const handleBiometricAuth = async () => {
    if (!isSupported || !isEnrolled) return;

    const result = await authenticate("Unlock tMinus1");
    if (!result.success) {
      console.warn("Biometric auth failed:", result.error);
      return;
    }

    const token = await getToken("ACCESS_TOKEN");
    const refreshToken = await getToken("REFRESH_TOKEN");

    if (!token) {
      console.warn("No saved token — please sign in first.");
      return;
    }

    // Set token in redux first so baseQuery picks it up for the session call
    dispatch(
      setCredentials({
        user: null as any,
        token,
        refreshToken: refreshToken ?? "",
      }),
    );

    try {
      const sessionData = await dispatch(
        authApi.endpoints.getSession.initiate(undefined, {
          forceRefetch: true,
        }),
      ).unwrap();

      dispatch(
        setCredentials({
          user: sessionData.user,
          token: sessionData.accessToken,
          refreshToken: sessionData.refreshToken,
        }),
      );

      // Refresh stored tokens in case the session returned new ones
      await saveToken("ACCESS_TOKEN", sessionData.accessToken);
      await saveToken("REFRESH_TOKEN", sessionData.refreshToken);

      router.replace("/(tabs)/home");
    } catch (err) {
      // Session fetch failed — token likely expired, force re-login
      dispatch({ type: "auth/clearCredentials" });
      console.warn("Session expired, please sign in again.");
    }
  };

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
      {isSupported && isEnrolled && (
        <Pressable
          onPress={handleBiometricAuth}
          style={styles.biometricContainer}
        >
          <Fingerprint color={Colors.primary} style={styles.fingerprintIcon} />
          <ThemedText
            size={14}
            letterSpacing={2.64}
            style={styles.biometricText}
          >
            Use fingerprint instead?
          </ThemedText>
        </Pressable>
      )}
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
