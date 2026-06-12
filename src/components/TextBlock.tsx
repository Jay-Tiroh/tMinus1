import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import React from "react";
import { StyleProp, StyleSheet, TextStyle, View } from "react-native";

export type TextBlockProps = {
  title?: string;
  body?: string;
  titleStyle?: StyleProp<TextStyle>;
  bodyStyle?: StyleProp<TextStyle>;
};

const TextBlock = ({ title, body, titleStyle, bodyStyle }: TextBlockProps) => {
  return (
    <View style={styles.container}>
      {title && (
        <ThemedText
          size={24}
          weight="bold"
          color={Colors.snowGray}
          style={titleStyle}
        >
          {title}
        </ThemedText>
      )}
      {body && (
        <ThemedText size={14} color={Colors.textMidGray} style={bodyStyle}>
          {body}
        </ThemedText>
      )}
    </View>
  );
};

export default TextBlock;

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
});
