import BadgeStuff from "@/components/BadgeStuff";
import { LabelValueItem } from "@/components/LabelValueItem";
import { Spacer } from "@/components/Spacer";
import { Colors } from "@/constants/Colors";
import { GeneralStyles } from "@/constants/themes";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import React from "react";
import { View } from "react-native";
const InProgress = () => {
  const config = [
    {
      label: "Current level",
      value: "Review",
    },
    {
      label: "Sandbox deposit",
      value: "$250 max",
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
          gap: 14,
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
