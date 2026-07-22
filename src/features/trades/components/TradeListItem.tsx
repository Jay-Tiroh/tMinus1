import { Colors } from "@/constants/Colors";
import { GeneralStyles } from "@/constants/themes";
import { formatAmount } from "@/helpers/functions";
import { ThemedText } from "@/shared/components/ThemedText";
import { s, vs } from "@/utils/responsive";
import React from "react";
import { StyleSheet, View } from "react-native";

interface TradeListItemProps {
  trade: {
    id: string;
    side: "buy" | "sell" | string;
    priceUsd: number;
    amount: number;
    totalUsd: number;
  };
  symbol: string;
  convertFromUSD: (val: number) => number;
}

export const TradeListItem = React.memo(
  ({ trade, symbol, convertFromUSD }: TradeListItemProps) => {
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
  },
);

TradeListItem.displayName = "TradeListItem";

const styles = StyleSheet.create({
  tradeRow: {
    ...GeneralStyles.box,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: s(16),
    height: vs(54),
    justifyContent: "space-between",
  },
});
