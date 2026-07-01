import { InfoBanner } from "@/components/auth/InfoBanner";
import { ThemedInput } from "@/components/auth/ThemedTextInput";
import { Spacer } from "@/components/Spacer";
import { ThemedButton } from "@/components/ThemedButton";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { Fonts } from "@/constants/Fonts";
import { formatPhoneInternational } from "@/helpers/functions";
import { showErrorToast, showSuccessToast } from "@/hooks/showToast";
import {
  EmailPasswordFormData,
  emailPasswordSchema,
  MobilePasswordFormData,
  mobilePasswordSchema,
} from "@/schemas/authSchemas";
import { useAppDispatch } from "@/store/hooks";
import { useLoginMutation } from "@/store/services/authApi";
import { setCredentials } from "@/store/slices/authSlice";
import { LoginRequest } from "@/types/auth";
import { vs } from "@/utils/responsive";
import { saveToken } from "@/utils/secureStore";
import Feather from "@expo/vector-icons/Feather";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Control, FieldValues, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

interface ApiError {
  data?: { message?: string };
}

const SignInForm = () => {
  const [isEmail, setIsEmail] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const isTwoFactorResponse = (
    data: unknown,
  ): data is {
    requiresTwoFactor: true;
    challengeId: string;
    expiresAt: string;
    attemptsRemaining: number;
  } => {
    return (
      typeof data === "object" && data !== null && "requiresTwoFactor" in data
    );
  };

  const dispatch = useAppDispatch();
  const router = useRouter();

  const emailForm = useForm<EmailPasswordFormData>({
    resolver: zodResolver(emailPasswordSchema),
    mode: "onChange",
  });

  const phoneForm = useForm<MobilePasswordFormData>({
    resolver: zodResolver(mobilePasswordSchema),
    mode: "onChange",
  });

  const activeForm = isEmail ? emailForm : phoneForm;

  const [login, { isLoading, isError }] = useLoginMutation();

  const handleToggle = () => {
    emailForm.reset();
    phoneForm.reset();
    setIsEmail((prev) => !prev);
  };

  const onSubmit = async (
    data: EmailPasswordFormData | MobilePasswordFormData,
  ) => {
    const formattedData: LoginRequest = {
      loginType: isEmail ? "email" : "phone",
      identifier: "email" in data ? data.email : data.phone.replace(/\s/g, ""),
      password: data.password,
    };

    const result = await login(formattedData);
    console.log("LOGIN RESULT", result);
    if ("data" in result && result.data) {
      if (isTwoFactorResponse(result.data)) {
        router.replace({
          pathname: "/verify-2fa",
          params: {
            challengeId: result.data.challengeId,
            expiresAt: result.data.expiresAt,
            attemptsRemaining: String(result.data.attemptsRemaining),
          },
        });

        return;
      }

      dispatch(
        setCredentials({
          user: result.data.user,
          token: result.data.accessToken,
          refreshToken: result.data.refreshToken,
        }),
      );

      await saveToken("ACCESS_TOKEN", result.data.accessToken);

      await saveToken("REFRESH_TOKEN", result.data.refreshToken);

      await saveToken(
        "BIOMETRIC_ENABLED",
        String(result.data.user.settings.biometricEnabled),
      );

      showSuccessToast({
        title: "Login Successful",
        message: "Welcome back! You have been logged in successfully.",
      });

      router.replace("/(tabs)/home");

      return;
    }
    if ("error" in result) {
      const isApiError = (err: unknown): err is ApiError =>
        typeof err === "object" && err !== null;

      const loginError =
        (isApiError(result.error) && result.error.data?.message) ||
        "Something went wrong";
      setErrorMessage(loginError);
      showErrorToast({ title: "Login Failed", message: loginError });
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {(isError || errorMessage !== "") && (
        <ThemedText
          color={Colors.lossAlt}
          style={{ width: "100%", marginBottom: vs(8) }}
        >
          {errorMessage}
        </ThemedText>
      )}

      <View style={{ gap: vs(16) }}>
        <View style={styles.labelRow}>
          <ThemedText size={14} color={Colors.textSecondary}>
            {isEmail ? "Email" : "Mobile Number"}
          </ThemedText>
          <ThemedText
            size={14}
            color={Colors.primaryClean}
            onPress={handleToggle}
          >
            {isEmail ? "Sign in with mobile" : "Sign in with email"}
          </ThemedText>
        </View>

        {isEmail ? (
          <ThemedInput
            key="email-input"
            control={emailForm.control}
            name="email"
            icon={<Feather name="mail" size={20} color={Colors.primaryClean} />}
            placeholder="student@cryptoclass.test"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        ) : (
          <ThemedInput
            key="phone-input"
            control={phoneForm.control}
            name="phone"
            icon={
              <Feather name="phone" size={20} color={Colors.primaryClean} />
            }
            placeholder="Enter your mobile number"
            keyboardType="phone-pad"
            formatter={formatPhoneInternational}
          />
        )}

        <ThemedInput
          key={isEmail ? "email-password" : "phone-password"}
          control={activeForm.control as unknown as Control<FieldValues>}
          name="password"
          icon={
            <MaterialIcons
              name="lock-outline"
              size={20}
              color={Colors.primaryClean}
            />
          }
          placeholder="Password"
          secureTextEntry
          hasToggle
        />
      </View>

      <TouchableOpacity style={styles.forgotRow}>
        <ThemedText color={Colors.primaryClean} size={14} weight="medium">
          Forgot password?
        </ThemedText>
      </TouchableOpacity>

      <Spacer size={32} />

      <View style={{ gap: vs(16) }}>
        <ThemedButton
          title="Sign in"
          variant="primary"
          onPress={activeForm.handleSubmit(onSubmit, (errors) => {
            console.log("VALIDATION ERRORS", errors);
          })}
          disabled={isLoading}
          iconComponent={
            isLoading ? (
              <ActivityIndicator color={Colors.backgroundInk} />
            ) : null
          }
          textStyle={{ fontFamily: Fonts.medium }}
        />
      </View>

      <Spacer size={40} />
      <InfoBanner
        type="success"
        title="Secure session"
        desc="We will request 2FA when your account has it enabled."
      />
      <Spacer size={40} />

      <View style={styles.centerRow}>
        <ThemedText color={Colors.textMidGray} size={14}>
          New here?{" "}
          <ThemedText color={Colors.snowGray} weight="medium">
            Create an account
          </ThemedText>
        </ThemedText>
      </View>
    </View>
  );
};

export default SignInForm;

const styles = StyleSheet.create({
  forgotRow: { alignItems: "flex-end", width: "100%", marginTop: vs(12) },
  centerRow: { alignItems: "center", width: "100%" },
  labelRow: { flexDirection: "row", justifyContent: "space-between" },
});
