import React, { useCallback, useState } from "react";
import { ImageBackground, RefreshControl, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Colors } from "@/constants/Colors";
import { GeneralStyles } from "@/constants/themes";
import CoinList from "@/features/markets/components/CoinList";
import { useTrendingAssets } from "@/hooks/useTrendingAssets";
import { Spacer } from "@/shared/components/Spacer";
import TextBlock from "@/shared/components/TextBlock";
import { useSafeBottom } from "@/shared/hooks/useSafeBottom";
import { vs } from "@/shared/utils/responsive";
import { TopGainer } from "../components/TopGainer";

export const TrendingScreen = () => {
  const bottomPadding = useSafeBottom();
  const topInset = useSafeAreaInsets().top;
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { trending, featured, refetch } = useTrendingAssets(
    { include: "sparkline" },
    10000,
  );

  const topGainer = trending.find((asset) => asset.symbol === featured?.symbol);

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
      style={[GeneralStyles.container, { paddingTop: topInset + vs(24) }]}
    >
      <View style={GeneralStyles.wrapper}>
        <TextBlock
          title="Trending"
          body="Top moving assets from the simulated market feed."
        />
      </View>
      <Spacer size={16} />
      <View style={GeneralStyles.wrapper}>
        <TopGainer featured={featured} topGainer={topGainer} />
      </View>

      <Spacer size={26} />
      <CoinList
        data={trending}
        coinItemConfig={{ showChange: true, showChart: true }}
        contentContainerStyle={{
          paddingTop: vs(12),
          paddingBottom: bottomPadding * 2,
        }}
        useHrefs
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
