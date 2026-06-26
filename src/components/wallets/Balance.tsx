import { Spacer } from "@/components/Spacer";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { GeneralStyles } from "@/constants/themes";
import { formatAmount } from "@/helpers/functions";
import { showErrorToast } from "@/hooks/showToast";
import useFiat from "@/hooks/useFiat";
import useWallet from "@/hooks/useWallet";
import Ionicons from "@expo/vector-icons/Ionicons";
import React, { useEffect } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

const Balance = () => {
  const [isVisible, setIsVisible] = React.useState(false);

  const toggleVisibility = () => {
    setIsVisible((prev) => !prev);
  };
  const { portfolioValueUsd, portfolioValue, isLoading, isError } =
    useWallet(5000);

  const balance = isVisible ? formatAmount(portfolioValue) : "*******";
  const balanceUSD = isVisible ? formatAmount(portfolioValueUsd) : "*******";
  const { symbol } = useFiat();
  useEffect(() => {
    if (isError) {
      showErrorToast({
        title: "Error fetching balance",
        message: "Unable to retrieve portfolio value. Please try again later.",
      });
    }
  }, [isError]);

  return (
    <View
      style={{
        ...GeneralStyles.box,
        backgroundColor: Colors.surfaceGreenNight,
        height: 150,
        padding: 20,
        borderRadius: 22,
      }}
    >
      <ThemedText color={Colors.textMuted} size={14}>
        Total Portfolio Value
      </ThemedText>
      <Spacer size={8} />
      <View
        style={{
          flexDirection: "row",
          width: "100%",
          justifyContent: "space-between",
        }}
      >
        <View>
          {isLoading ? (
            <ActivityIndicator />
          ) : (
            <ThemedText size={32} weight="bold" color={Colors.snowGray}>
              {(symbol ?? "$") + balance}
            </ThemedText>
          )}
          <Spacer size={6} />
          <ThemedText color={Colors.textSecondary} size={14}>
            ${balanceUSD}
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
