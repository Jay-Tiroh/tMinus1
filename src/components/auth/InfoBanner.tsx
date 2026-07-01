import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { ms, s, vs } from "@/utils/responsive";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import React from "react";
import { StyleSheet, View } from "react-native";

type InfoBannerProps = {
  type: "success" | "warning";
  title: string;
  desc: string;
};

export const InfoBanner = ({ type, title, desc }: InfoBannerProps) => {
  const isSuccess = type === "success";
  const iconName = isSuccess ? "check" : "exclamation";
  const iconColor = isSuccess ? Colors.primaryClean : Colors.warningAmber;
  const circleBg = isSuccess ? Colors.surfaceGreenForest : "#3A2A20";

  return (
    <View style={styles.container}>
      <View style={[styles.iconCircle, { backgroundColor: circleBg }]}>
        <MaterialCommunityIcons name={iconName} size={16} color={iconColor} />
      </View>
      <View style={styles.textStack}>
        <ThemedText size={15} weight="bold" color={Colors.snowGray}>
          {title}
        </ThemedText>
        <ThemedText
          size={13}
          color={Colors.textMidGray}
          style={{ lineHeight: ms(18) }}
        >
          {desc}
        </ThemedText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: Colors.surfaceNavy,
    borderRadius: ms(16),
    padding: ms(16),
    gap: s(16),
    width: "100%",
  },
  iconCircle: {
    width: s(36),
    height: vs(36),
    borderRadius: ms(18),
    alignItems: "center",
    justifyContent: "center",
    marginTop: vs(2),
  },
  textStack: {
    flex: 1,
    gap: vs(4),
    justifyContent: "center",
  },
});
