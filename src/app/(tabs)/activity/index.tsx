import ActionsList from "@/components/activity/ActionsList";
import Recent from "@/components/activity/RecentActivity";
import React from "react";
import { StyleSheet, View } from "react-native";

const Activity = () => {
  return (
    <View style={styles.container}>
      <ActionsList />
      <Recent />
    </View>
  );
};

export default Activity;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 24,
    gap: 30,
  },
});
