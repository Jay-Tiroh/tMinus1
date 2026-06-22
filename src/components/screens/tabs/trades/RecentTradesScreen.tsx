import { Spacer } from "@/components/Spacer";
import TextBlock from "@/components/TextBlock";
import { ThemedButton } from "@/components/ThemedButton";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { GeneralStyles } from "@/constants/themes";
import { useAssetRoute } from "@/hooks/useAssetRoute";
import { useSafeBottom } from "@/hooks/useSafeBottom";
import { useGetTradesQuery } from "@/store/services/marketsApi";
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
          style={styles.tab}
          textStyle={styles.tabText}
        />
      </View>
      <Spacer size={24} />
    </View>
  );

  return (
    <ImageBackground
      source={require("@/assets/images/new-bg.png")}
      style={[{ paddingTop: topInset + 24, width: "100%", flex: 1 }]}
    >
      <FlatList
        data={tradeData}
        keyExtractor={(trade) => trade.id}
        renderItem={({ item: trade }) => {
          const isBuy = trade.side === "buy";
          const typeColor = isBuy ? Colors.primaryClean : Colors.lossBright;

          return (
            <View style={[GeneralStyles.wrapper, { marginBottom: 10 }]}>
              <View style={styles.tradeRow}>
                <ThemedText
                  size={14}
                  weight="bold"
                  color={typeColor}
                  style={{ width: 40 }}
                >
                  {trade.side}
                </ThemedText>
                <ThemedText
                  size={14}
                  weight="bold"
                  color={Colors.snowGray}
                  style={{ width: 90 }}
                >
                  {trade.priceUsd}
                </ThemedText>
                <ThemedText
                  size={14}
                  color={Colors.textMidGray}
                  style={{ width: 70, textAlign: "right" }}
                >
                  {trade.amount}
                </ThemedText>
                <ThemedText
                  size={14}
                  color={Colors.textMidGray}
                  style={{ flex: 1, textAlign: "right" }}
                >
                  {trade.totalUsd}
                </ThemedText>
              </View>
            </View>
          );
        }}
        ListHeaderComponent={ListHeader}
        contentContainerStyle={{ paddingBottom: bottomPadding + 50 }}
        showsVerticalScrollIndicator={false}
        // onScrollEndDrag={() => {
        //   console.log("you've reached the end!");
        // }}
      />
    </ImageBackground>
  );
};

export default RecentTradesScreen;

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
  },
  tradeRow: {
    ...GeneralStyles.box,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    height: 54,
  },
});
