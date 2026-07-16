import { ThemedText } from "@/shared/components/ThemedText";
import { Colors } from "@/constants/Colors";
import React from "react";
import { StyleProp, StyleSheet, TextStyle, View } from "react-native";

export type TextBlockProps = {
  title?: string;
  body?: string;
  titleStyle?: StyleProp<TextStyle>;
  bodyStyle?: StyleProp<TextStyle>;
  numberOfLines?: number;
  numberOfLinesBody?: number;
};

const TextBlock = ({
  title,
  body,
  titleStyle,
  bodyStyle,
  numberOfLines,
  numberOfLinesBody,
}: TextBlockProps) => {
  return (
    <View style={styles.container}>
      {title && (
        <ThemedText
          size={24}
          weight="bold"
          color={Colors.snowGray}
          style={titleStyle}
          numberOfLines={numberOfLines}
          ellipsizeMode="tail"
        >
          {title}
        </ThemedText>
      )}
      {body && (
        <ThemedText
          size={14}
          color={Colors.textMidGray}
          style={bodyStyle}
          numberOfLines={numberOfLinesBody}
          ellipsizeMode="tail"
        >
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
