import Chart from "@/components/LineChart";
import { ThemedText } from "@/components/ThemedText";
import { CoinIcons } from "@/constants/AssetsMap";
import { Colors } from "@/constants/Colors";
import { formatCurrency } from "@/helpers/functions";
import { useAssetChart } from "@/hooks/useAssetChart";
import { Asset } from "@/types/assets";
import { memo, useState } from "react";
import { StyleSheet, View } from "react-native";

interface CoinCardProps {
  coin: Asset;
}

export const CoinCard = memo(function CoinCard({ coin }: CoinCardProps) {
  const chartData = useAssetChart(coin.symbol);
  const Icon = CoinIcons[coin.symbol];
  const isPositive = coin.change24h > 0;
  const [chartVisible, setChartVisible] = useState(false);

  return (
    <View style={styles.card} onLayout={() => setChartVisible(true)}>
      <View style={styles.top}>
        <ThemedText
          weight="bold"
          size={16}
          letterSpacing={2.64}
          style={{ color: isPositive ? Colors.primary : Colors.loss }}
        >
          {formatCurrency(coin.priceUsd)}
        </ThemedText>
        {Icon && <Icon width={24} height={24} />}
      </View>

      <View style={styles.middle}>
        <ThemedText
          size={14}
          letterSpacing={2.64}
          style={{ color: Colors.surface }}
        >
          {`${coin.symbol}/BUSD`}
        </ThemedText>
        <ThemedText
          size={12}
          letterSpacing={2.64}
          style={{ color: isPositive ? Colors.primary : Colors.loss }}
        >
          {isPositive ? "+" : ""}
          {coin.change24h.toFixed(2)}%
        </ThemedText>
      </View>

      <View style={styles.bottom}>
        {chartVisible && chartData.length > 0 && (
          <Chart isPositive={isPositive} data={chartData} />
        )}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  card: {
    width: 163,
    // height: 118,
    borderRadius: 16,
    padding: 8,
    justifyContent: "space-between",
    overflow: "hidden",
    boxShadow: "0px 16px 50px rgba(22, 28, 34, 0.08)",
  },
  top: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  middle: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  bottom: {
    marginTop: 10,
  },
});
