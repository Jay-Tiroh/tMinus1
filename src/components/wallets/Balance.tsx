import { Spacer } from "@/components/Spacer";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { GeneralStyles } from "@/constants/themes";
import { formatAmount } from "@/helpers/functions";
import { showErrorToast } from "@/hooks/showToast";
import useFiat from "@/hooks/useFiat";
import { useGoToRoute } from "@/hooks/useGoToRoute";
import useWallet from "@/hooks/useWallet";
import { ms, s, vs } from "@/utils/responsive";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React, { useEffect } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

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

  const toHistory = useGoToRoute("/wallets/portfolio-history");

  return (
    <View
      style={[
        GeneralStyles.box,
        {
          backgroundColor: Colors.surfaceGreenNight,
          height: vs(150),
          padding: ms(20),
          borderRadius: ms(22),
        },
      ]}
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
        <View style={{ justifyContent: "space-between", gap: vs(12) }}>
          <Ionicons
            name={isVisible ? "eye-off" : "eye"}
            size={ms(24)}
            color={Colors.textMuted}
            onPress={toggleVisibility}
          />
        </View>
      </View>
      <TouchableOpacity
        style={{
          alignSelf: "flex-end",
          flexDirection: "row",
          alignItems: "center",
          gap: s(4),
        }}
        onPress={toHistory}
      >
        <MaterialIcons name="history" size={ms(20)} color={Colors.textFaint} />
        <ThemedText color={Colors.textFaint} size={11}>
          Portfolio History
        </ThemedText>
      </TouchableOpacity>
    </View>
  );
};

export default Balance;

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    gap: vs(12),
    marginBottom: vs(30),
  },
});
