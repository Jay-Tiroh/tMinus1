import { Asset } from "@/features/markets/types/assets";
import { memo, useCallback } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { CoinCard } from "./CoinCard";
import { CoinCardsSkeleton } from "./CoinCardsSkeleton";

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

const styles = StyleSheet.create({
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
