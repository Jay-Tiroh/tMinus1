import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import React from "react";
import { Pressable, StyleSheet, View } from "react-native";

const TAB_ITEM_HEIGHT = 38;
const TAB_HEIGHT = 46;
const TAB_RADIUS = (TAB_HEIGHT / TAB_ITEM_HEIGHT) * 12;

type SwitcherProps = {
  tabs: readonly string[];
  activeTab: string;
  onTabPress: (tab: string) => void;
};

const Switcher = React.memo(function Switcher({
  tabs,
  activeTab,
  onTabPress,
}: SwitcherProps) {
  return (
    <View style={styles.tab}>
      {tabs.map((tab) => (
        <Pressable
          key={tab}
          onPress={() => onTabPress(tab)}
          style={[styles.tabItem, activeTab === tab && styles.activeTabItem]}
        >
          <ThemedText
            size={14}
            color={activeTab === tab ? Colors.textFaint : Colors.textMuted}
          >
            {tab}
          </ThemedText>
        </Pressable>
      ))}
    </View>
  );
});

export default Switcher;

const styles = StyleSheet.create({
  tab: {
    flexDirection: "row",
    borderRadius: TAB_RADIUS,
    backgroundColor: Colors.surfaceCard,
    width: "100%",
    height: TAB_HEIGHT,
    justifyContent: "space-evenly",
    alignItems: "center",
    paddingHorizontal: 4,
  },
  tabItem: {
    height: TAB_ITEM_HEIGHT,
    width: "25%",
    justifyContent: "center",
    alignItems: "center",
  },
  activeTabItem: {
    borderRadius: 12,
    backgroundColor: Colors.surface,
  },
});
