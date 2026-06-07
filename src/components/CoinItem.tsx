import ChangeText from "@/components/ChangeText";
import { CryptoIcon } from "@/components/CryptoIcon";
import Chart from "@/components/LineChart";
import RemoveFromWatchlistModal from "@/components/markets/Modal";

import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { formatCurrency } from "@/helpers/functions";
import { showErrorToast, showSuccessToast } from "@/hooks/showToast";
import { useAssetChart } from "@/hooks/useAssetChart";
import { useWatchlist } from "@/hooks/useWatchlist";
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
  hasModal?: boolean;
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
  hasModal = false,
}: CoinItemProps) => {
  const isPositive = !!change && change > 0;
  const { chart: chartData } = useAssetChart(alias, !showChart);
  const [chartVisible, setChartVisible] = useState(false);
  const [removeLoading, setRemoveLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const router = useRouter();
  const route = "/(tabs)/trades/asset?coin=" + alias;

  // Destructure only the mutation function
  const { removeFromWatchlist } = useWatchlist();

  const handlePress = () => {
    if (useHrefs) {
      router.push(route as Href);
    }
  };

  const handleConfirm = async () => {
    setRemoveLoading(true);

    try {
      await removeFromWatchlist(alias).unwrap();

      setRemoveLoading(false);
      setModalVisible(false);
      showSuccessToast({
        title: `${name} removed from Watchlist`,
      });
    } catch {
      setRemoveLoading(false);
      setModalVisible(false);
      showErrorToast({
        title: `Error removing ${name} from Watchlist`,
      });
    }
  };

  const onDismiss = () => {
    setModalVisible(false);
  };

  const handleLongPress = () => {
    if (hasModal) {
      setModalVisible(true);
    }
  };

  return (
    <>
      <Pressable
        onPress={handlePress}
        style={styles.container}
        onLayout={() => setChartVisible(true)}
        onLongPress={handleLongPress}
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
          <ThemedText weight="bold" size={14} color={Colors.white}>
            ${formatCurrency(amountInUsd as number)}
          </ThemedText>

          {showChange && change != null && <ChangeText change={change} />}
        </View>
      </Pressable>

      <RemoveFromWatchlistModal
        onConfirm={handleConfirm}
        onDismiss={onDismiss}
        visible={modalVisible}
        coinName={name}
        actionLoading={removeLoading}
      />
    </>
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
