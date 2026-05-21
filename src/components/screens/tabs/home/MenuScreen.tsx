import MenuList from "@/components/home/MenuList";
import MenuTab from "@/components/home/MenuTab";
import { Colors } from "@/constants/Colors";
import React from "react";
import { ScrollView, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const MenuScreen = () => {
  const insets = useSafeAreaInsets();
  const TabsBottomPadding = insets.bottom + 50;
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[
        styles.container,
        { paddingBottom: TabsBottomPadding },
      ]}
    >
      <MenuTab />
      <MenuList />
    </ScrollView>
  );
};

export default MenuScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: "center",
    backgroundColor: Colors.surfaceDark,
  },
});
