import { FontKey, Fonts } from "@/constants/Fonts";
import React from "react";
import { StyleProp, Text, TextProps, TextStyle } from "react-native";

type ThemedTextProps = TextProps & {
  weight?: FontKey;
  size?: number;
  letterSpacing?: number;
  color?: string;
  style?: StyleProp<TextStyle>;
};

export const ThemedText: React.FC<ThemedTextProps> = ({
  weight = "regular",
  size = 14,
  letterSpacing = 2.64,
  color,
  style,
  ...rest
}) => {
  // convert percentage -> absolute px
  const computedLetterSpacing = (letterSpacing / 100) * size;

  return (
    <Text
      {...rest}
      style={[
        {
          fontFamily: Fonts[weight],
          fontSize: size,
          letterSpacing: computedLetterSpacing,
          color,
        },
        style,
      ]}
    />
  );
};
