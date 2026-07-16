import { CoinCard } from "@/components/home/CoinCard";
import CoinCardsSkeleton from "@/components/home/CoinCardSkeleton";
import { Colors } from "@/constants/Colors";
import { Asset } from "@/features/markets/types/assets";
import { useAllAssets } from "@/hooks/useAllAssets";
import { useTrendingAssets } from "@/hooks/useTrendingAssets";
import { ThemedText } from "@/shared/components/ThemedText";
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

export const CoinList = memo(function CoinList({
  data,
  isLoading,
  isUninitialized,
}: {
  data: Asset[] | undefined;
  isLoading: boolean;
  isUninitialized: boolean;
}) {
  const renderItem = useCallback(
    ({ item }: { item: Asset }) => <CoinCard coin={item} />,
    [],
  );

  const keyExtractor = useCallback(
    (item: Asset, index: number) => item.symbol ?? String(index),
    [],
  );

  if (isLoading && isUninitialized) {
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

export const Coins = () => {
  const {
    coins,
    isSearching: coinsLoading,
    isUninitialized,
  } = useAllAssets(undefined, 10000);
  const {
    trending,
    isLoading: trendingLoading,
    isUninitialized: trendingUninitialized,
  } = useTrendingAssets(undefined, 10000);

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
        <CoinList
          data={coins}
          isLoading={coinsLoading}
          isUninitialized={isUninitialized}
        />

        <ThemedText
          weight="bold"
          size={18}
          letterSpacing={2.64}
          style={{ color: Colors.surface }}
        >
          Top Coins
        </ThemedText>
        <CoinList
          data={trending}
          isLoading={trendingLoading}
          isUninitialized={trendingUninitialized}
        />
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
