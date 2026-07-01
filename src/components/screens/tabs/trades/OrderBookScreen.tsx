import { Spacer } from "@/components/Spacer";
import { ThemedButton } from "@/components/ThemedButton";
import { ThemedText } from "@/components/ThemedText";
import Template from "@/components/trades/Template";
import { Colors } from "@/constants/Colors";
import { Fonts } from "@/constants/Fonts";
import { GeneralStyles } from "@/constants/themes";
import { formatAmount } from "@/helpers/functions";
import { useAssetRoute } from "@/hooks/useAssetRoute";
import useFiat from "@/hooks/useFiat";
import { useGetOrderBookQuery } from "@/store/services/marketsApi";
import { ms, s, vs } from "@/utils/responsive";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";

const OrderBookScreen = () => {
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

export default OrderBookScreen;

const styles = StyleSheet.create({
  tabsContainer: {
    flexDirection: "row",
    gap: s(12),
  },
  tab: {
    height: vs(36),
    minWidth: s(100),
    maxWidth: s(150),
    borderRadius: ms(18),
  },
  tabText: {
    fontSize: ms(13),
    color: Colors.surfaceNavy,
    fontFamily: Fonts.medium,
  },
  summaryRow: {
    ...GeneralStyles.box,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: s(20),
    height: vs(56),
  },
  tableHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  tableBody: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: s(16),
  },
  bookRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
