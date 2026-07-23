import { Colors } from "@/constants/Colors";
import { Fonts } from "@/constants/Fonts";
import { ThemedButton } from "@/shared/components/ThemedButton";
import { ms, s, vs } from "@/shared/utils/responsive";
import React from "react";
import { StyleSheet, View } from "react-native";

export const TABS = ["All", "Gainers", "Watchlist"];

type MarketsTabsProps = {
  tabs: string[];
  activeTab: string;
  onTabChange: (tab: string) => void;
};

export const MarketsTabs = ({
  tabs,
  activeTab,
  onTabChange,
}: MarketsTabsProps) => {
  return (
    <View style={styles.tabsContainer}>
      {tabs?.map((tab) => (
        <ThemedButton
          title={tab}
          variant={tab === activeTab ? "primary" : "secondary"}
          key={tab}
          style={[
            styles.tab,
            tab !== activeTab && { backgroundColor: Colors.surfaceNavy },
          ]}
          textStyle={{
            fontSize: ms(14),
            color: tab !== activeTab ? Colors.snowGray : Colors.backgroundInk,
            fontFamily: Fonts.medium,
          }}
          onPress={() => onTabChange(tab)}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  tabsContainer: {
    flexDirection: "row",
    gap: s(24),
  },
  tab: {
    height: vs(32),
    maxWidth: s(90),
  },
});
