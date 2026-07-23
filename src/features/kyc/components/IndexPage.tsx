import { Colors } from "@/constants/Colors";
import { Fonts } from "@/constants/Fonts";
import { GeneralStyles } from "@/constants/themes";
import { LabelValueItem } from "@/shared/components/LabelValueItem";
import { Spacer } from "@/shared/components/Spacer";
import TextBlock from "@/shared/components/TextBlock";
import { ThemedText } from "@/shared/components/ThemedText";
import { ms, s, vs } from "@/shared/utils/responsive";
import React from "react";
import { View } from "react-native";
import { Template } from "./Template";

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

export const IndexPage = ({
  handlePress,
}: {
  handlePress: (step: number) => void;
}) => {
  return (
    <Template
      headerProps={{ goBack: true }}
      ctaProps={{
        variant: "primary",
        title: "Start Verification",
        textStyle: {
          fontSize: ms(14),
          fontFamily: Fonts.bold,
        },
        onPress: () => handlePress(1),
      }}
      ctaFooter={
        <ThemedText
          color={Colors.textMidGray}
          size={11}
          style={{ textAlign: "center" }}
        >
          You can continue browsing markets without verification.
        </ThemedText>
      }
    >
      <View style={[GeneralStyles.wrapper]}>
        <View
          style={[
            GeneralStyles.box,
            {
              padding: ms(24),
              justifyContent: "flex-end",
              alignItems: "center",
              borderRadius: ms(18),
              minHeight: vs(168),
              position: "relative",
            },
          ]}
        >
          <TextBlock
            title="Starter Account"
            body="Browse markets now. Verify to trade, withdraw, and raise sandbox deposit limits."
            titleStyle={{ textAlign: "center", fontSize: ms(22), zIndex: 1 }}
            bodyStyle={{
              textAlign: "center",
              fontSize: ms(12),
              zIndex: 1,
              maxWidth: s(270),
            }}
          />
          <View
            style={{
              width: s(92),
              height: vs(92),
              borderRadius: ms(46),
              backgroundColor: Colors.surfaceGreenDeep,
              alignItems: "center",
              paddingTop: vs(24),
              position: "absolute",
              top: vs(16),
            }}
          >
            <ThemedText weight="bold" color={Colors.primaryClean} size={12}>
              Level 0
            </ThemedText>
          </View>
        </View>
      </View>
      <Spacer size={30} />
      <View style={[GeneralStyles.wrapper, { gap: vs(14) }]}>
        {features.map((item) => (
          <LabelValueItem
            label={item.label}
            value={item.value}
            key={item.label}
            valueColor={
              item.value === "Locked" ? Colors.lossBright : Colors.snowGray
            }
          />
        ))}
      </View>
    </Template>
  );
};

export default IndexPage;
