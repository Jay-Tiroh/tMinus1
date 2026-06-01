import Header from "@/components/kyc/Header";
import { Spacer } from "@/components/Spacer";
import TextBlock from "@/components/TextBlock";
import { ThemedButton } from "@/components/ThemedButton";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { Fonts } from "@/constants/Fonts";
import { GeneralStyles } from "@/constants/themes";
import { useSafeBottom } from "@/hooks/useSafeBottom";
import React from "react";
import { ImageBackground, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const features = [
  {
    label: "Trade limit",
    value: "Locked",
  },
  {
    label: "Withdraw limit",
    value: "Locked",
  },
  {
    label: "Sandbox deposit",
    value: "$100 max",
  },
];

const IndexPage = ({
  handlePress,
}: {
  handlePress: (step: number) => void;
}) => {
  const topInset = useSafeAreaInsets().top;
  const bottomPadding = useSafeBottom();
  return (
    <ImageBackground
      source={require("@/assets/images/new-bg.png")}
      style={[
        GeneralStyles.container,
        {
          paddingTop: topInset + 24,
          paddingBottom: bottomPadding,
        },
      ]}
    >
      <Header />
      <Spacer size={40} />
      <View style={[GeneralStyles.wrapper]}>
        <View
          style={[
            GeneralStyles.box,
            {
              padding: 24,
              justifyContent: "flex-end",
              alignItems: "center",
              borderRadius: 18,
              minHeight: 168,
              position: "relative",
            },
          ]}
        >
          <TextBlock
            title="Starter Account"
            body="Browse markets now. Verify to trade, withdraw, and raise sandbox deposit limits."
            titleStyle={{ textAlign: "center", fontSize: 22, zIndex: 1 }}
            bodyStyle={{
              textAlign: "center",
              fontSize: 12,
              zIndex: 1,
              maxWidth: 270,
            }}
          />
          <View
            style={{
              width: 92,
              height: 92,
              borderRadius: 46,
              backgroundColor: Colors.surfaceGreenDeep,
              alignItems: "center",
              paddingTop: 24,
              position: "absolute",
              top: 16,
            }}
          >
            <ThemedText weight="bold" color={Colors.primaryClean} size={12}>
              Level 0
            </ThemedText>
          </View>
        </View>
      </View>
      <Spacer size={30} />
      <View style={[GeneralStyles.wrapper, { gap: 14 }]}>
        {features.map((item) => (
          <View
            key={item.label}
            style={[
              GeneralStyles.box,
              {
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                padding: 20,
              },
            ]}
          >
            <ThemedText size={12} color={Colors.textMidGray}>
              {item.label}
            </ThemedText>
            <ThemedText
              size={13}
              color={
                item.value === "Locked" ? Colors.lossBright : Colors.snowGray
              }
              weight="bold"
            >
              {item.value}
            </ThemedText>
          </View>
        ))}
      </View>

      {/*CTA*/}
      <View
        style={[
          GeneralStyles.wrapper,
          { gap: 14, flex: 1, justifyContent: "flex-end" },
        ]}
      >
        <ThemedButton
          variant="primary"
          title="Start Verification"
          textStyle={{
            fontSize: 14,
            fontFamily: Fonts.bold,
          }}
          onPress={() => handlePress(1)}
        />
        <ThemedText
          color={Colors.textMidGray}
          size={11}
          style={{ textAlign: "center" }}
        >
          You can continue browsing markets without verification.
        </ThemedText>
      </View>
    </ImageBackground>
  );
};

export default IndexPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
