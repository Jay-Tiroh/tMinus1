import { Colors } from "@/constants/Colors";
import { useAssetChart } from "@/features/markets";
import Chart from "@/features/markets/components/LineChart";
import { Asset } from "@/features/markets/types/assets";
import { formatCurrency } from "@/helpers/functions";
import { CryptoIcon } from "@/shared/components/CryptoIcon";
import { ThemedText } from "@/shared/components/ThemedText";
import useFiat from "@/shared/hooks/useFiat";
import { ms, s, vs } from "@/utils/responsive";
import { memo, useState } from "react";
import { StyleSheet, View } from "react-native";

interface CoinCardProps {
  coin: Asset;
}

export const CoinCard = memo(function CoinCard({ coin }: CoinCardProps) {
  const { chart: chartData } = useAssetChart(coin.symbol);
  const isPositive = coin.change24h > 0;
  const [chartVisible, setChartVisible] = useState(false);
  const { symbol, convertFromUSD, fiat } = useFiat();

  return (
    <View style={styles.card} onLayout={() => setChartVisible(true)}>
      <View style={styles.top}>
        <ThemedText
          weight="bold"
          size={12}
          letterSpacing={2.64}
          style={{ color: isPositive ? Colors.primary : Colors.loss }}
        >
          {symbol + formatCurrency(convertFromUSD(coin.priceUsd))}
        </ThemedText>
        <CryptoIcon symbol={coin.symbol} size={24} />
      </View>

      <View style={styles.middle}>
        <ThemedText
          size={12}
          letterSpacing={2.64}
          style={{ color: Colors.snowGray }}
        >
          {`${coin.symbol}/${fiat.label}`}
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
    width: s(163),
    borderRadius: ms(16),
    padding: s(12),
    justifyContent: "space-between",
    overflow: "hidden",
    boxShadow: "0px 16px 50px rgba(22, 28, 34, 0.08)",
    backgroundColor: Colors.surfaceNavy,
  },
  top: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  middle: {
    flexDirection: "row",
    alignItems: "center",
    gap: s(4),
    justifyContent: "space-between",
    marginTop: vs(10),
  },
  bottom: {
    marginTop: vs(10),
  },
});
