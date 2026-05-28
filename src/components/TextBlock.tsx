import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import React from "react";
import { StyleSheet, View } from "react-native";

type TextBlockProps = {
  title?: string;
  body?: string;
};

const TextBlock = ({ title, body }: TextBlockProps) => {
  return (
    <View style={styles.container}>
      <ThemedText size={24} weight="bold" color={Colors.snowGray}>
        {title}
      </ThemedText>
      <ThemedText size={14} color={Colors.textMidGray}>
        {body}
      </ThemedText>
    </View>
  );
};

export default TextBlock;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    gap: 8,
  },
});
