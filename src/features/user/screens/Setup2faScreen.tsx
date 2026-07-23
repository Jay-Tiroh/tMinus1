import Copy from "@/assets/icons/wallets/qr/copy.svg";
import { Colors } from "@/constants/Colors";
import { Fonts } from "@/constants/Fonts";
import { GeneralStyles } from "@/constants/themes";
import { Spacer } from "@/shared/components/Spacer";
import Template from "@/shared/components/Template";
import { ThemedText } from "@/shared/components/ThemedText";
import React from "react";
import {
  ActivityIndicator,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import QRCode from "react-native-qrcode-svg";
import { useSetup2fa } from "../hooks/useSetup2fa";

const Setup2FAScreen = () => {
  const {
    authCode,
    setAuthCode,
    setupResponse,
    settingUp,
    setupFailed,
    enabling,
    handleCopyKey,
    handleEnable2FA,
  } = useSetup2fa();

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
    minHeight: 248,
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
