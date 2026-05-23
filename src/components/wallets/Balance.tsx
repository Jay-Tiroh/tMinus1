import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import useWallet from "@/hooks/useWallet";
import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";
import { StyleSheet, View } from "react-native";

const Balance = () => {
  const [isVisible, setIsVisible] = React.useState(false);

  const toggleVisibility = () => {
    setIsVisible((prev) => !prev);
  };
  const { wallet, isLoading, isError } = useWallet();
  console.log(wallet?.data?.wallet?.balances);
  const balance = isVisible ? wallet?.data?.portfolioValueUsd : "*******";
  const balanceUSD = isVisible ? "$468,554.23" : "*******";

  return (
    <View style={styles.container}>
      <ThemedText color={Colors.textMuted} size={14}>
        Current Balance
      </ThemedText>
      <View
        style={{
          flexDirection: "row",
          width: "100%",
          justifyContent: "space-between",
        }}
      >
        <View>
          <ThemedText size={32} weight="bold" color={Colors.white}>
            {balance}
          </ThemedText>
          <ThemedText color={Colors.textSecondary} size={14}>
            {balanceUSD}
          </ThemedText>
        </View>
        {isVisible ? (
          <Ionicons
            name="eye-off"
            size={24}
            color={Colors.textMuted}
            style={{}}
            onPress={toggleVisibility}
          />
        ) : (
          <Ionicons
            name="eye"
            size={24}
            color={Colors.textMuted}
            style={{}}
            onPress={toggleVisibility}
          />
        )}
      </View>
    </View>
  );
};

export default Balance;

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    gap: 12,
    marginBottom: 30,
  },
});
