import React, { useCallback, useState } from "react";
import { ImageBackground, RefreshControl } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Colors } from "@/constants/Colors";
import { GeneralStyles } from "@/constants/themes";
import { useWatchlist } from "@/features/markets";
import CoinList from "@/features/markets/components/CoinList";
import { useSafeBottom } from "@/shared/hooks/useSafeBottom";
import { vs } from "@/shared/utils/responsive";
import { WatchlistFooter } from "../components/WatchlistFooter";
import { WatchlistHeader } from "../components/WatchlistHeader";

export const WatchlistScreen = () => {
  const bottomPadding = useSafeBottom();
  const topInset = useSafeAreaInsets().top;
  const { watchlist, refetch } = useWatchlist();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await refetch();
    } finally {
      setIsRefreshing(false);
    }
  }, [refetch]);

  return (
    <ImageBackground
      source={require("@/assets/images/new-bg.png")}
      style={[GeneralStyles.container, { width: "100%" }]}
    >
      <CoinList
        data={watchlist}
        coinItemConfig={{ showChange: true, showChart: true }}
        ListHeaderComponent={<WatchlistHeader />}
        ListFooterComponent={<WatchlistFooter />}
        contentContainerStyle={{
          paddingBottom: bottomPadding + vs(50),
          paddingVertical: vs(12),
          paddingTop: topInset + vs(36),
        }}
        useHrefs
        hasModal={true}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor={Colors.primary}
            colors={[Colors.primary]}
            progressBackgroundColor={Colors.backgroundDark}
          />
        }
      />
    </ImageBackground>
  );
};
