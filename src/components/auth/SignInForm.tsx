import Fingerprint from "@/assets/icons/fingerprint.svg";
import CTA from "@/components/auth/CTA";
import { ThemedTextInput } from "@/components/auth/ThemedTextInput";
import Loader from "@/components/Loader";
import { Spacer } from "@/components/Spacer";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { Spacing } from "@/constants/Spacing";
import { showErrorToast, showSuccessToast } from "@/hooks/showToast";
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

// Interfaces for strict typing to replace `any`
interface ApiError {
  data?: {
    message?: string;
  };
}

interface StatusError {
  status: number;
}

interface RefreshResponse {
  accessToken?: string;
  token?: string;
  refreshToken?: string;
  user?: never;
}

export default function SignInForm() {
  const [isEmail, setIsEmail] = useState(true);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("");
  const [biometricLoading, setBiometricLoading] = useState(false);

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
      showSuccessToast({
        title: "Login Successful",
        message: "Welcome back! You have been logged in successfully.",
      });
      router.replace("/(tabs)/home");
    }

    if (error) {
      const isApiError = (err: unknown): err is ApiError =>
        typeof err === "object" && err !== null;

      const loginError =
        (isApiError(error) && error.data) || "Something went wrong";
      setErrorMessage(loginError);
      showErrorToast({
        title: "Login Failed",
        message: loginError,
      });
    }
  };

  const handleToggle = () => {
    reset();
    setIsEmail((prev) => !prev);
  };

  const handleBiometricAuth = async () => {
    if (!isSupported || !isEnrolled) return;

    setBiometricLoading(true);

    const result = await authenticate("Unlock tMinus1");
    if (!result.success) {
      setBiometricLoading(false);
      setErrorMessage(
        "Biometric authentication failed, login with email and password instead",
      );
      showErrorToast({
        title: "Authentication Failed",
        message:
          "Biometric authentication failed, login with email and password instead",
      });
      return;
    }

    const token = await getToken("ACCESS_TOKEN");
    const refreshToken = await getToken("REFRESH_TOKEN");

    if (!token || !refreshToken) {
      setBiometricLoading(false);
      setErrorMessage("No saved session — please sign in first.");
      showErrorToast({
        title: "No Saved Session",
        message: "No saved session — please sign in first.",
      });
      return;
    }

    try {
      // Attempt to use the stored access token directly
      const sessionData = await dispatch(
        authApi.endpoints.getSession.initiate(undefined, {
          forceRefetch: true,
        }),
      ).unwrap();

      dispatch(
        setCredentials({
          user: sessionData.user || sessionData,
          token: sessionData.accessToken || token,
          refreshToken: sessionData.refreshToken || refreshToken,
        }),
      );

      await saveToken("ACCESS_TOKEN", sessionData.accessToken || token);
      await saveToken(
        "REFRESH_TOKEN",
        sessionData.refreshToken || refreshToken,
      );

      router.replace("/(tabs)/home");
    } catch {
      // Access token expired — try refresh before giving up
      try {
        const refreshData = await dispatch(
          authApi.endpoints.refreshToken.initiate({ refreshToken }),
        ).unwrap();

        const newToken = refreshData.accessToken || refreshData.token || token;
        const newRefreshToken = refreshData.refreshToken || refreshToken;

        dispatch(
          setCredentials({
            user: refreshData.user || (null as never),
            token: newToken,
            refreshToken: newRefreshToken,
          }),
        );

        await saveToken("ACCESS_TOKEN", newToken);
        await saveToken("REFRESH_TOKEN", newRefreshToken);
        showSuccessToast({
          title: "Login Successful",
          message: "Welcome back! You have been logged in successfully.",
        });
        router.replace("/(tabs)/home");
      } catch {
        dispatch({ type: "auth/clearCredentials" });
        setBiometricLoading(false);
        setErrorMessage("Session expired, please sign in again.");
        showErrorToast({
          title: "Session Expired",
          message: "Session expired, please sign in again.",
        });
      }
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
          {errorMessage}
        </ThemedText>
      )}
      {!isError && errorMessage !== "" && (
        <ThemedText color={Colors.lossAlt} style={styles.errorText}>
          {errorMessage}
        </ThemedText>
      )}

      <Spacer size={44} />

      <View style={styles.formFields}>
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

      {isSupported && isEnrolled && !biometricLoading && (
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
      {biometricLoading && <Loader />}
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
