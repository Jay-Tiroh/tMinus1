import ChangeText from "@/components/ChangeText";
import { CryptoIcon } from "@/components/CryptoIcon";
import Chart from "@/components/LineChart";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { formatCurrency } from "@/helpers/functions";
import { useAssetChart } from "@/hooks/useAssetChart";
import { Href, useRouter } from "expo-router";
import React, { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { SvgProps } from "react-native-svg";

type CoinItemProps = {
  name: string;
  alias: string;
  amount: number;
  amountInUsd?: number;
  change?: number;
  showChange?: boolean;
  showChart?: boolean;
  icon: React.FC<SvgProps>;
  useHrefs?: boolean;
};

const CoinItem = ({
  name,
  alias,
  amount,
  amountInUsd,
  change,
  icon: Icon,
  showChange = false,
  showChart = false,
  useHrefs = false,
}: CoinItemProps) => {
  const isPositive = !!change && change > 0;
  const { chart: chartData } = useAssetChart(alias, !showChart);
  const [chartVisible, setChartVisible] = useState(false);

  const router = useRouter();
  const route = "/(tabs)/trades/asset?coin=" + alias;
  const handlePress = () => {
    if (useHrefs) {
      router.push(route as Href);
    }
  };
  return (
    <Pressable
      onPress={handlePress}
      style={styles.container}
      onLayout={() => setChartVisible(true)}
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
        <ThemedText weight="bold" size={14} color={Colors.white}>
          ${formatCurrency(amountInUsd as number)}
        </ThemedText>

        {showChange && change != null && <ChangeText change={change} />}
      </View>
    </Pressable>
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
    backgroundColor: Colors.backgroundDark,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    // height: 70,
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
