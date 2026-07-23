import { Colors } from "@/constants/Colors";
import { GeneralStyles } from "@/constants/themes";
import { Spacer } from "@/shared/components/Spacer";
import Template from "@/shared/components/Template";
import TextBlock from "@/shared/components/TextBlock";
import { ThemedButton } from "@/shared/components/ThemedButton";
import { ThemedText } from "@/shared/components/ThemedText";
import { useLocalSearchParams } from "expo-router";

import { ms, s, vs } from "@/utils/responsive";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import React, { useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import { OtpInput, OtpInputRef } from "react-native-otp-entry";
import { ThemedInput } from "../components/ThemedTextInput";
import { useVerify2FAFlow } from "../hooks/useVerify2FAFlow";

const OTP_LENGTH = 6;
const RECOVERY_CODE_LENGTH = 10;

const Verify2FAScreen = () => {
  const { challengeId, attemptsRemaining } = useLocalSearchParams<{
    challengeId: string;
    expiresAt: string;
    attemptsRemaining: string;
  }>();

  const [code, setCode] = useState("");
  const [recoveryCode, setRecoveryCode] = useState("");
  const [isRecoveryMode, setIsRecoveryMode] = useState(false);
  const { handleVerify, isLoading } = useVerify2FAFlow();

  const otpRef = useRef<OtpInputRef>(null);

  const isOtpReady = !isRecoveryMode && code.length === OTP_LENGTH;
  const isRecoveryReady =
    isRecoveryMode && recoveryCode.length === RECOVERY_CODE_LENGTH;
  const canSubmit = isOtpReady || isRecoveryReady;

  const onSubmit = () => {
    if (!canSubmit || !challengeId) return;

    handleVerify({
      challengeId,
      code,
      recoveryCode,
      isRecoveryMode,
      setCode,
      setRecoveryCode,
      otpRef,
    });
  };

  const handleToggleMode = () => {
    setCode("");
    setRecoveryCode("");
    otpRef.current?.clear();
    setIsRecoveryMode((prev) => !prev);
  };

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
        onPress: onSubmit,
      }}
      ctaFooter={
        <View style={{ width: "100%", gap: vs(24) }}>
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
              titleStyle={{ fontSize: ms(16), color: Colors.snowGray }}
              bodyStyle={{ fontSize: ms(12), color: Colors.textMidGray }}
            />
          </View>
        </View>
      }
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
              style={{ marginTop: vs(8), marginLeft: s(4) }}
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
                  fontSize: ms(24),
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
    height: vs(150),
  },
  pulseOuter: {
    width: s(140),
    height: vs(140),
    borderRadius: ms(70),
    backgroundColor: Colors.surfaceNavy,
    alignItems: "center",
    justifyContent: "center",
  },
  pulseInner: {
    width: s(90),
    height: vs(90),
    borderRadius: ms(45),
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
    width: s(48),
    height: vs(56),
    backgroundColor: Colors.surfaceNavy,
    borderRadius: ms(12),
    alignItems: "center",
    justifyContent: "center",
  },
  protectedBox: {
    ...GeneralStyles.box,
    flexDirection: "row",
    padding: ms(16),
    gap: s(16),
    alignItems: "center",
  },
  iconCircle: {
    width: s(32),
    height: vs(32),
    borderRadius: ms(16),
    backgroundColor: Colors.surfaceGreenDark,
    alignItems: "center",
    justifyContent: "center",
  },
});
