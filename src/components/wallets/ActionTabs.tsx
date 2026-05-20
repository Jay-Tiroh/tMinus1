import { ThemedButton } from "@/components/ThemedButton";
import { Colors } from "@/constants/Colors";
import React from "react";
import { StyleSheet, View } from "react-native";

const Tabs = [
  {
    name: "Deposit",
  },
  {
    name: "Withdraw",
  },
  {
    name: "Transfer",
  },
];

const ActionTabs = () => {
  const [activeTab, setActiveTab] = React.useState(Tabs[0].name);

  const handleTabPress = (tabName: string) => {
    setActiveTab(tabName);
  };

  return (
    <View style={styles.container}>
      {Tabs.map((tab, _) => (
        <ThemedButton
          key={tab.name}
          variant={"primary"}
          title={tab.name}
          textStyle={activeTab !== tab.name ? styles.inActiveText : undefined}
          style={[
            activeTab !== tab.name ? styles.inActiveButton : undefined,
            styles.defaultButton,
          ]}
          onPress={() => handleTabPress(tab.name)}
        />
      ))}
    </View>
  );
};

export default ActionTabs;

const styles = StyleSheet.create({
  container: {
    justifyContent: "space-between",
    width: "100%",
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
  },
  inActiveButton: {
    backgroundColor: Colors.surfaceMid,
  },
  inActiveText: {
    color: Colors.textMuted,
  },
  defaultButton: {
    width: 116,
    borderRadius: 8,
    height: 46,
  },
});
