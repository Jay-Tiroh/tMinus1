import { Colors } from "@/constants/Colors";
import { Fonts } from "@/constants/Fonts";
import { ThemedButton } from "@/shared/components/ThemedButton";
import { ms, s, vs } from "@/shared/utils/responsive";
import React from "react";
import { StyleSheet, View } from "react-native";

interface TradeNavigationTabsProps {
  activeTab: "order-book" | "recent-trades";
  onSelectTab: (tab: "order-book" | "recent-trades") => void;
}

export const TradeNavigationTabs = ({
  activeTab,
  onSelectTab,
}: TradeNavigationTabsProps) => {
  return (
    <View style={styles.tabsContainer}>
      <ThemedButton
        title="Order book"
        variant={activeTab === "order-book" ? "primary" : "secondary"}
        style={[
          styles.tab,
          activeTab !== "order-book" && { backgroundColor: Colors.surfaceNavy },
        ]}
        textStyle={[
          styles.tabText,
          {
            color:
              activeTab === "order-book" ? Colors.surfaceNavy : Colors.snowGray,
          },
        ]}
        onPress={() => onSelectTab("order-book")}
      />
      <ThemedButton
        title="Trades"
        variant={activeTab === "recent-trades" ? "primary" : "secondary"}
        style={[
          styles.tab,
          activeTab !== "recent-trades" && {
            backgroundColor: Colors.surfaceNavy,
          },
        ]}
        textStyle={[
          styles.tabText,
          {
            color:
              activeTab === "recent-trades"
                ? Colors.surfaceNavy
                : Colors.snowGray,
          },
        ]}
        onPress={() => onSelectTab("recent-trades")}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  tabsContainer: {
    flexDirection: "row",
    gap: s(12),
  },
  tab: {
    height: vs(36),
    minWidth: s(100),
    maxWidth: s(150),
    borderRadius: ms(18),
  },
  tabText: {
    fontSize: ms(13),
    fontFamily: Fonts.medium,
  },
});
