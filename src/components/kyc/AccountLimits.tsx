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

const steps = [
  {
    title: "Starter",
    body: "Trade locked · Withdraw locked · $100 deposit",
    number: 0,
  },
  {
    title: "Review",
    body: "Documents submitted · $250 deposit",
    number: 1,
  },
  {
    title: "Verified",
    body: "$5,000 trade · $2,500 withdrawal",
    number: 2,
  },
];

const AccountLimits = ({
  handlePress,
}: {
  handlePress: (step: number) => void;
}) => {
  const handleBackPress = () => {
    handlePress(0);
  };
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
      <Header
        onBackPress={handleBackPress}
        title="Account limits"
        body="Your verification level controls trade, withdrawal, and sandbox deposit access."
      />
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
        {steps.map((item) => (
          <View
            key={item.title}
            style={[
              GeneralStyles.box,
              {
                flexDirection: "row",
                padding: 20,
                backgroundColor:
                  item.number === steps.length - 1
                    ? Colors.surfaceGreenDeep
                    : Colors.backgroundDark,
                gap: 20,
              },
            ]}
          >
            <View
              style={[
                GeneralStyles.box,
                {
                  width: 32,
                  height: 32,
                  borderRadius: 16,
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor:
                    item.number === steps.length - 1
                      ? Colors.primaryClean
                      : Colors.surfaceNavy,
                },
              ]}
            >
              <ThemedText
                color={
                  item.number === steps.length - 1
                    ? Colors.backgroundInk
                    : Colors.textMidGray
                }
                weight="bold"
                size={13}
              >
                {item.number}
              </ThemedText>
            </View>
            <TextBlock
              title={item.title}
              body={item.body}
              titleStyle={{ fontSize: 16 }}
              bodyStyle={{
                fontSize: 12,
                maxWidth: 240,
              }}
            />
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

export default AccountLimits;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
