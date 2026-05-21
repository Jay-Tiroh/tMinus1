import ActionsList from "@/components/activity/ActionsList";
import Recent from "@/components/activity/RecentActivity";
import React from "react";
import { StyleSheet, View } from "react-native";

const ActivityScreen = () => {
  return (
    <View style={styles.container}>
      <ActionsList />
      <Recent />
    </View>
  );
};

export default ActivityScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 24,
    gap: 30,
  },
});
