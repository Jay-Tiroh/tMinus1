import { Spacer } from "@/components/Spacer";
import { ThemedButton } from "@/components/ThemedButton";
import { ThemedText } from "@/components/ThemedText";
import Template from "@/components/trades/Template";
import { Colors } from "@/constants/Colors";
import { Fonts } from "@/constants/Fonts";
import { GeneralStyles } from "@/constants/themes";
import { formatAmount } from "@/helpers/functions";
import { useAssetRoute } from "@/hooks/useAssetRoute";
import { useGetOrderBookQuery } from "@/store/services/marketsApi";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";

const SUMMARY_CONFIG = {
  midPrice: "$64,200.50",
  spread: "$13.86",
};

const ORDER_BOOK_BIDS = [
  { price: "64,193.57", size: "0.0300" },
  { price: "64,192.56", size: "0.0354" },
  { price: "64,191.55", size: "0.0408" },
  { price: "64,190.54", size: "0.0462" },
  { price: "64,19-1.53", size: "0.0516" },
  { price: "64,19-2.52", size: "0.0570" },
  { price: "64,19-3.51", size: "0.0624" },
];

const ORDER_BOOK_ASKS = [
  { price: "64,207.43", size: "0.0300" },
  { price: "64,208.44", size: "0.0354" },
  { price: "64,209.45", size: "0.0408" },
  { price: "64,2010.46", size: "0.0462" },
  { price: "64,2011.47", size: "0.0516" },
  { price: "64,2012.48", size: "0.0570" },
  { price: "64,2013.49", size: "0.0624" },
];

const OrderBookScreen = () => {
  const params = useLocalSearchParams<{ asset?: string }>();
  const asset = params?.asset ?? "BTC";
  const { data: orderBookData } = useGetOrderBookQuery(
    { symbol: asset },
    { pollingInterval: 5000, refetchOnMountOrArgChange: true },
  );
  const Asks = orderBookData?.asks ?? [];
  const Bids = orderBookData?.bids ?? [];
  const midPrice = orderBookData?.midPriceUsd ?? 0;
  const spread = orderBookData?.spreadUsd ?? 0;

  const { replace } = useAssetRoute();

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
        {/* Mini Tabs */}
        <View style={styles.tabsContainer}>
          <ThemedButton
            title="Order book"
            variant={"primary"}
            style={[styles.tab]}
            textStyle={[styles.tabText]}
          />
          <ThemedButton
            title="Trades"
            variant={"secondary"}
            style={[styles.tab, { backgroundColor: Colors.surfaceNavy }]}
            textStyle={[styles.tabText, { color: Colors.snowGray }]}
            onPress={() => replace("recent-trades", { asset })}
          />
        </View>
        <Spacer size={24} />

        {/* Summary Boxes */}
        <View style={{ gap: 12 }}>
          <View style={styles.summaryRow}>
            <ThemedText size={14} color={Colors.textMidGray}>
              Mid price
            </ThemedText>
            <ThemedText size={16} weight="bold" color={Colors.snowGray}>
              ${formatAmount(midPrice)}
            </ThemedText>
          </View>
          <View style={styles.summaryRow}>
            <ThemedText size={14} color={Colors.textMidGray}>
              Spread
            </ThemedText>
            <ThemedText size={16} weight="bold" color={Colors.snowGray}>
              ${formatAmount(spread)}
            </ThemedText>
          </View>
        </View>

        <Spacer size={32} />

        {/* Order Book Table */}
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
          {/* Bids Column */}
          <View style={{ flex: 1, gap: 16 }}>
            {Bids.map((bid, index) => (
              <View key={`bid-${index}`} style={styles.bookRow}>
                <ThemedText size={13} color={Colors.primaryClean}>
                  {formatAmount(bid.priceUsd)}
                </ThemedText>
                <ThemedText size={13} color={Colors.textMidGray}>
                  {formatAmount(bid.amount)}
                </ThemedText>
              </View>
            ))}
          </View>

          {/* Asks Column */}
          <View style={{ flex: 1, gap: 16 }}>
            {Asks.map((ask, index) => (
              <View key={`ask-${index}`} style={styles.bookRow}>
                <ThemedText size={13} color={Colors.lossBright}>
                  {formatAmount(ask.priceUsd)}
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

export default OrderBookScreen;

const styles = StyleSheet.create({
  tabsContainer: {
    flexDirection: "row",
    gap: 12,
  },
  tab: {
    height: 36,
    width: 100,
    borderRadius: 18,
  },
  tabText: {
    fontSize: 13,
    color: Colors.surfaceNavy,
    fontFamily: Fonts.medium,
  },
  summaryRow: {
    ...GeneralStyles.box,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    height: 56,
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
