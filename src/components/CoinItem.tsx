import Chart from "@/components/LineChart";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { formatCurrency } from "@/helpers/functions";
import { useAssetChart } from "@/hooks/useAssetChart";
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { SvgProps } from "react-native-svg";

type CoinItemProps = {
  name: string;
  alias: string;
  amount: number;
  amountInUsd?: number;
  showAmountInUsd?: boolean;
  change?: number;
  showChange?: boolean;
  showChart?: boolean;
  icon: React.FC<SvgProps>;
};

const CoinItem = ({
  name,
  alias,
  amount,
  amountInUsd,
  change,
  icon: Icon,
  showAmountInUsd = false,
  showChange = false,
  showChart = false,
}: CoinItemProps) => {
  const isPositive = !!change && change > 0;
  const chartData = useAssetChart(alias, !showChart);
  const [chartVisible, setChartVisible] = useState(false);

  return (
    <View style={styles.container} onLayout={() => setChartVisible(true)}>
      <View style={styles.left}>
        <Icon width={40} height={40} />
        <View style={styles.nameBlock}>
          <ThemedText weight="bold" size={14} color={Colors.white}>
            {name}
          </ThemedText>
          <ThemedText size={14} color={Colors.textMuted}>
            {alias}
          </ThemedText>
        </View>
      </View>

      {showChart && chartVisible && chartData.length > 0 && (
        <Chart isPositive={isPositive} data={chartData} />
      )}

      <View style={styles.right}>
        <ThemedText weight="bold" size={14} color={Colors.white}>
          {formatCurrency(amount)}
        </ThemedText>
        {showAmountInUsd && amountInUsd != null && (
          <ThemedText size={14} color={Colors.textMuted}>
            ${formatCurrency(amountInUsd)}
          </ThemedText>
        )}
        {showChange && change != null && (
          <ThemedText
            size={14}
            color={isPositive ? Colors.profit : Colors.loss}
          >
            {isPositive ? "+" : ""}
            {change.toFixed(2)}%
          </ThemedText>
        )}
      </View>
    </View>
  );
};

export default CoinItem;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: 13,
  },
  nameBlock: {
    minWidth: 80,
  },
  right: {
    minWidth: 80,
    alignItems: "flex-end",
  },
});
