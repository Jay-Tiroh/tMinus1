import CoinList from "@/components/CoinList";
import Chart from "@/components/LineChart";
import { Spacer } from "@/components/Spacer";
import TextBlock from "@/components/TextBlock";
import { ThemedButton } from "@/components/ThemedButton";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { GeneralStyles } from "@/constants/themes";
import { formatAmount } from "@/helpers/functions";
import useFiat from "@/hooks/useFiat";
import { useSafeBottom } from "@/hooks/useSafeBottom";
import { useTrendingAssets } from "@/hooks/useTrendingAssets";
import { Asset, FeaturedMeta } from "@/types/assets";
import { ms, s, vs } from "@/utils/responsive";
import { Href, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  ImageBackground,
  RefreshControl,
  StyleSheet,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type TopGainerProps = {
  topGainer: Asset | undefined;
  featured: FeaturedMeta | undefined;
};

const TopGainer = ({ topGainer, featured }: TopGainerProps) => {
  const route = "/(tabs)/trades/asset?coin=" + featured?.symbol;
  const router = useRouter();
  const handlePress = () => {
    router.replace(route as Href);
  };
  const { symbol, convertFromUSD } = useFiat();
  return (
    <View style={styles.topGainerContainer}>
      <View>
        <ThemedText weight="medium" size={11} color={Colors.primaryMist}>
          TOP GAINER · 24H
        </ThemedText>
        <Spacer size={15} />
        <TextBlock
          title={featured?.name ?? "Top Gainer"}
          body={"Highest 24h gain"}
          bodyStyle={{
            color: Colors.primaryAqua,
            fontSize: ms(12),
            marginTop: vs(-4),
            maxWidth: s(120),
          }}
          titleStyle={{ fontSize: ms(22) }}
        />

        <Spacer size={6} />
        <ThemedButton
          title="View asset"
          style={{
            backgroundColor: Colors.surfaceGreenRich,
            width: s(78),
            height: vs(22),
            borderRadius: ms(11),
          }}
          textStyle={{ color: Colors.primaryFrost, fontSize: ms(11) }}
          onPress={handlePress}
        />
      </View>
      <View
        style={{
          alignItems: "flex-end",
          justifyContent: "space-between",
          gap: vs(10),
          height: "100%",
        }}
      >
        <ThemedText weight="medium" size={11} color={Colors.primaryFrost}>
          {symbol + formatAmount(convertFromUSD(topGainer?.priceUsd as number))}
        </ThemedText>
        <View style={{ alignItems: "flex-end", gap: vs(4) }}>
          <ThemedText weight="bold" size={12} color={Colors.primaryClean}>
            +{topGainer?.change24h.toFixed(1)}%
          </ThemedText>
          <Chart
            isPositive={true}
            data={topGainer?.sparkline ?? []}
            width={s(178)}
            height={vs(70)}
          />
        </View>
      </View>
    </View>
  );
};

const TrendingScreen = () => {
  const bottomPadding = useSafeBottom();
  const topInset = useSafeAreaInsets().top;
  const { trending, featured, refetch } = useTrendingAssets(
    { include: "sparkline" },
    10000,
  );

  const topGainer = trending.find((asset) => asset.symbol === featured?.symbol);
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

export default TrendingScreen;

const styles = StyleSheet.create({
  topGainerContainer: {
    width: "100%",
    backgroundColor: Colors.surfaceGreenDark,
    borderRadius: ms(18),
    padding: ms(16),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    maxHeight: vs(150),
  },
});
