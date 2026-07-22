import { Colors } from "@/constants/Colors";
import { GeneralStyles } from "@/constants/themes";
import BadgeStuff from "@/shared/components/BadgeStuff";
import { LabelValueItem } from "@/shared/components/LabelValueItem";
import { Spacer } from "@/shared/components/Spacer";
import useFiat from "@/shared/hooks/useFiat";
import { vs } from "@/utils/responsive";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import React from "react";
import { View } from "react-native";

export const InProgress = () => {
  const { symbol, convertFromUSD } = useFiat();
  const currency = symbol ?? "$";
  const config = [
    {
      label: "Current level",
      value: "Review",
    },
    {
      label: "Sandbox deposit",
      value: currency + convertFromUSD(250) + " max",
    },
  ];

  return (
    <View>
      <Spacer size={12} />
      <BadgeStuff
        IconComponent={
          <FontAwesome5
            name="ellipsis-h"
            color={Colors.warningAmber}
            size={48}
          />
        }
        outerColor={Colors.warningAmber}
        title="Pending review"
        desc="You can browse markets while we review your documents. Trading and withdrawals stay locked."
      />
      <Spacer size={80} />
      <View
        style={{
          ...GeneralStyles.wrapper,
          gap: vs(14),
        }}
      >
        {config.map((item) => (
          <LabelValueItem
            key={item.label}
            label={item.label}
            value={item.value}
          />
        ))}
      </View>
    </View>
  );
};

export default InProgress;
