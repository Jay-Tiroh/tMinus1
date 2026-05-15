import GreenChart from "@/assets/icons/home/green-chart.svg";
import RedChart from "@/assets/icons/home/red-chart.svg";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { formatCurrency } from "@/helpers/functions";
import React from "react";
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
  const isPositive = change && change > 0;
  const sign = isPositive ? "+" : "";
  return (
    <View style={styles.container}>
      <View
        style={{
          gap: 13,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Icon width={40} height={40} />

        <View style={{ minWidth: 80 }}>
          <ThemedText weight="bold" size={14} color={Colors.white}>
            {name}
          </ThemedText>
          <ThemedText size={14} color={Colors.textMuted}>
            {alias}
          </ThemedText>
        </View>
      </View>
      {showChart ? isPositive ? <GreenChart /> : <RedChart /> : null}
      <View style={{ minWidth: 80, alignItems: "flex-end" }}>
        <ThemedText weight="bold" size={14} color={Colors.white}>
          {formatCurrency(amount)}
        </ThemedText>
        {showAmountInUsd && (
          <ThemedText size={14} color={Colors.textMuted}>
            {amountInUsd ? `$${formatCurrency(amountInUsd)}` : null}
          </ThemedText>
        )}
        {showChange && (
          <ThemedText
            size={14}
            color={isPositive ? Colors.profit : Colors.loss}
          >
            {sign + change + "%"}
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
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    width: "100%",
  },
  name: {},
  alias: {},
  amount: {},
  price: {},
  change: {},
  icon: {},
});
