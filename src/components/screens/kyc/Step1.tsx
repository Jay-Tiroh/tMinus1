import { CountryPicker } from "@/components/CountryPicker";
import Template from "@/components/kyc/Template";
import { Colors } from "@/constants/Colors";
import { Fonts } from "@/constants/Fonts";
import { GeneralStyles } from "@/constants/themes";
import { useSafeBottom } from "@/hooks/useSafeBottom";
import React, { useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const Step1 = () => {
  const topInset = useSafeAreaInsets().top;
  const bottomPadding = useSafeBottom();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("Nigeria");
  return (
    <Template
      headerProps={{
        title: "Identity details",
        body: "Enter details exactly as they appear on your document.",
        stage: 1,
      }}
      ctaProps={{
        variant: "primary",
        title: "Continue",
        textStyle: {
          fontSize: 14,
          fontFamily: Fonts.bold,
        },
      }}
    >
      <View
        style={[
          GeneralStyles.wrapper,
          {
            gap: 12,
          },
        ]}
      >
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Legal name"
            style={styles.input}
            placeholderTextColor={Colors.textMidGray}
          />
        </View>
        <View style={styles.inputContainer}>
          <CountryPicker
            onCountryChange={(country) => setSelectedCountry(country.name)}
            showDialCode={false}
            showPhoneInput={false}
          />
        </View>
      </View>
    </Template>
  );
};

export default Step1;

const styles = StyleSheet.create({
  inputContainer: {
    borderRadius: 12,
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: Colors.backgroundDark,
    flexDirection: "row",
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  input: {
    flex: 1,
    fontFamily: Fonts.regular,
    color: Colors.textOnDark,
  },
});
