import { Spacer } from "@/components/Spacer";
import { ThemedText } from "@/components/ThemedText";
import CryptoAssetItem from "@/components/wallets/CryptoAssetItem";
import { Colors } from "@/constants/Colors";
import { useTransactions } from "@/features/wallets/hooks/useTransactions";
import { formatAmount, timeAgo } from "@/helpers/functions";
import { useGoToRoute } from "@/hooks/useGoToRoute";
import React, { useMemo } from "react";
import { Pressable, View } from "react-native";

export const RecentTransactions = () => {
  const { transactions } = useTransactions();
  const toHistory = useGoToRoute("/wallets/transaction-history");

  const displayedTransactions = useMemo(() => {
    return transactions.slice(0, 5);
  }, [transactions]);

  if (displayedTransactions.length === 0) return null;

  return (
    <View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <ThemedText color={Colors.snowGray} size={16} weight="bold">
          Recent Transactions
        </ThemedText>
        <Pressable onPress={toHistory} hitSlop={20}>
          <ThemedText color={Colors.primaryClean} size={12} weight="bold">
            See All
          </ThemedText>
        </Pressable>
      </View>
      <Spacer size={14} />
      <View style={{ gap: 10 }}>
        {displayedTransactions.map((tx) => (
          <CryptoAssetItem
            key={tx.id}
            iconSymbol={tx.toAsset}
            leftBody={tx.status}
            leftTitle={tx.note}
            rightTitle={
              formatAmount(tx.toAmount + tx.feeAmount) + " " + tx.toAsset
            }
            rightBody={timeAgo(tx.createdAt)}
            numberOfLines={1}
          />
        ))}
      </View>
    </View>
  );
};
