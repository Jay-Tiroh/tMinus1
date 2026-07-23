import { ThemedText } from "@/shared/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { GeneralStyles } from "@/constants/themes";
import React from "react";
import { StyleSheet, View } from "react-native";

type NoticeType = "warning" | "info";

interface WalletNoticeBoxProps {
  title: string;
  description: string;
  type?: NoticeType;
}

export const WalletNoticeBox = ({
  title,
  description,
  type = "info",
}: WalletNoticeBoxProps) => {
  const isWarning = type === "warning";

  return (
    <View
      style={[
        GeneralStyles.box,
        styles.container,
        isWarning && styles.warningContainer,
      ]}
    >
      <ThemedText
        weight="bold"
        size={14}
        color={Colors.snowGray}
        style={styles.title}
      >
        {title}
      </ThemedText>
      <ThemedText
        size={13}
        color={isWarning ? Colors.warningGold : Colors.textMidGray}
      >
        {description}
      </ThemedText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  warningContainer: {
    backgroundColor: Colors.warningBrown + "30",
    borderColor: Colors.warningBrown,
    borderWidth: 1,
  },
  title: {
    marginBottom: 8,
  },
});
