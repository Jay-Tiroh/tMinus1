import { Spacer } from "@/components/Spacer";
import { ThemedText } from "@/components/ThemedText";
import Template from "@/components/trades/Template";
import { Colors } from "@/constants/Colors";
import { GeneralStyles } from "@/constants/themes";
import {
  showErrorToast,
  showInfoToast,
  showSuccessToast,
} from "@/hooks/showToast";
import { useLocalSearchParams } from "expo-router";
import React, { useRef, useState } from "react";
import { StyleSheet, View } from "react-native";

import { ThemedInput } from "@/components/auth/ThemedTextInput";
import BadgeStuff from "@/components/BadgeStuff";
import TextBlock from "@/components/TextBlock";
import { ThemedButton } from "@/components/ThemedButton";
import { useRegenerateRecoveryCodesMutation } from "@/store/services/2faApi";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Octicons from "@expo/vector-icons/Octicons";
import * as Clipboard from "expo-clipboard";
import { OtpInput, OtpInputRef } from "react-native-otp-entry";
type RecoveryCode = string[];
const RecoveryCodesScreen = () => {
  const { code } = useLocalSearchParams();
  const formattedCode = typeof code === "string" ? code : undefined;
  const [codes, setCodes] = useState<string[] | undefined>(
    formattedCode?.split(","),
  );

  const handleCopy = async () => {
    if (codes) {
      await Clipboard.setStringAsync(codes.join("\n"));
      showInfoToast({ title: "Recovery codes copied to clipboard!" });
    }
  };

  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [authCode, setAuthCode] = useState("");

  const otpRef = useRef<OtpInputRef>(null);

  const [regenerateCodes, { isLoading }] = useRegenerateRecoveryCodesMutation();

  const validatePassword = (value: string) => {
    if (value.length < 8) {
      setPasswordError("Password must be at least 8 characters");
      return false;
    }
    if (!/[0-9]/.test(value)) {
      setPasswordError("Password must contain at least one number");
      return false;
    }
    if (!/[^a-zA-Z0-9]/.test(value)) {
      setPasswordError("Password must contain at least one symbol");
      return false;
    }
    setPasswordError("");
    return true;
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    if (passwordError) validatePassword(text);
  };

  const handleRegenerate = async () => {
    if (!validatePassword(password)) return;

    try {
      const payload = {
        password,
        code: authCode,
      };

      const result = await regenerateCodes(payload).unwrap();
      const newCodes = result?.recoveryCodes;
      setCodes(newCodes);
      showSuccessToast({
        title: "Recovery codes regenerated",
        message: "Your recovery codes have been regenerated.",
      });
    } catch (error: any) {
      showErrorToast({
        title: "Error",
        message: error?.data?.message ?? "Please try again",
      });
    }
  };

  const isOtpReady = authCode.length === 6;

  const canSubmit = password.length >= 8 && isOtpReady;

  const CopyFooter = () => (
    <View style={{ width: "100%", gap: 24 }}>
      <ThemedButton
        onPress={handleCopy}
        title="Copy codes"
        variant="primary"
        style={{ flex: 1 }}
        iconComponent={
          <Octicons name="copy" size={16} color={Colors.backgroundInk} />
        }
      />
      <Spacer size={16} />
      {/* Info Box */}
      <View
        style={[
          GeneralStyles.box,
          {
            backgroundColor: Colors.surfaceGreenBrown,
            padding: 24,
            gap: 8,
          },
        ]}
      >
        <ThemedText size={16} weight="bold" color={Colors.snowGray}>
          One-time use
        </ThemedText>
        <ThemedText size={14} color={Colors.warningBronze}>
          Each code can unlock your account once if your authenticator is
          unavailable.
        </ThemedText>
      </View>
    </View>
  );
  const RegenerateFooter = () => (
    <View style={{ width: "100%" }}>
      <ThemedButton
        title={isLoading ? "Regenerating..." : "Regenerate codes"}
        variant="primary"
        onPress={handleRegenerate}
        disabled={!canSubmit || isLoading}
      />
    </View>
  );

  return (
    <Template
      textBlockProps={{
        title: "Recovery codes",
        body: "Save these backup codes somewhere secure.\nNOTE: You will not be able to view them again.",
      }}
      ctaProps={undefined}
      topSpacerSize={32}
      ctaFooter={codes ? <CopyFooter /> : <RegenerateFooter />}
    >
      {codes && (
        <View style={GeneralStyles.wrapper}>
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              gap: 12,
              justifyContent: "space-between",
            }}
          >
            {codes.map((code, index) => (
              <View
                key={index}
                style={[
                  GeneralStyles.box,
                  {
                    width: "48%",
                    height: 54,
                    alignItems: "center",
                    justifyContent: "center",
                  },
                ]}
              >
                <ThemedText size={14} weight="bold" color={Colors.white}>
                  {code}
                </ThemedText>
              </View>
            ))}
          </View>
        </View>
      )}
      {!codes && (
        <View style={[GeneralStyles.wrapper, { flex: 1 }]}>
          <View
            style={{
              ...GeneralStyles.box,
              width: "100%",
              alignItems: "center",
              justifyContent: "center",
              padding: 24,
              borderRadius: 24,
            }}
          >
            <BadgeStuff
              outerColor={Colors.warningAmber}
              innerColor={"transparent"}
              IconComponent={
                <FontAwesome5
                  name="exclamation"
                  size={62}
                  color={Colors.warningAmber}
                />
              }
            />
            <Spacer size={16} />
            <TextBlock
              title="Security Warning"
              body="Regenerating recovery codes will invalidate your previous codes. Make sure to save the new codes in a secure location."
              titleStyle={{ fontSize: 16, textAlign: "center" }}
              bodyStyle={{ fontSize: 14, textAlign: "center" }}
            />
            <Spacer size={16} />
          </View>

          <Spacer size={24} />
          {/* Password Input */}
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

          {/* Auth Code Input */}

          <View style={{ width: "100%" }}>
            <OtpInput
              ref={otpRef}
              numberOfDigits={6}
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
          <Spacer size={8} />

          <ThemedText
            size={12}
            color={Colors.textMidGray}
            style={{ textAlign: "center" }}
          >
            Enter the 6-digit code from your authenticator app
          </ThemedText>
        </View>
      )}
    </Template>
  );
};

export default RecoveryCodesScreen;

const styles = StyleSheet.create({
  warningBox: {
    ...GeneralStyles.box,
    flexDirection: "row",
    padding: 16,
    gap: 16,
    alignItems: "center",
  },
  warningIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.warningBrown,
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
