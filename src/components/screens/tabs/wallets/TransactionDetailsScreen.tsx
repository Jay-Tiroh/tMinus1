import { LabelValueItem } from "@/components/LabelValueItem";
import { Spacer } from "@/components/Spacer";
import { ThemedText } from "@/components/ThemedText";
import Template from "@/components/trades/Template";
import { Colors } from "@/constants/Colors";
import { Fonts } from "@/constants/Fonts";
import { GeneralStyles } from "@/constants/themes";
import { formatAmount, timeAgo } from "@/helpers/functions";
import { useGoToRoute } from "@/hooks/useGoToRoute";
import { useTransactionById } from "@/hooks/useTransactionById";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { View } from "react-native";

const STATUS_COLOR: Record<string, string> = {
  completed: Colors.primaryMist,
  pending: Colors.warningAmber,
  failed: Colors.loss,
};

const TransactionDetailsScreen = () => {
  const { id } = useLocalSearchParams();
  const { transaction } = useTransactionById(id as string);

  const date =
    transaction?.status === "completed"
      ? transaction?.completedAt
      : transaction?.createdAt;
  const ledgerItems = transaction
    ? [
        {
          id: "type",
          label: "Type",
          value: transaction.type.toUpperCase(),
        },
        {
          id: "from",
          label: "You paid",
          value: `${formatAmount(transaction.fromAmount)} ${transaction.fromAsset}`,
        },
        {
          id: "to",
          label: "You received",
          value: `${formatAmount(transaction.toAmount)} ${transaction.toAsset}`,
        },
        {
          id: "rate",
          label: "Rate",
          value: `1 ${transaction.fromAsset} = ${transaction.rate.toFixed(5)} ${transaction.toAsset}`,
        },
        {
          id: "fee",
          label: "Fee",
          value: `${formatAmount(transaction.feeAmount)} ${transaction.fromAsset}`,
        },
        {
          id: "reference",
          label: "Reference",
          value: transaction.reference,
        },
        {
          id: "date",
          label: "Date",
          value: timeAgo(date as string),
        },
        {
          id: "id",
          label: "Transaction ID",
          value: transaction.id,
        },
      ]
    : [];

  const toWallet = useGoToRoute("/wallets", "replace");

  return (
    <Template
      textBlockProps={{
        title: "Transaction details",
        body: "A single ledger entry with status and reference.",
      }}
      ctaProps={{
        title: "Back to wallet",
        variant: "primary",
        textStyle: {
          fontSize: 14,
          fontFamily: Fonts.bold,
        },
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
          <ThemedText
            size={14}
            weight="bold"
            color={
              STATUS_COLOR[transaction?.status ?? ""] ?? Colors.primaryMist
            }
          >
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

export default TransactionDetailsScreen;
