import React from "react";
import { StyleSheet, Text, View } from "react-native";

const Markets = () => {
  return (
    <View style={styles.container}>
      <Text>Markets</Text>
    </View>
  );
};

export default Markets;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
