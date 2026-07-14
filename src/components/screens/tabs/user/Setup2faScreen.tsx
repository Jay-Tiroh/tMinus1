import Copy from "@/assets/icons/wallets/qr/copy.svg";
import { Spacer } from "@/components/Spacer";
import { ThemedText } from "@/components/ThemedText";
import Template from "@/components/trades/Template";
import { Colors } from "@/constants/Colors";
import { Fonts } from "@/constants/Fonts";
import { GeneralStyles } from "@/constants/themes";
import { showErrorToast, showSuccessToast } from "@/hooks/showToast";
import {
  useEnable2FAMutation,
  useSetup2FAMutation,
} from "@/store/services/2faApi";
import { Setup2FAResponseData } from "@/types/2fa";
import { getErrorMessage } from "@/utils/errors";
import { logger } from "@/utils/logger";
import { setPendingRecoveryCodes } from "@/utils/recoveryCodesTransfer";
import * as Clipboard from "expo-clipboard";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import QRCode from "react-native-qrcode-svg";

const Setup2FAScreen = () => {
  const [authCode, setAuthCode] = useState("");
  const [setupResponse, setSetupResponse] =
    useState<Setup2FAResponseData | null>(null);

  const [setup, { isLoading: settingUp, isError: setupFailed }] =
    useSetup2FAMutation();
  const [enable, { isLoading: enabling }] = useEnable2FAMutation();

  const router = useRouter();

  useEffect(() => {
    const runSetup = async () => {
      try {
        const response: Setup2FAResponseData = await setup().unwrap();
        setSetupResponse(response);
      } catch (error) {
        logger.error("2FA setup failed:", error);
        showErrorToast({
          title: "Failed to initialize 2FA.",
          message: getErrorMessage(error, "We couldn't initialize 2FA right now. Please try again."),
        });
      }
    };

    runSetup();
  }, [setup]);

  const handleCopyKey = async () => {
    if (setupResponse?.secret) {
      await Clipboard.setStringAsync(setupResponse.secret);
      showSuccessToast({ title: "Secret key copied to clipboard!" });
    } else {
      showErrorToast({ title: "No key available to copy." });
    }
  };

  const handleEnable2FA = async () => {
    try {
      const result = await enable({ code: authCode }).unwrap();
      showSuccessToast({ title: "2FA enabled successfully!" });
      const codes = result?.recoveryCodes;
      setPendingRecoveryCodes(codes);
      router.replace("/user/two-factor/recovery-codes");
    } catch (error) {
      showErrorToast({
        title: "Invalid code.",
        message: getErrorMessage(error, "Please check the code and try again.")
      });
    }
  };
  return (
    <Template
      textBlockProps={{
        title: "Set up 2FA",
        body: "Scan the QR code with your authenticator app, then enter the code.",
      }}
      ctaProps={{
        title: enabling ? "Enabling..." : "Enable 2FA",
        variant: "primary",
        onPress: handleEnable2FA,
        disabled: authCode.length < 6 || enabling || settingUp,
      }}
      topSpacerSize={32}
    >
      <View style={GeneralStyles.wrapper}>
        {/* QR Code Card */}
        <View style={styles.qrCard}>
          {settingUp || !setupResponse?.otpauthUri ? (
            <ActivityIndicator size="large" color={Colors.primaryClean} />
          ) : (
            <QRCode
              value={setupResponse.otpauthUri}
              size={200}
              color="black"
              backgroundColor="white"
            />
          )}
        </View>
        <Spacer size={16} />
        <ThemedText
          size={14}
          color={Colors.textMidGray}
          style={{ textAlign: "center" }}
        >
          {setupFailed
            ? "Failed to load QR code. Please go back and retry."
            : "Scan to link authenticator"}
        </ThemedText>

        <Spacer size={32} />

        {/* Manual Key */}
        <ThemedText size={14} color={Colors.textMidGray}>
          Manual key
        </ThemedText>
        <Spacer size={8} />
        <View style={styles.inputBox}>
          <ThemedText size={14} color={Colors.textFaint} weight="medium">
            {setupResponse?.secret ?? "Loading..."}
          </ThemedText>
          <TouchableOpacity onPress={handleCopyKey}>
            <Copy width={20} height={20} color={Colors.primaryClean} />
          </TouchableOpacity>
        </View>

        <Spacer size={16} />

        {/* Auth Code Input */}
        <View style={styles.inputBox}>
          <ThemedText size={16} color={Colors.primaryClean} weight="bold">
            #
          </ThemedText>
          <TextInput
            placeholder="Authenticator code"
            placeholderTextColor={Colors.textMidGray}
            value={authCode}
            onChangeText={setAuthCode}
            keyboardType="number-pad"
            maxLength={6}
            style={styles.textInput}
          />
        </View>
      </View>
    </Template>
  );
};

export default Setup2FAScreen;

const styles = StyleSheet.create({
  qrCard: {
    backgroundColor: "white",
    padding: 24,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    width: "100%",
    maxWidth: 280,
    minHeight: 248, // prevents layout shift between spinner and QR
  },
  inputBox: {
    ...GeneralStyles.box,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    height: 56,
  },
  textInput: {
    flex: 1,
    color: Colors.snowGray,
    fontSize: 14,
    marginLeft: 12,
    fontFamily: Fonts.medium,
  },
});
