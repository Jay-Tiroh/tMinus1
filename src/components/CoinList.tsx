import CoinItem from "@/components/CoinItem";
import Loader from "@/components/Loader";
import { CoinIcons } from "@/constants/AssetsMap";
import { Colors } from "@/constants/Colors";
import { Asset } from "@/types/assets";
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

// ─── Types ────────────────────────────────────────────────────────────────────

export type CoinItemConfig = {
  showChange?: boolean;
  showChart?: boolean;
};

type CoinListProps = {
  data: Asset[] | undefined;
  coinItemConfig?: CoinItemConfig;
  contentContainerStyle?: ViewStyle;
  useHrefs?: boolean;
  ListHeaderComponent?: FlatListProps<Asset>["ListHeaderComponent"];
  ListFooterComponent?: FlatListProps<Asset>["ListFooterComponent"];
  hasModal?: boolean;
};

// ─── Separator ────────────────────────────────────────────────────────────────

const Separator = () => (
  <View style={{ paddingVertical: 6 }}>
    <View
      style={{
        width: "100%",
      }}
    />
  </View>
);

// ─── CoinList ─────────────────────────────────────────────────────────────────

const CoinList = React.memo(function CoinList({
  data,
  coinItemConfig,
  contentContainerStyle,
  useHrefs = false,
  ListHeaderComponent,
  ListFooterComponent,
  hasModal = false,
}: CoinListProps) {
  const [isReady, setIsReady] = useState(false);

  const { showChange = false, showChart = false } = coinItemConfig ?? {};

  useEffect(() => {
    const task = InteractionManager.runAfterInteractions(() => {
      setIsReady(true);
    });
    return () => task.cancel();
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: Asset }) => (
      <View style={styles.coinItemWrapper}>
        <CoinItem
          name={item.name}
          amount={30594}
          icon={CoinIcons[item.symbol]}
          alias={item.symbol}
          amountInUsd={item.priceUsd}
          change={item.change24h}
          showChange={showChange}
          showChart={showChart}
          useHrefs={useHrefs}
          hasModal={hasModal}
        />
      </View>
    ),
    [showChange, showChart],
  );

  const keyExtractor = useCallback((item: Asset) => item.id, []);

  if (!isReady) return <Loader />;

  return (
    <View style={[styles.coinListContainer]}>
      <LinearGradient
        colors={[Colors.black, "transparent"]}
        style={styles.fadeGradientTop}
      />
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
      />
      <LinearGradient
        colors={["transparent", Colors.black]}
        style={styles.fadeGradient}
      />
    </View>
  );
});

export default CoinList;

const styles = StyleSheet.create({
  coinListContainer: {
    position: "relative",
    flex: 1,
    paddingBottom: 20,
  },
  coinItemWrapper: {
    paddingHorizontal: 24,
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
