import { Colors } from "@/constants/Colors";
import { GeneralStyles } from "@/constants/themes";
import { ThemedInput } from "@/features/auth";
import BadgeStuff from "@/shared/components/BadgeStuff";
import { Spacer } from "@/shared/components/Spacer";
import Template from "@/shared/components/Template";
import TextBlock from "@/shared/components/TextBlock";
import { ThemedButton } from "@/shared/components/ThemedButton";
import { ThemedText } from "@/shared/components/ThemedText";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Octicons from "@expo/vector-icons/Octicons";
import React from "react";
import { StyleSheet, View } from "react-native";
import { OtpInput } from "react-native-otp-entry";
import { useRecoveryCodes } from "../hooks/useRecoveryCodes";

const RecoveryCodesScreen = () => {
  const {
    codes,
    password,
    passwordError,
    setAuthCode,
    otpRef,
    isLoading,
    canSubmit,
    handleCopy,
    handlePasswordChange,
    validatePassword,
    handleRegenerate,
  } = useRecoveryCodes();

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
