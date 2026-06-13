import { Spacer } from "@/components/Spacer";
import TextBlock from "@/components/TextBlock";
import { ThemedButton } from "@/components/ThemedButton";
import { ThemedText } from "@/components/ThemedText";
import Template from "@/components/trades/Template";
import { Colors } from "@/constants/Colors";
import { GeneralStyles } from "@/constants/themes";
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";

const OTP_LENGTH = 6;
const OTP_ARRAY = Array.from({ length: OTP_LENGTH });

const Verify2FAScreen = () => {
  // In a real implementation, this would be tied to a hidden TextInput or a custom OTP library
  const [code, setCode] = useState("931");

  const CtaFooter = () => (
    <View style={{ width: "100%", gap: 24 }}>
      <ThemedButton title="Use recovery code" variant="default" />
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
        title: "Two-factor auth",
        body: "Enter the code from your authenticator app.",
      }}
      ctaProps={{
        title: "Continue",
        variant: "primary",
        disabled: code.length < OTP_LENGTH,
      }}
      ctaFooter={<CtaFooter />}
    >
      <View style={GeneralStyles.wrapper}>
        {/* Pulsing Visual Mock */}
        <View style={styles.visualContainer}>
          <View style={styles.pulseOuter}>
            <View style={styles.pulseInner}>
              <ThemedText color={Colors.primaryClean} size={24} weight="bold">
                ••••••
              </ThemedText>
            </View>
          </View>
        </View>

        <Spacer size={40} />

        {/* OTP Input Boxes */}
        <View style={styles.otpContainer}>
          {OTP_ARRAY.map((_, index) => {
            const digit = code[index] || "";
            return (
              <View key={index} style={styles.otpBox}>
                <ThemedText size={24} weight="bold" color={Colors.snowGray}>
                  {digit}
                </ThemedText>
              </View>
            );
          })}
        </View>
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
