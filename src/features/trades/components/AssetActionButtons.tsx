import { Colors } from "@/constants/Colors";
import { GeneralStyles } from "@/constants/themes";
import { ThemedText } from "@/shared/components/ThemedText";
import { ms, s, vs } from "@/utils/responsive";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

export interface ActionItem {
  title: string;
  onPress: () => void;
}

interface AssetActionButtonsProps {
  actions: ActionItem[];
}

export const AssetActionButtons = ({ actions }: AssetActionButtonsProps) => {
  return (
    <View style={[GeneralStyles.wrapper, styles.tradeActions]}>
      {actions.map((item) => (
        <TouchableOpacity
          key={item.title}
          onPress={item.onPress}
          style={styles.actionButton}
        >
          <ThemedText
            color={
              item.title === "Alert" ? Colors.primaryClean : Colors.snowGray
            }
            size={12}
            weight="medium"
          >
            {item.title}
          </ThemedText>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  tradeActions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  actionButton: {
    borderRadius: ms(14),
    backgroundColor: Colors.surfaceNavy,
    width: s(112),
    height: vs(46),
    alignItems: "center",
    justifyContent: "center",
  },
});
