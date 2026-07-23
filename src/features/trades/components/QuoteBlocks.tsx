import { Colors } from "@/constants/Colors";
import { LabelValueItem } from "@/shared/components/LabelValueItem";
import { Spacer } from "@/shared/components/Spacer";
import TextBlock from "@/shared/components/TextBlock";
import { ThemedText } from "@/shared/components/ThemedText";
import { ms, s, vs } from "@/shared/utils/responsive";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import React from "react";
import { View } from "react-native";

export const QuotePreview = ({
  quote,
  timeLeft,
}: {
  quote: any;
  timeLeft: number;
}) => {
  const formattedTime = `00:${timeLeft.toString().padStart(2, "0")}`;

  const config = [
    {
      label: "Action",
      value: quote.type.charAt(0).toUpperCase() + quote.type.slice(1),
    },
    { label: "From", value: `${quote.fromAmount} ${quote.fromAsset}` },
    { label: "To", value: `${quote.toAmount} ${quote.toAsset}` },
    {
      label: "Rate",
      value: `1 ${quote.fromAsset} = ${quote.rate} ${quote.toAsset}`,
    },
    { label: "Fee", value: `${quote.feeAmount} ${quote.fromAsset}` },
    {
      label: "Estimated receive",
      value: `${quote.toAmount} ${quote.toAsset}`,
      valueColor: Colors.primaryClean,
    },
  ];

  return (
    <>
      <View
        style={{
          width: "100%",
          height: vs(86),
          backgroundColor: Colors.surfaceGreenDeep,
          borderRadius: ms(18),
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: s(20),
        }}
      >
        <ThemedText size={12} weight="medium" color={Colors.cloudGray}>
          Expires in
        </ThemedText>
        <ThemedText size={22} weight="bold" color={Colors.primaryClean}>
          {formattedTime}
        </ThemedText>
      </View>
      <Spacer size={32} />
      <View style={{ gap: vs(10) }}>
        {config.map((item) => (
          <LabelValueItem
            key={item.label}
            label={item.label}
            value={item.value}
            valueWeight="medium"
            valueSize={12}
            valueColor={item.valueColor}
          />
        ))}
      </View>
    </>
  );
};

export const QuoteExpired = ({ quote }: { quote: any }) => {
  const config = [
    { label: "Expired quote", value: quote.id },
    { label: "Previous receive", value: `${quote.toAmount} ${quote.toAsset}` },
  ];

  return (
    <>
      <View
        style={{
          width: "100%",
          height: vs(238),
          backgroundColor: Colors.backgroundDark,
          borderRadius: ms(22),
          alignItems: "center",
          justifyContent: "center",
          paddingHorizontal: s(20),
          gap: vs(30),
        }}
      >
        <View
          style={{
            width: s(88),
            height: vs(88),
            backgroundColor: Colors.warningAmber + "2E",
            borderRadius: ms(44),
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <FontAwesome5
            name="exclamation"
            size={35}
            color={Colors.warningAmber}
          />
        </View>
        <TextBlock
          title="This quote is no longer valid"
          titleStyle={{ fontSize: ms(19), textAlign: "center" }}
          bodyStyle={{
            fontSize: ms(12),
            textAlign: "center",
            maxWidth: s(290),
          }}
          body="Get a new quote so the rate, fee, and receive amount are current."
        />
      </View>
      <Spacer size={64} />
      <View style={{ gap: vs(10) }}>
        {config.map((item) => (
          <LabelValueItem
            key={item.label}
            label={item.label}
            value={item.value}
            valueWeight="medium"
            valueSize={12}
          />
        ))}
      </View>
    </>
  );
};
