import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import React from "react";
import { TextStyle } from "react-native";

const ChangeText = ({
  change,
  style,
}: {
  change: number;
  style?: TextStyle;
}) => {
  const isPositive = change >= 0;
  return (
    <ThemedText
      style={style}
      size={14}
      color={isPositive ? Colors.profit : Colors.loss}
    >
      {isPositive ? "+" : ""}
      {change.toFixed(2)}%
    </ThemedText>
  );
};

export default ChangeText;
