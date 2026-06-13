import SettingsScreen from "@/components/screens/tabs/user/SettingsScreen";
import React from "react";
import { StyleSheet } from "react-native";

const Settings = () => {
  return <SettingsScreen />;
};

export default Settings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
