import { ThemedButton } from "@/shared/components/ThemedButton";
import { Colors } from "@/constants/Colors";
import { Fonts } from "@/constants/Fonts";
import { Href, useRouter } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";
type Tab = {
  name: "Deposit" | "Withdraw" | "Transfer";
  href: Href;
  bgColor: string;
};
const Tabs: Tab[] = [
  {
    name: "Deposit",
    href: "/wallets/deposit/deposit-asset-selection",
    bgColor: Colors.primaryClean,
  },
  {
    name: "Withdraw",
    href: "/wallets/withdraw/withdraw-form",
    bgColor: Colors.warningAmber,
  },
  {
    name: "Transfer",
    href: "/wallets/transfer/transfer",
    bgColor: Colors.infoBright,
  },
];

const ActionTabs = () => {
  const [_activeTab, setActiveTab] = React.useState(Tabs[0].name);

  const handleTabPress = (tabName: "Deposit" | "Withdraw" | "Transfer") => {
    setActiveTab(tabName);
    const tab = Tabs.find((t) => t.name === tabName);
    if (tab?.href) {
      router.replace(tab.href);
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
            tab.name !== "Deposit" ? styles.inActiveText : styles.activeText
          }
          style={[
            tab.name !== "Deposit" ? styles.inActiveButton : undefined,
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
