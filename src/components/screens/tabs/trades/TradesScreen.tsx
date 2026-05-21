import React from "react";
import { StyleSheet, Text, View } from "react-native";

const TradesScreen = () => {
  return (
    <View style={styles.container}>
      <Text>Trades</Text>
    </View>
  );
};

export default TradesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
