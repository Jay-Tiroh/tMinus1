import React from "react";
import { View, ViewStyle } from "react-native";

type SpacerProps = {
  size?: number;
  horizontal?: boolean;
  style?: ViewStyle;
};

export const Spacer: React.FC<SpacerProps> = ({
  size = 8,
  horizontal = false,
  style,
}) => {
  return (
    <View style={[horizontal ? { width: size } : { height: size }, style]} />
  );
};
