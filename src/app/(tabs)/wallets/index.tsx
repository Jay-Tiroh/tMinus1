import React from "react";
import { StyleSheet, Text, View } from "react-native";

const Wallets = () => {
  return (
    <View style={styles.container}>
      <Text>Wallets</Text>
    </View>
  );
};

export default Wallets;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
