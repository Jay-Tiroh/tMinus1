import { Spacer } from "@/components/Spacer";
import TextBlock from "@/components/TextBlock";
import { ThemedButton } from "@/components/ThemedButton";
import { ThemedText } from "@/components/ThemedText";
import Template from "@/components/trades/Template";
import { Colors } from "@/constants/Colors";
import { GeneralStyles } from "@/constants/themes";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import React, { useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";

const Disable2FAScreen = () => {
  const [password, setPassword] = useState("");
  const [authCode, setAuthCode] = useState("");

  const CtaFooter = () => (
    <ThemedButton
      title="Disable 2FA"
      variant="red"
      onPress={() => console.log("Disable")}
    />
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
      }}
      ctaFooter={<CtaFooter />}
    >
      <View style={GeneralStyles.wrapper}>
        {/* Warning Banner */}
        <View style={styles.warningBox}>
          <View style={styles.warningIcon}>
            <ThemedText color={Colors.warningBright} weight="bold">
              !
            </ThemedText>
          </View>
          <TextBlock
            title="Security warning"
            body="Disabling 2FA makes sign-in less protected on new devices."
            titleStyle={{ fontSize: 16, color: Colors.snowGray }}
            bodyStyle={{ fontSize: 12, color: Colors.textMidGray }}
          />
        </View>

        <Spacer size={24} />

        {/* Password Input */}
        <View style={styles.inputBox}>
          <ThemedText size={24} color={Colors.primaryClean} weight="bold">
            ·
          </ThemedText>
          <TextInput
            placeholder="Password"
            placeholderTextColor={Colors.textMidGray}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.textInput}
          />
          <MaterialCommunityIcons
            name="eye-off-outline"
            size={20}
            color={Colors.textMidGray}
          />
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

        <Spacer size={32} />

        {/* Confirmation Text */}
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
  inputBox: {
    ...GeneralStyles.box,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    height: 56,
  },
  textInput: {
    flex: 1,
    color: Colors.snowGray,
    fontSize: 16,
    marginLeft: 12,
  },
  confirmationBox: {
    ...GeneralStyles.box,
    padding: 20,
  },
});
