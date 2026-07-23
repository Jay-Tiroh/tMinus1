import { Colors } from "@/constants/Colors";
import CryptoAssetItem from "@/features/wallets/components/CryptoAssetItem";
import { useTransactions } from "@/features/wallets/hooks/useTransactions";
import { Transaction } from "@/features/wallets/types/wallets";
import { Spacer } from "@/shared/components/Spacer";
import { ThemedText } from "@/shared/components/ThemedText";
import { useGoToRoute } from "@/shared/hooks/useGoToRoute";
import { formatAmount } from "@/shared/utils/formatCurrency";
import { timeAgo } from "@/shared/utils/timeAgo";
import React, { useMemo } from "react";
import { Pressable, View } from "react-native";

export const RecentTransactions = () => {
  const { transactions } = useTransactions();
  const toHistory = useGoToRoute("/wallets/transaction-history");

  const displayedTransactions: Transaction[] = useMemo(() => {
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
