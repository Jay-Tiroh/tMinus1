import Copy from "@/assets/icons/wallets/qr/copy.svg";
import { Spacer } from "@/components/Spacer";
import { ThemedText } from "@/components/ThemedText";
import Template from "@/components/trades/Template";
import { Colors } from "@/constants/Colors";
import { GeneralStyles } from "@/constants/themes";
import React, { useState } from "react";
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import QRCode from "react-native-qrcode-svg";

const SETUP_CONFIG = {
  qrPayload: "otpauth://totp/tMinus1?secret=JBSWY3DPEHPK3PXP",
  manualKey: "JBSWY3DPEHPK3PXP",
};

const Setup2FAScreen = () => {
  const [authCode, setAuthCode] = useState("");

  return (
    <Template
      textBlockProps={{
        title: "Set up 2FA",
        body: "Scan the QR code with your authenticator app, then enter the code.",
      }}
      ctaProps={{
        title: "Enable 2FA",
        variant: "primary",
        onPress: () => console.log("Enable 2FA"),
        disabled: authCode.length < 6,
      }}
      topSpacerSize={32}
    >
      <View style={GeneralStyles.wrapper}>
        {/* QR Code Card */}
        <View style={styles.qrCard}>
          <QRCode
            value={SETUP_CONFIG.qrPayload}
            size={200}
            color="black"
            backgroundColor="white"
          />
        </View>
        <Spacer size={16} />
        <ThemedText
          size={14}
          color={Colors.textMidGray}
          style={{ textAlign: "center" }}
        >
          Scan to link authenticator
        </ThemedText>

        <Spacer size={32} />

        {/* Manual Key */}
        <ThemedText size={14} color={Colors.textMidGray}>
          Manual key
        </ThemedText>
        <Spacer size={8} />
        <View style={styles.inputBox}>
          <ThemedText size={16} color={Colors.snowGray}>
            {SETUP_CONFIG.manualKey}
          </ThemedText>
          <TouchableOpacity>
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
    fontSize: 16,
    marginLeft: 12,
  },
});
