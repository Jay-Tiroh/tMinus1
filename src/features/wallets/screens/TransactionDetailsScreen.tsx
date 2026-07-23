import { LabelValueItem } from "@/components/LabelValueItem";
import { Colors } from "@/constants/Colors";
import { Fonts } from "@/constants/Fonts";
import { GeneralStyles } from "@/constants/themes";
import { useTransactionById } from "@/features/wallets/hooks/useTransactionById";
import { Spacer } from "@/shared/components/Spacer";
import Template from "@/shared/components/Template";
import { ThemedText } from "@/shared/components/ThemedText";
import { useGoToRoute } from "@/shared/hooks/useGoToRoute";
import { formatAmount } from "@/shared/utils/formatCurrency";
import { useLocalSearchParams } from "expo-router";
import React, { useMemo } from "react";
import { View } from "react-native";
import { TRANSACTION_STATUS_COLORS } from "../constants/wallets.constants";
import { mapTransactionToLedgerItems } from "../utils/transaction.mappers";

export const TransactionDetailsScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { transaction } = useTransactionById(id);
  const toWallet = useGoToRoute("/wallets", "replace");

  const ledgerItems = useMemo(
    () => mapTransactionToLedgerItems(transaction),
    [transaction],
  );
  const statusColor =
    TRANSACTION_STATUS_COLORS[transaction?.status ?? ""] ?? Colors.primaryMist;

  return (
    <Template
      textBlockProps={{
        title: "Transaction details",
        body: "A single ledger entry with status and reference.",
      }}
      ctaProps={{
        title: "Back to wallet",
        variant: "primary",
        textStyle: { fontSize: 14, fontFamily: Fonts.bold },
        onPress: toWallet,
      }}
    >
      <View style={GeneralStyles.wrapper}>
        <View
          style={[
            GeneralStyles.box,
            { padding: 24, backgroundColor: Colors.surfaceGreenNight, gap: 8 },
          ]}
        >
          <ThemedText weight="bold" size={16} color={Colors.snowGray}>
            {transaction?.note}
          </ThemedText>
          <ThemedText weight="bold" size={32} color={Colors.primary}>
            {transaction
              ? `${formatAmount(transaction.toAmount)} ${transaction.toAsset}`
              : "—"}
          </ThemedText>
          <ThemedText size={14} weight="bold" color={statusColor}>
            {transaction?.status?.toUpperCase()}
          </ThemedText>
        </View>
      </View>

      <Spacer size={24} />

      <View style={[GeneralStyles.wrapper, { gap: 2 }]}>
        <View style={[GeneralStyles.box, { overflow: "hidden" }]}>
          {ledgerItems.map((item) => (
            <LabelValueItem
              key={item.id}
              label={item.label}
              value={item.value}
            />
          ))}
        </View>
      </View>
    </Template>
  );
};
