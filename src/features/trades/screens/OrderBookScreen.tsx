import { Colors } from "@/constants/Colors";
import { GeneralStyles } from "@/constants/themes";
import { useGetOrderBookQuery } from "@/features/markets/api/marketsApi";
import { useAssetRoute } from "@/features/trades/hooks/useAssetRoute";
import { formatAmount } from "@/shared/utils/formatCurrency";
import useFiat from "@/shared/hooks/useFiat";
import { Spacer } from "@/shared/components/Spacer";
import Template from "@/shared/components/Template";
import { ThemedText } from "@/shared/components/ThemedText";
import { vs } from "@/shared/utils/responsive";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";

import { TradeNavigationTabs } from "../components/TradeNavigationTabs";

export const OrderBookScreen = () => {
  const params = useLocalSearchParams<{ asset?: string }>();
  const asset = params?.asset ?? "BTC";
  const { data: orderBookData } = useGetOrderBookQuery(
    { symbol: asset },
    { pollingInterval: 5000, refetchOnMountOrArgChange: true },
  );
  const { symbol, convertFromUSD } = useFiat();
  const Asks = orderBookData?.asks ?? [];
  const Bids = orderBookData?.bids ?? [];
  const midPrice = orderBookData?.midPriceUsd ?? 0;
  const spread = orderBookData?.spreadUsd ?? 0;

  const { replace } = useAssetRoute();

  const handleSelectTab = (tab: "order-book" | "recent-trades") => {
    if (tab === "recent-trades") {
      replace("recent-trades", { asset });
    }
  };

  return (
    <Template
      textBlockProps={{
        title: asset + " order book",
        body: "Bid and ask levels for the trade screen.",
      }}
      ctaProps={{
        title: "Trade " + asset,
        variant: "primary",
        onPress: () => replace("action", { action: "Buy", asset }),
      }}
      topSpacerSize={20}
    >
      <View style={GeneralStyles.wrapper}>
        <TradeNavigationTabs
          activeTab="order-book"
          onSelectTab={handleSelectTab}
        />
        <Spacer size={24} />

        <View style={{ gap: vs(12) }}>
          <View style={styles.summaryRow}>
            <ThemedText size={14} color={Colors.textMidGray}>
              Mid price
            </ThemedText>
            <ThemedText size={16} weight="bold" color={Colors.snowGray}>
              {symbol + formatAmount(convertFromUSD(midPrice))}
            </ThemedText>
          </View>
          <View style={styles.summaryRow}>
            <ThemedText size={14} color={Colors.textMidGray}>
              Spread
            </ThemedText>
            <ThemedText size={16} weight="bold" color={Colors.snowGray}>
              {symbol + formatAmount(convertFromUSD(spread))}
            </ThemedText>
          </View>
        </View>

        <Spacer size={32} />

        <View style={styles.tableHeader}>
          <View style={{ flex: 1 }}>
            <ThemedText size={16} weight="bold" color={Colors.primaryClean}>
              Bids
            </ThemedText>
          </View>
          <View style={{ flex: 1 }}>
            <ThemedText size={16} weight="bold" color={Colors.lossBright}>
              Asks
            </ThemedText>
          </View>
        </View>
        <Spacer size={16} />

        <View style={styles.tableBody}>
          <View style={{ flex: 1, gap: vs(16) }}>
            {Bids.map((bid, index) => (
              <View key={`bid-${index}`} style={styles.bookRow}>
                <ThemedText size={13} color={Colors.primaryClean}>
                  {formatAmount(convertFromUSD(bid.priceUsd))}
                </ThemedText>
                <ThemedText size={13} color={Colors.textMidGray}>
                  {formatAmount(bid.amount)}
                </ThemedText>
              </View>
            ))}
          </View>

          <View style={{ flex: 1, gap: vs(16) }}>
            {Asks.map((ask, index) => (
              <View key={`ask-${index}`} style={styles.bookRow}>
                <ThemedText size={13} color={Colors.lossBright}>
                  {formatAmount(convertFromUSD(ask.priceUsd))}
                </ThemedText>
                <ThemedText size={13} color={Colors.textMidGray}>
                  {ask.amount}
                </ThemedText>
              </View>
            ))}
          </View>
        </View>
      </View>
      <Spacer size={40} />
    </Template>
  );
};

const styles = StyleSheet.create({
  summaryRow: {
    ...GeneralStyles.box,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    height: vs(56),
  },
  tableHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  tableBody: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 16,
  },
  bookRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
