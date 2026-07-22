import { Colors } from "@/constants/Colors";
import Chart from "@/features/markets/components/LineChart";
import { formatCurrency } from "@/helpers/functions";
import { useAssetChart } from "@/hooks/useAssetChart";
import useFiat from "@/shared/hooks/useFiat";
import ChangeText from "@/shared/components/ChangeText";
import { CryptoIcon } from "@/shared/components/CryptoIcon";
import { ThemedText } from "@/shared/components/ThemedText";
import { Href, useRouter } from "expo-router";
import React, { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";

type CoinItemProps = {
  name: string;
  alias: string;
  amountInUsd?: number;
  change?: number;
  showChange?: boolean;
  showChart?: boolean;
  useHrefs?: boolean;
  onLongPress?: () => void;
};

export const CoinItem = ({
  name,
  alias,
  amountInUsd,
  change,
  showChange = false,
  showChart = false,
  useHrefs = false,
  onLongPress,
}: CoinItemProps) => {
  const isPositive = !!change && change > 0;
  const { chart: chartData } = useAssetChart(alias, !showChart);
  const [chartVisible, setChartVisible] = useState(false);
  const router = useRouter();
  const { symbol, convertFromUSD } = useFiat();

  const route = alias ? "/(tabs)/trades/" + alias + "/asset" : null;

  const handlePress = () => {
    if (useHrefs && route) {
      router.replace(route as Href);
    }
  };

  return (
    <Pressable
      onPress={handlePress}
      style={styles.container}
      onLayout={() => setChartVisible(true)}
      onLongPress={onLongPress}
      delayLongPress={1000}
    >
      <View style={styles.left}>
        <CryptoIcon symbol={alias} size={40} />
        <View style={styles.nameBlock}>
          <ThemedText weight="bold" size={14} color={Colors.snowGray}>
            {name}
          </ThemedText>
          <ThemedText size={14} color={Colors.textMidGray}>
            {alias}
          </ThemedText>
        </View>
      </View>

      {showChart && chartVisible && chartData.length > 0 && (
        <Chart isPositive={isPositive} data={chartData} width={120} />
      )}

      <View style={styles.right}>
        <ThemedText weight="bold" size={12} color={Colors.white}>
          {symbol + formatCurrency(convertFromUSD(amountInUsd as number))}
        </ThemedText>

        {showChange && change != null && <ChangeText change={change} />}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    backgroundColor: Colors.backgroundDark,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: 13,
  },
  nameBlock: {
    minWidth: 70,
    gap: 14,
    justifyContent: "center",
  },
  right: {
    minWidth: 80,
    alignItems: "flex-end",
    gap: 14,
    justifyContent: "center",
  },
});
