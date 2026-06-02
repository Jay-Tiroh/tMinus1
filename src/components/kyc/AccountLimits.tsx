// app/kyc/AccountLimits.tsx
import Template from "@/components/kyc/Template";
import { Spacer } from "@/components/Spacer";
import TextBlock from "@/components/TextBlock";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { Fonts } from "@/constants/Fonts";
import { GeneralStyles } from "@/constants/themes";
import { useGoToRoute } from "@/hooks/useGoToRoute";
import React from "react";
import { View } from "react-native";

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

  const handlePush = useGoToRoute("/kyc/step1");

  return (
    <Template
      headerProps={{
        onBackPress: handleBackPress,
        title: "Account limits",
        body: "Your verification level controls trade, withdrawal, and sandbox deposit access.",
      }}
      ctaProps={{
        variant: "primary",
        title: "Continue",
        onPress: handlePush,
        textStyle: {
          fontSize: 14,
          fontFamily: Fonts.bold,
        },
      }}
    >
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
      <Spacer size={52} />
      <View style={[GeneralStyles.wrapper]}>
        <View
          style={[
            GeneralStyles.box,
            {
              padding: 16,
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 16,
              minHeight: 86,
            },
          ]}
        >
          <TextBlock
            body="Verification is required before executing quotes or requesting withdrawals."
            bodyStyle={{
              color: Colors.snowGray,
              fontSize: 13,
              maxWidth: 300,
            }}
          />
        </View>
      </View>
    </Template>
  );
};

export default AccountLimits;
