import { FontKey, Fonts } from "@/constants/Fonts";
import React from "react";
import { StyleProp, Text, TextProps, TextStyle } from "react-native";

type ThemedTextProps = TextProps & {
  weight?: FontKey;
  size?: number;
  letterSpacing?: number;
  style?: StyleProp<TextStyle>;
};

export const ThemedText: React.FC<ThemedTextProps> = ({
  weight = "regular",
  size = 14,
  letterSpacing,
  style,
  ...rest
}) => {
  // convert percentage -> absolute px
  const computedLetterSpacing =
    typeof letterSpacing === "number"
      ? (letterSpacing / 100) * size
      : undefined;

  return (
    <Text
      {...rest}
      style={[
        {
          fontFamily: Fonts[weight],
          fontSize: size,
          letterSpacing: computedLetterSpacing,
        },
        style,
      ]}
    />
  );
};
