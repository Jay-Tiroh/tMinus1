import ChangeText from "@/components/ChangeText";
import { CryptoIcon } from "@/components/CryptoIcon";
import Chart from "@/components/LineChart";
import { ThemedButton } from "@/components/ThemedButton";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { useAssetChart } from "@/hooks/useAssetChart";
import { useAppDispatch } from "@/store/hooks";
import { openSheet } from "@/store/slices/BottomSheetSlice";
import { AssetDetailsResponse } from "@/types/assets";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { Dimensions, StyleSheet, View } from "react-native";

const WIDTH = Dimensions.get("window").width;

const TradesScreen = () => {
  const dispatch = useAppDispatch();
  const { coin = "btc" } = useLocalSearchParams();
  const {
    coinInfo: coinDetails,
    isLoading,
    chart,
  } = useAssetChart(coin as string, false, 15000);
  const chartWidth = 0.8 * WIDTH;
  const isPositive = coinDetails?.change24h && coinDetails.change24h > 0;
  // console.log(chart);
  const handleBuyPress = () => {
    dispatch(openSheet("tradeSheet"));
  };
  return (
    <View style={styles.content}>
      <TradeHeader coinDetails={coinDetails} />
      <Chart
        data={chart}
        isPositive={isPositive as boolean}
        width={chartWidth}
        height={chartWidth / 2}
      />

      <View style={styles.btnContainer}>
        <ThemedButton
          title="Buy"
          variant="primary"
          style={styles.btn}
          onPress={handleBuyPress}
        />
        <ThemedButton title="Sell" variant="red" style={styles.btn} />
      </View>
    </View>
  );
};

export default TradesScreen;

const styles = StyleSheet.create({
  content: {
    flex: 1,
    alignItems: "center",
    paddingTop: 24,
    width: "100%",
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    width: "100%",
    paddingHorizontal: 24,
  },
  coinDetails: {
    gap: 8,
    width: "100%",
  },
  btn: {
    width: "50%",
    borderRadius: 0,
  },
  btnContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
});

function TradeHeader({
  coinDetails,
}: {
  coinDetails: AssetDetailsResponse | undefined;
}) {
  return (
    <View style={styles.coinDetails}>
      <View style={styles.row}>
        {coinDetails?.symbol && (
          <CryptoIcon symbol={coinDetails?.symbol} size={20} />
        )}
        <ThemedText size={16} weight="bold" color={Colors.textFaint}>
          {coinDetails?.name} ({coinDetails?.symbol.toUpperCase()})
        </ThemedText>
      </View>
      <View style={styles.row}>
        <ThemedText size={28} weight="bold" color="white">
          20,005.00
        </ThemedText>
        <ChangeText change={coinDetails?.change24h ?? NaN} />
      </View>
      <View style={styles.row}>
        <AntDesign name="swap" size={24} color={Colors.textFaint} />
        <ThemedText size={14} color={Colors.textFaint}>
          {coinDetails?.symbol.toUpperCase()}/BUSD
        </ThemedText>
      </View>
    </View>
  );
}
