import { Spacer } from "@/components/Spacer";
import TextBlock from "@/components/TextBlock";
import { ThemedButton } from "@/components/ThemedButton";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { Fonts } from "@/constants/Fonts";
import { GeneralStyles } from "@/constants/themes";
import { formatAmount } from "@/helpers/functions";
import { useAssetRoute } from "@/hooks/useAssetRoute";
import useFiat from "@/hooks/useFiat";
import { useSafeBottom } from "@/hooks/useSafeBottom";
import { useGetTradesQuery } from "@/store/services/marketsApi";
import { ms, s, vs } from "@/utils/responsive";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { FlatList, ImageBackground, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const RecentTradesScreen = () => {
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

  const ListHeader = (
    <View style={GeneralStyles.wrapper}>
      <TextBlock title="Recent trades" body="Latest simulated market prints." />
      <Spacer size={24} />

      {/* Mini Tabs */}
      <View style={styles.tabsContainer}>
        <ThemedButton
          title="Order book"
          variant="secondary"
          style={[styles.tab, { backgroundColor: Colors.surfaceNavy }]}
          textStyle={[styles.tabText, { color: Colors.snowGray }]}
          onPress={() => replace("order-book", { asset })}
        />
        <ThemedButton
          title="Trades"
          variant="primary"
          style={[styles.tab]}
          textStyle={[styles.tabText, { color: Colors.surfaceNavy }]}
        />
      </View>
      <Spacer size={24} />
    </View>
  );

  return (
    <ImageBackground
      source={require("@/assets/images/new-bg.png")}
      style={[{ width: "100%", flex: 1 }]}
    >
      <FlatList
        style={{
          paddingTop: topInset + vs(24),
        }}
        data={tradeData}
        keyExtractor={(trade) => trade.id}
        renderItem={({ item: trade }) => {
          const isBuy = trade.side === "buy";
          const typeColor = isBuy ? Colors.primaryClean : Colors.lossBright;

          return (
            <View style={[GeneralStyles.wrapper, { marginBottom: vs(10) }]}>
              <View style={styles.tradeRow}>
                <ThemedText
                  size={14}
                  weight="bold"
                  color={typeColor}
                  style={{ width: s(40) }}
                >
                  {trade.side}
                </ThemedText>
                <ThemedText
                  size={14}
                  weight="bold"
                  color={Colors.snowGray}
                  style={{ flex: 1 }}
                >
                  {symbol + formatAmount(convertFromUSD(trade.priceUsd))}
                </ThemedText>
                <ThemedText
                  size={14}
                  color={Colors.textMidGray}
                  style={{ width: s(70), textAlign: "right" }}
                >
                  {trade.amount}
                </ThemedText>
                <ThemedText
                  size={14}
                  color={Colors.textMidGray}
                  style={{ flex: 1, textAlign: "right" }}
                >
                  {symbol + formatAmount(convertFromUSD(trade.totalUsd))}
                </ThemedText>
              </View>
            </View>
          );
        }}
        ListHeaderComponent={ListHeader}
        contentContainerStyle={{ paddingBottom: bottomPadding + vs(50) }}
        showsVerticalScrollIndicator={false}
      />
    </ImageBackground>
  );
};

export default RecentTradesScreen;

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
    fontFamily: Fonts.medium,
  },
  tradeRow: {
    ...GeneralStyles.box,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: s(16),
    height: vs(54),
    justifyContent: "space-between",
  },
});
