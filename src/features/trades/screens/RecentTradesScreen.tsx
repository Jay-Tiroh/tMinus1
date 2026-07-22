import { GeneralStyles } from "@/constants/themes";
import { useGetTradesQuery } from "@/features/markets/api/marketsApi";
import { useAssetRoute } from "@/features/trades/hooks/useAssetRoute";
import useFiat from "@/shared/hooks/useFiat";
import { useSafeBottom } from "@/hooks/useSafeBottom";
import { Spacer } from "@/shared/components/Spacer";
import TextBlock from "@/shared/components/TextBlock";
import { vs } from "@/utils/responsive";
import { useLocalSearchParams } from "expo-router";
import React, { useCallback } from "react";
import { FlatList, ImageBackground, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { TradeListItem } from "../components/TradeListItem";
import { TradeNavigationTabs } from "../components/TradeNavigationTabs";

export const RecentTradesScreen = () => {
  const params = useLocalSearchParams<{ asset?: string }>();
  const asset = params.asset ?? "BTC";
  const { replace } = useAssetRoute();
  const topInset = useSafeAreaInsets().top;
  const bottomPadding = useSafeBottom();
  const { symbol, convertFromUSD } = useFiat();
  const { data: tradeData = [] } = useGetTradesQuery(
    { symbol: asset },
    { pollingInterval: 5000 },
  );

  const handleSelectTab = (tab: "order-book" | "recent-trades") => {
    if (tab === "order-book") {
      replace("order-book", { asset });
    }
  };

  const renderItem = useCallback(
    ({ item }: { item: any }) => (
      <TradeListItem
        trade={item}
        symbol={symbol as string}
        convertFromUSD={convertFromUSD}
      />
    ),
    [symbol, convertFromUSD],
  );

  const ListHeader = (
    <View style={GeneralStyles.wrapper}>
      <TextBlock title="Recent trades" body="Latest simulated market prints." />
      <Spacer size={24} />
      <TradeNavigationTabs
        activeTab="recent-trades"
        onSelectTab={handleSelectTab}
      />
      <Spacer size={24} />
    </View>
  );

  return (
    <ImageBackground
      source={require("@/assets/images/new-bg.png")}
      style={[{ width: "100%", flex: 1 }]}
    >
      <FlatList
        style={{ paddingTop: topInset + vs(24) }}
        data={tradeData}
        keyExtractor={(trade) => trade.id}
        renderItem={renderItem}
        ListHeaderComponent={ListHeader}
        contentContainerStyle={{ paddingBottom: bottomPadding + vs(50) }}
        showsVerticalScrollIndicator={false}
      />
    </ImageBackground>
  );
};
