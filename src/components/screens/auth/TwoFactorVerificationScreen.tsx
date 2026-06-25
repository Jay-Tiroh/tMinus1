import { Spacer } from "@/components/Spacer";
import TextBlock from "@/components/TextBlock";
import { ThemedButton } from "@/components/ThemedButton";
import { ThemedText } from "@/components/ThemedText";
import Template from "@/components/trades/Template";
import { Colors } from "@/constants/Colors";
import { GeneralStyles } from "@/constants/themes";
import { useLocalSearchParams, useRouter } from "expo-router";

import { ThemedInput } from "@/components/auth/ThemedTextInput";
import { showErrorToast, showSuccessToast } from "@/hooks/showToast";
import { useAppDispatch } from "@/store/hooks";
import { useVerify2FAMutation } from "@/store/services/2faApi";
import { setCredentials } from "@/store/slices/authSlice";
import { saveToken } from "@/utils/secureStore";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import React, { useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import { OtpInput, OtpInputRef } from "react-native-otp-entry";

const OTP_LENGTH = 6;
const RECOVERY_CODE_LENGTH = 10;

const Verify2FAScreen = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { challengeId, expiresAt, attemptsRemaining } = useLocalSearchParams<{
    challengeId: string;
    expiresAt: string;
    attemptsRemaining: string;
  }>();

  const [code, setCode] = useState("");
  const [recoveryCode, setRecoveryCode] = useState("");
  const [isRecoveryMode, setIsRecoveryMode] = useState(false);
  const [verify2FA, { isLoading }] = useVerify2FAMutation();

  const otpRef = useRef<OtpInputRef>(null);

  const isOtpReady = !isRecoveryMode && code.length === OTP_LENGTH;
  const isRecoveryReady =
    isRecoveryMode && recoveryCode.length === RECOVERY_CODE_LENGTH;
  const canSubmit = isOtpReady || isRecoveryReady;

  const handleVerify = async () => {
    if (!canSubmit) return;

    try {
      const payload = isRecoveryMode
        ? { challengeId, recoveryCode }
        : { challengeId, code };

      const result = await verify2FA(payload).unwrap();

      dispatch(
        setCredentials({
          user: result.user,
          token: result.accessToken,
          refreshToken: result.refreshToken,
        }),
      );

      await saveToken("ACCESS_TOKEN", result.accessToken);
      await saveToken("REFRESH_TOKEN", result.refreshToken);
      await saveToken(
        "BIOMETRIC_ENABLED",
        String(result.user.settings.biometricEnabled),
      );

      showSuccessToast({
        title: "Verification Successful",
        message: "Welcome back!",
      });

      router.replace("/(tabs)/home");
    } catch (error: any) {
      showErrorToast({
        title: "Verification Failed",
        message: error?.data?.message ?? "Invalid code",
      });

      // Clear whichever input was active on failure
      if (isRecoveryMode) {
        setRecoveryCode("");
      } else {
        setCode("");
        otpRef.current?.clear();
      }
    }
  };

  const handleToggleMode = () => {
    // Reset both inputs when switching modes
    setCode("");
    setRecoveryCode("");
    otpRef.current?.clear();
    setIsRecoveryMode((prev) => !prev);
  };

  const CtaFooter = () => (
    <View style={{ width: "100%", gap: 24 }}>
      <ThemedButton
        title={
          isRecoveryMode
            ? "Use authenticator app instead"
            : "Use recovery code instead"
        }
        variant="default"
        onPress={handleToggleMode}
      />
      <Spacer size={16} />
      <View style={styles.protectedBox}>
        <View style={styles.iconCircle}>
          <ThemedText color={Colors.primaryClean} weight="bold">
            ✓
          </ThemedText>
        </View>
        <TextBlock
          title="Protected account"
          body="This extra step protects your trading balance and saved devices."
          titleStyle={{ fontSize: 16, color: Colors.snowGray }}
          bodyStyle={{ fontSize: 12, color: Colors.textMidGray }}
        />
      </View>
    </View>
  );

  return (
    <Template
      textBlockProps={{
        title: isRecoveryMode ? "Recovery code" : "Two-factor auth",
        body: isRecoveryMode
          ? "Enter one of your 8-character recovery codes."
          : "Enter the code from your authenticator app.",
      }}
      ctaProps={{
        title: isLoading ? "Verifying..." : "Continue",
        variant: "primary",
        disabled: !canSubmit || isLoading,
        onPress: handleVerify,
      }}
      ctaFooter={<CtaFooter />}
    >
      <View style={GeneralStyles.wrapper}>
        <View style={styles.visualContainer}>
          <View style={styles.pulseOuter}>
            <View style={styles.pulseInner}>
              {isRecoveryMode ? (
                <MaterialCommunityIcons
                  name="key-outline"
                  size={32}
                  color={Colors.primaryClean}
                />
              ) : (
                <ThemedText color={Colors.primaryClean} size={24} weight="bold">
                  ••••••
                </ThemedText>
              )}
            </View>
          </View>
        </View>

        <Spacer size={40} />

        {isRecoveryMode ? (
          <View style={{ width: "100%" }}>
            <ThemedInput
              icon={
                <MaterialCommunityIcons
                  name="key-outline"
                  size={20}
                  color={Colors.textMidGray}
                />
              }
              placeholder="XXXXXXXX"
              value={recoveryCode}
              onChangeText={(text: string) =>
                // uppercase + strip non-alphanumeric + cap at 8 chars
                setRecoveryCode(
                  text
                    .replace(/[^a-zA-Z0-9]/g, "")
                    .toUpperCase()
                    .slice(0, RECOVERY_CODE_LENGTH),
                )
              }
              autoCapitalize="characters"
              autoCorrect={false}
              keyboardType="default"
            />
            <ThemedText
              size={12}
              color={Colors.textMidGray}
              style={{ marginTop: 8, marginLeft: 4 }}
            >
              {recoveryCode.length}/{RECOVERY_CODE_LENGTH} characters
            </ThemedText>
          </View>
        ) : (
          <View style={{ width: "100%" }}>
            <OtpInput
              ref={otpRef}
              numberOfDigits={OTP_LENGTH}
              onTextChange={setCode}
              focusColor={Colors.primaryClean}
              theme={{
                containerStyle: styles.otpContainer,
                pinCodeContainerStyle: styles.otpBox,
                pinCodeTextStyle: {
                  color: Colors.snowGray,
                  fontSize: 24,
                  fontWeight: "bold",
                },
              }}
            />
          </View>
        )}

        <Spacer size={16} />

        {!isRecoveryMode && attemptsRemaining && (
          <ThemedText
            size={13}
            color={Colors.textMidGray}
            style={{ textAlign: "center" }}
          >
            {attemptsRemaining} attempts remaining
          </ThemedText>
        )}

        {isRecoveryMode && (
          <ThemedText
            size={13}
            color={Colors.textMidGray}
            style={{ textAlign: "center" }}
          >
            Each recovery code can only be used once.
          </ThemedText>
        )}

        <Spacer size={40} />
      </View>
    </Template>
  );
};

export default Verify2FAScreen;

const styles = StyleSheet.create({
  visualContainer: {
    alignItems: "center",
    justifyContent: "center",
    height: 150,
  },
  pulseOuter: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: Colors.surfaceNavy,
    alignItems: "center",
    justifyContent: "center",
  },
  pulseInner: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: Colors.surfaceDark,
    alignItems: "center",
    justifyContent: "center",
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  otpBox: {
    width: 48,
    height: 56,
    backgroundColor: Colors.surfaceNavy,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  protectedBox: {
    ...GeneralStyles.box,
    flexDirection: "row",
    padding: 16,
    gap: 16,
    alignItems: "center",
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.surfaceGreenDark,
    alignItems: "center",
    justifyContent: "center",
  },
});
