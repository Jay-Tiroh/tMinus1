import { ThemedButton } from "@/components/ThemedButton";
import { useAppDispatch } from "@/store/hooks";
import { openSheet } from "@/store/slices/BottomSheetSlice";
import React from "react";
import { StyleSheet, View } from "react-native";

const TradesScreen = () => {
  const dispatch = useAppDispatch();

  return (
    <View style={styles.content}>
      <ThemedButton
        title="Open Bottom Sheet"
        onPress={() => dispatch(openSheet("tradeDetails"))}
      />
    </View>
  );
};

export default TradesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: "#f0f0f0",
  },
});
