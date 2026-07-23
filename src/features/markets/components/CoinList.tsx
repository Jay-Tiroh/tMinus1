import { Colors } from "@/constants/Colors";
import { Asset, useWatchlist } from "@/features/markets";
import RemoveFromWatchlistModal from "@/features/markets/components/Modal";
import Loader from "@/shared/components/Loader";
import { showErrorToast, showSuccessToast } from "@/shared/hooks/showToast";
import { LinearGradient } from "expo-linear-gradient";
import React, { useCallback, useEffect, useState } from "react";
import {
  FlatList,
  FlatListProps,
  InteractionManager,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import { CoinItem } from "./CoinItem";

export type CoinItemConfig = {
  showChange?: boolean;
  showChart?: boolean;
  amountInUsd?: number;
};

export type CoinListProps = {
  data: Asset[] | undefined;
  coinItemConfig?: CoinItemConfig;
  contentContainerStyle?: ViewStyle;
  useHrefs?: boolean;
  ListHeaderComponent?: FlatListProps<Asset>["ListHeaderComponent"];
  ListFooterComponent?: FlatListProps<Asset>["ListFooterComponent"];
  hasModal?: boolean;
  refreshControl?: FlatListProps<Asset>["refreshControl"];
};

const Separator = () => (
  <View style={styles.separatorContainer}>
    <View style={styles.separatorLine} />
  </View>
);

export const CoinList = React.memo(function CoinList({
  data,
  coinItemConfig,
  contentContainerStyle,
  useHrefs = false,
  ListHeaderComponent,
  ListFooterComponent,
  hasModal = false,
  refreshControl,
}: CoinListProps) {
  const [isReady, setIsReady] = useState(false);

  // Track modal state at the list level to prevent N-modals in the DOM
  const [modalAsset, setModalAsset] = useState<Asset | null>(null);
  const [removeLoading, setRemoveLoading] = useState(false);

  const { removeFromWatchlist } = useWatchlist();

  const {
    showChange = false,
    showChart = false,
    amountInUsd,
  } = coinItemConfig ?? {};

  useEffect(() => {
    const task = InteractionManager.runAfterInteractions(() => {
      setIsReady(true);
    });
    return () => task.cancel();
  }, []);

  const handleLongPress = useCallback(
    (asset: Asset) => {
      if (hasModal) {
        setModalAsset(asset);
      }
    },
    [hasModal],
  );

  const handleConfirmRemove = async () => {
    if (!modalAsset) return;
    setRemoveLoading(true);

    try {
      await removeFromWatchlist(modalAsset.symbol).unwrap();
      showSuccessToast({
        title: `${modalAsset.name} removed from Watchlist`,
      });
    } catch {
      showErrorToast({
        title: `Error removing ${modalAsset.name} from Watchlist`,
      });
    } finally {
      setRemoveLoading(false);
      setModalAsset(null);
    }
  };

  const handleDismissModal = () => {
    setModalAsset(null);
  };

  const renderItem = useCallback(
    ({ item }: { item: Asset }) => (
      <View style={styles.coinItemWrapper}>
        <CoinItem
          name={item.name}
          alias={item.symbol}
          amountInUsd={amountInUsd ?? item.priceUsd}
          change={item.change24h}
          showChange={showChange}
          showChart={showChart}
          useHrefs={useHrefs}
          onLongPress={() => handleLongPress(item)}
        />
      </View>
    ),
    [showChange, showChart, useHrefs, amountInUsd, handleLongPress],
  );

  const keyExtractor = useCallback((item: Asset) => item.id, []);

  if (!isReady) return <Loader />;

  return (
    <View style={styles.coinListContainer}>
      <FlatList
        data={data}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        ItemSeparatorComponent={Separator}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={contentContainerStyle}
        ListHeaderComponent={ListHeaderComponent}
        ListFooterComponent={ListFooterComponent}
        scrollEventThrottle={16}
        refreshControl={refreshControl}
      />
      <LinearGradient
        colors={["transparent", Colors.black]}
        style={styles.fadeGradient}
      />

      {hasModal && (
        <RemoveFromWatchlistModal
          visible={!!modalAsset}
          coinName={modalAsset?.name || ""}
          actionLoading={removeLoading}
          onConfirm={handleConfirmRemove}
          onDismiss={handleDismissModal}
        />
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  coinListContainer: {
    position: "relative",
    flex: 1,
    paddingBottom: 20,
  },
  coinItemWrapper: {
    paddingHorizontal: 24,
  },
  separatorContainer: {
    paddingVertical: 6,
  },
  separatorLine: {
    width: "100%",
  },
  fadeGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    zIndex: 99,
    pointerEvents: "none",
  },
  fadeGradientTop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 20,
    zIndex: 99,
    pointerEvents: "none",
  },
});
