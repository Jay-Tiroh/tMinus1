import { CoinCard } from "@/components/home/CoinCard";
import CoinCardsSkeleton from "@/components/home/CoinCardSkeleton";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import {
  useAllAssetsQuery,
  useTrendingQuery,
} from "@/store/services/marketsApi";
import { Asset } from "@/types/assets";
import { memo, useCallback } from "react";
import { FlatList, StyleSheet, View } from "react-native";

const SKELETON_KEYS = [0, 1, 2, 3];

const SkeletonRow = memo(function SkeletonRow() {
  return (
    <>
      {SKELETON_KEYS.map((k) => (
        <CoinCardsSkeleton key={k} />
      ))}
    </>
  );
});

const CoinList = memo(function CoinList({
  data,
  isLoading,
}: {
  data: Asset[] | undefined;
  isLoading: boolean;
}) {
  const renderItem = useCallback(
    ({ item }: { item: Asset }) => <CoinCard coin={item} />,
    [],
  );

  const keyExtractor = useCallback(
    (item: Asset, index: number) => item.symbol ?? String(index),
    [],
  );

  if (isLoading) {
    return (
      <View style={styles.skeletonRow}>
        <SkeletonRow />
      </View>
    );
  }

  return (
    <FlatList
      data={data}
      horizontal
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
      style={styles.scrollView}
      removeClippedSubviews={true}
      maxToRenderPerBatch={4}
      initialNumToRender={4}
      windowSize={5}
    />
  );
});

const Coins = () => {
  const { data: coins, isLoading: coinsLoading } = useAllAssetsQuery();
  const { data: trending, isLoading: trendingLoading } = useTrendingQuery();

  return (
    <View style={styles.container}>
      <View style={styles.wrapper}>
        <ThemedText
          weight="bold"
          size={18}
          letterSpacing={2.64}
          style={{ color: Colors.surface }}
        >
          Recent Coins
        </ThemedText>
        <CoinList data={coins} isLoading={coinsLoading} />

        <ThemedText
          weight="bold"
          size={18}
          letterSpacing={2.64}
          style={{ color: Colors.surface }}
        >
          Top Coins
        </ThemedText>
        <CoinList data={trending} isLoading={trendingLoading} />
      </View>
    </View>
  );
};

export default Coins;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    padding: 20,
  },
  wrapper: {
    flex: 1,
    justifyContent: "flex-start",
  },
  scrollView: {
    flexGrow: 0,
  },
  scrollContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
    paddingVertical: 20,
  },
  skeletonRow: {
    flexDirection: "row",
    gap: 20,
    paddingVertical: 20,
  },
});
