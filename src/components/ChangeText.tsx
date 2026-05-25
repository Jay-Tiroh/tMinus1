import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import React from "react";

const ChangeText = ({ change }: { change: number }) => {
  const isPositive = change >= 0;
  return (
    <ThemedText size={14} color={isPositive ? Colors.profit : Colors.loss}>
      {isPositive ? "+" : ""}
      {change.toFixed(2)}%
    </ThemedText>
  );
};

export default ChangeText;
