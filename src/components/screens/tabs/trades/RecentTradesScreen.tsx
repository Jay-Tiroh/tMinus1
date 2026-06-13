import { Spacer } from "@/components/Spacer";
import { ThemedButton } from "@/components/ThemedButton";
import { ThemedText } from "@/components/ThemedText";
import Template from "@/components/trades/Template";
import { Colors } from "@/constants/Colors";
import { GeneralStyles } from "@/constants/themes";
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";

const RECENT_TRADES_CONFIG = [
  {
    id: "1",
    type: "Buy",
    price: "$64,206.10",
    amount: "0.0150",
    total: "963.09",
  },
  {
    id: "2",
    type: "Sell",
    price: "$64,194.20",
    amount: "0.0201",
    total: "1,290.30",
  },
  {
    id: "3",
    type: "Buy",
    price: "$64,211.00",
    amount: "0.0080",
    total: "513.69",
  },
  {
    id: "4",
    type: "Buy",
    price: "$64,203.44",
    amount: "0.0440",
    total: "2,824.95",
  },
  {
    id: "5",
    type: "Sell",
    price: "$64,188.17",
    amount: "0.0190",
    total: "1,219.58",
  },
  {
    id: "6",
    type: "Buy",
    price: "$64,218.25",
    amount: "0.0110",
    total: "706.40",
  },
  {
    id: "7",
    type: "Sell",
    price: "$64,182.90",
    amount: "0.0370",
    total: "2,374.77",
  },
];

const RecentTradesScreen = () => {
  const [activeTab, setActiveTab] = useState("Trades");

  return (
    <Template
      textBlockProps={{
        title: "Recent trades",
        body: "Latest simulated market prints.",
      }}
      ctaProps={undefined}
      topSpacerSize={20}
    >
      <View style={GeneralStyles.wrapper}>
        {/* Mini Tabs */}
        <View style={styles.tabsContainer}>
          <ThemedButton
            title="Trades"
            variant={activeTab === "Trades" ? "primary" : "secondary"}
            style={[
              styles.tab,
              activeTab !== "Trades" && { backgroundColor: Colors.surfaceNavy },
            ]}
            textStyle={[
              styles.tabText,
              activeTab !== "Trades" && { color: Colors.snowGray },
            ]}
            onPress={() => setActiveTab("Trades")}
          />
          <ThemedButton
            title="Order book"
            variant={activeTab === "Order book" ? "primary" : "secondary"}
            style={[
              styles.tab,
              activeTab !== "Order book" && {
                backgroundColor: Colors.surfaceNavy,
              },
            ]}
            textStyle={[
              styles.tabText,
              activeTab !== "Order book" && { color: Colors.snowGray },
            ]}
            onPress={() => setActiveTab("Order book")}
          />
        </View>
        <Spacer size={24} />

        {/* Trades List */}
        <View style={{ gap: 10 }}>
          {RECENT_TRADES_CONFIG.map((trade) => {
            const isBuy = trade.type === "Buy";
            const typeColor = isBuy ? Colors.primaryClean : Colors.lossBright;

            return (
              <View key={trade.id} style={styles.tradeRow}>
                <ThemedText
                  size={14}
                  weight="bold"
                  color={typeColor}
                  style={{ width: 40 }}
                >
                  {trade.type}
                </ThemedText>
                <ThemedText
                  size={14}
                  weight="bold"
                  color={Colors.snowGray}
                  style={{ width: 90 }}
                >
                  {trade.price}
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
                  {trade.total}
                </ThemedText>
              </View>
            );
          })}
        </View>
      </View>
    </Template>
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
