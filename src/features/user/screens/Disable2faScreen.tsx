import { ThemedInput } from "@/components/auth/ThemedTextInput";
import { Colors } from "@/constants/Colors";
import { GeneralStyles } from "@/constants/themes";
import { useDisable2FAMutation } from "@/features/user/api/2faApi";
import { Spacer } from "@/shared/components/Spacer";
import Template from "@/shared/components/Template";
import TextBlock from "@/shared/components/TextBlock";
import { ThemedButton } from "@/shared/components/ThemedButton";
import { ThemedText } from "@/shared/components/ThemedText";
import { showErrorToast, showSuccessToast } from "@/shared/hooks/showToast";
import { getErrorMessage } from "@/shared/utils/errors";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { OtpInput, OtpInputRef } from "react-native-otp-entry";
import { passwordValidationSchema } from "../validation/2fa.schema";

const OTP_LENGTH = 6;
const RECOVERY_CODE_LENGTH = 10;

const Disable2FAScreen = () => {
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [authCode, setAuthCode] = useState("");
  const [recoveryCode, setRecoveryCode] = useState("");
  const [isRecoveryMode, setIsRecoveryMode] = useState(false);

  const otpRef = useRef<OtpInputRef>(null);

  const [disable2FA, { isLoading }] = useDisable2FAMutation();

  const validatePassword = (value: string) => {
    const result = passwordValidationSchema.safeParse(value);
    if (!result.success) {
      setPasswordError(getErrorMessage(result.error));
      return false;
    }
    setPasswordError("");
    return true;
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    if (passwordError) validatePassword(text);
  };

  const handleToggleMode = () => {
    setAuthCode("");
    setRecoveryCode("");
    otpRef.current?.clear();
    setIsRecoveryMode((prev) => !prev);
  };

  const handleDisable = async () => {
    if (!validatePassword(password)) return;

    try {
      const payload = isRecoveryMode
        ? {
            password,
            recoveryCode,
          }
        : {
            password,
            code: authCode,
          };

      await disable2FA(payload).unwrap();

      showSuccessToast({
        title: "2FA Disabled",
        message: "Two-factor authentication has been turned off.",
      });

      router.back();
    } catch (error: any) {
      showErrorToast({
        title: "Unable to Disable 2FA",
        message: error?.data?.message ?? "Please try again",
      });

      if (isRecoveryMode) {
        setRecoveryCode("");
      } else {
        setAuthCode("");
        otpRef.current?.clear();
      }
    }
  };

  const isOtpReady = !isRecoveryMode && authCode.length === OTP_LENGTH;
  const isRecoveryReady =
    isRecoveryMode && recoveryCode.length === RECOVERY_CODE_LENGTH;
  const canSubmit = password.length >= 8 && (isOtpReady || isRecoveryReady);

  const CtaFooter = () => (
    <View style={{ width: "100%", gap: 16 }}>
      <ThemedButton
        title={isLoading ? "Disabling..." : "Disable 2FA"}
        variant="red"
        onPress={handleDisable}
        disabled={!canSubmit || isLoading}
      />
    </View>
  );

  return (
    <Template
      textBlockProps={{
        title: "Disable 2FA",
        body: "Confirm your password and current authenticator code.",
      }}
      ctaProps={{
        title: "Keep 2FA on",
        variant: "primary",
        onPress: () => router.back(),
        disabled: isLoading,
      }}
      ctaFooter={<CtaFooter />}
    >
      <View style={GeneralStyles.wrapper}>
        <View style={styles.warningBox}>
          <View style={styles.warningIcon}>
            <FontAwesome5 name="exclamation" size={24} color={Colors.loss} />
          </View>
          <TextBlock
            title="Security warning"
            body="Disabling 2FA makes sign-in less protected on new devices."
            titleStyle={{
              fontSize: 16,
              color: Colors.snowGray,
              textAlign: "center",
            }}
            bodyStyle={{
              fontSize: 12,
              color: Colors.textMidGray,
              textAlign: "center",
            }}
          />
        </View>

        <Spacer size={24} />

        <View style={{ width: "100%" }}>
          <ThemedInput
            icon={
              <MaterialCommunityIcons
                name="lock-outline"
                size={20}
                color={Colors.textMidGray}
              />
            }
            placeholder="Password"
            value={password}
            onChangeText={handlePasswordChange}
            onBlur={() => validatePassword(password)}
            secureTextEntry
            hasToggle
            autoCapitalize="none"
          />
          {passwordError !== "" && (
            <ThemedText
              size={12}
              color={Colors.lossAlt}
              style={styles.errorText}
            >
              {passwordError}
            </ThemedText>
          )}
        </View>

        <Spacer size={16} />
        <Pressable
          style={{
            width: "100%",
            justifyContent: "flex-end",
          }}
          onPress={handleToggleMode}
        >
          <ThemedText
            style={{ textAlign: "right" }}
            size={12}
            color={Colors.primaryClean}
          >
            {" "}
            {isRecoveryMode
              ? "Use authenticator app instead"
              : "Use recovery code instead"}
          </ThemedText>

          <Spacer size={16} />
        </Pressable>

        {isRecoveryMode ? (
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
            onChangeText={(text) =>
              setRecoveryCode(
                text
                  .replace(/[^a-zA-Z0-9]/g, "")
                  .toUpperCase()
                  .slice(0, RECOVERY_CODE_LENGTH),
              )
            }
            autoCapitalize="characters"
            autoCorrect={false}
          />
        ) : (
          <View style={{ width: "100%" }}>
            <OtpInput
              ref={otpRef}
              numberOfDigits={OTP_LENGTH}
              onTextChange={setAuthCode}
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

        <Spacer size={8} />

        <ThemedText
          size={12}
          color={Colors.textMidGray}
          style={{ textAlign: "center" }}
        >
          {isRecoveryMode
            ? `${recoveryCode.length}/${RECOVERY_CODE_LENGTH} characters`
            : `Enter the ${OTP_LENGTH}-digit code from your authenticator app`}
        </ThemedText>

        <Spacer size={32} />

        <View style={styles.confirmationBox}>
          <TextBlock
            title="Are you sure?"
            body="You can turn 2FA back on from Security Settings whenever you need it."
            titleStyle={{ fontSize: 18, color: Colors.snowGray }}
            bodyStyle={{ fontSize: 14, color: Colors.textMidGray }}
          />
        </View>
      </View>
    </Template>
  );
};

export default Disable2FAScreen;

const styles = StyleSheet.create({
  warningBox: {
    ...GeneralStyles.box,
    padding: 16,
    gap: 16,
    alignItems: "center",
  },
  warningIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.loss + "33",
    alignItems: "center",
    justifyContent: "center",
  },
  confirmationBox: {
    ...GeneralStyles.box,
    padding: 20,
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
  errorText: {
    marginTop: 6,
    marginLeft: 4,
  },
});
