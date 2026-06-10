import { ThemedButton } from "@/components/ThemedButton";
import { Colors } from "@/constants/Colors";
import { Fonts } from "@/constants/Fonts";
import { Href, useRouter } from "expo-router";
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
    href: "/(tabs)/wallets/myQr",
  },
];

const ActionTabs = () => {
  const [activeTab, setActiveTab] = React.useState(Tabs[0].name);

  const handleTabPress = (tabName: string) => {
    setActiveTab(tabName);
    const tab = Tabs.find((t) => t.name === tabName);
    if (tab?.href) {
      router.push(tab.href as Href);
    }
  };

  const router = useRouter();

  return (
    <View style={styles.container}>
      {Tabs.map((tab, _) => (
        <ThemedButton
          key={tab.name}
          variant={"primary"}
          title={tab.name}
          textStyle={
            activeTab !== tab.name ? styles.inActiveText : styles.activeText
          }
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
    backgroundColor: Colors.surface,
  },
  inActiveText: {
    color: Colors.snowGray,
    fontFamily: Fonts.bold,
    fontSize: 13,
  },
  activeText: {
    fontFamily: Fonts.bold,
    fontSize: 13,
  },
  defaultButton: {
    width: 116,
    borderRadius: 14,
    height: 46,
  },
});
