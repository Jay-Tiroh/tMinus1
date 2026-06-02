import Header from "@/components/kyc/Header";
import { Spacer } from "@/components/Spacer";
import { Colors } from "@/constants/Colors";
import { Fonts } from "@/constants/Fonts";
import { GeneralStyles } from "@/constants/themes";
import { useSafeBottom } from "@/hooks/useSafeBottom";
import React from "react";
import {
  ImageBackground,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const Step2 = () => {
  const topInset = useSafeAreaInsets().top;
  const bottomPadding = useSafeBottom();
  return (
    <ImageBackground
      source={require("@/assets/images/new-bg.png")}
      style={[GeneralStyles.container]}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: topInset + 32,
          paddingBottom: bottomPadding,
          width: "100%",
          flex: 1,
        }}
        scrollEventThrottle={16}
        style={{ width: "100%" }}
      >
        <Header
          goBack
          title="Account limits"
          body="Your verification level controls trade, withdrawal, and sandbox deposit access."
        />
        <Spacer size={26} />
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Search for a coin or symbol..."
            style={styles.input}
            placeholderTextColor={Colors.textMidGray}
            // value={}
            // onChangeText={onChangeText}
          />
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

export default Step2;

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
