// CoinCard.tsx (singular)
import Chart from "@/components/LineChart";
import { ThemedText } from "@/components/ThemedText";
import { CoinIcons } from "@/constants/AssetsMap";
import { Colors } from "@/constants/Colors";
import { formatCurrency } from "@/helpers/functions";
import { useGetAssetQuery } from "@/store/services/marketsApi";
import { Asset } from "@/types/assets";
import { StyleSheet, View } from "react-native";

export const CoinCard = ({ coin }: { coin: Asset }) => {
  const { data: coinInfo } = useGetAssetQuery({ symbol: coin.symbol }); // ✅ pass object, not raw string
  const chartData = coinInfo?.chart ?? [];

  const Icon = CoinIcons[coin.symbol];
  const isPositive = coin.change24h > 0;

  return (
    <View style={styles.card}>
      <View style={styles.top}>
        <ThemedText
          weight="bold"
          size={16}
          letterSpacing={2.64}
          style={{ color: coin.change24h > 0 ? Colors.primary : Colors.loss }}
        >
          {formatCurrency(40539.92)}
        </ThemedText>
        <Icon width={24} height={24} />
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
          style={{ color: coin.change24h > 0 ? Colors.primary : Colors.loss }}
        >
          {coin.change24h > 0 ? "+" : ""}
          {coin.change24h}%
        </ThemedText>
      </View>

      <View style={styles.bottom}>
        <Chart isPositive={isPositive} data={chartData} />
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  card: {
    width: 163,
    height: 118,
    boxShadow: "0px 16px 50px rgba(22, 28, 34, 0.08)",
    borderRadius: 16,
    padding: 8,
    justifyContent: "space-between",
    overflow: "hidden",
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
    marginBottom: -40,
  },
});
