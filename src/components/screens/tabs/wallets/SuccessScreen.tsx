import BadgeStuff from "@/components/BadgeStuff";
import { LabelValueItem } from "@/components/LabelValueItem";
import { Spacer } from "@/components/Spacer";
import Template from "@/components/trades/Template";
import { Colors } from "@/constants/Colors";
import { GeneralStyles } from "@/constants/themes";
import { formatAmount } from "@/helpers/functions";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  clearLastDeposit,
  clearLastTransfer,
  clearLastWithdrawal,
} from "@/store/slices/walletsSlice";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { View } from "react-native";

type SuccessType = "deposit" | "withdrawal" | "transfer";

const COPY: Record<SuccessType, { title: string; body: string }> = {
  deposit: {
    title: "Deposit submitted",
    body: "Your sandbox deposit is pending and will complete automatically.",
  },
  withdrawal: {
    title: "Withdrawal submitted",
    body: "Your withdrawal is being processed and will update shortly.",
  },
  transfer: {
    title: "Transfer sent",
    body: "Your transfer has been sent to the recipient.",
  },
};

const SuccessScreen = () => {
  const params = useLocalSearchParams<{ type?: string }>();
  const type: SuccessType =
    params.type === "withdrawal" || params.type === "transfer"
      ? params.type
      : "deposit";

  const router = useRouter();
  const dispatch = useAppDispatch();

  const lastDeposit = useAppSelector((s) => s.wallets.lastDeposit);
  const lastWithdrawal = useAppSelector((s) => s.wallets.lastWithdrawal);
  const lastTransfer = useAppSelector((s) => s.wallets.lastTransfer);

  const transactionId =
    type === "deposit"
      ? lastDeposit?.transaction.id
      : type === "withdrawal"
        ? lastWithdrawal?.id
        : lastTransfer?.transaction.id;

  const items = (() => {
    if (type === "deposit") {
      const transaction = lastDeposit?.transaction;
      const estimatedCompletionAt = lastDeposit?.estimatedCompletionAt;
      return [
        { id: "s_1", label: "Reference", value: transaction?.reference ?? "—" },
        { id: "s_2", label: "Asset", value: transaction?.toAsset ?? "—" },
        {
          id: "s_3",
          label: "Amount",
          value: transaction ? `+${formatAmount(transaction.toAmount)}` : "—",
          valueColor: Colors.primaryClean,
        },
        {
          id: "s_4",
          label: "Fee",
          value: transaction ? `${transaction.feeAmount}` : "—",
        },
        { id: "s_5", label: "Status", value: transaction?.status ?? "—" },
        {
          id: "s_6",
          label: "Est. completion",
          value: estimatedCompletionAt
            ? new Date(estimatedCompletionAt).toLocaleString()
            : "—",
        },
      ];
    }

    if (type === "withdrawal") {
      const withdrawal = lastWithdrawal;
      return [
        {
          id: "s_1",
          label: "Asset",
          value: withdrawal?.assetSymbol ?? "—",
        },
        {
          id: "s_2",
          label: "Amount",
          value: withdrawal ? `-${formatAmount(withdrawal.amount)}` : "—",
          valueColor: Colors.loss,
        },
        {
          id: "s_3",
          label: "Fee",
          value: withdrawal ? `${withdrawal.feeAssetAmount}` : "—",
        },
        {
          id: "s_4",
          label: "Destination",
          value: withdrawal?.address ?? "—",
        },
        {
          id: "s_5",
          label: "Network",
          value: withdrawal?.network ?? "—",
        },
        { id: "s_6", label: "Status", value: withdrawal?.status ?? "—" },
      ];
    }

    // transfer
    const transfer = lastTransfer?.transfer;
    const transaction = lastTransfer?.transaction;
    return [
      { id: "s_1", label: "Reference", value: transfer?.reference ?? "—" },
      { id: "s_2", label: "Asset", value: transfer?.assetSymbol ?? "—" },
      {
        id: "s_3",
        label: "Amount",
        value: transfer ? `-${formatAmount(transfer.amount)}` : "—",
        valueColor: Colors.loss,
      },
      {
        id: "s_4",
        label: "Recipient",
        value: transfer?.recipient.fullName ?? "—",
      },
      { id: "s_5", label: "Status", value: transaction?.status ?? "—" },
    ];
  })();

  const hasData =
    (type === "deposit" && !!lastDeposit) ||
    (type === "withdrawal" && !!lastWithdrawal) ||
    (type === "transfer" && !!lastTransfer);

  const handleViewTransaction = () => {
    if (type === "deposit") dispatch(clearLastDeposit());
    if (type === "withdrawal") dispatch(clearLastWithdrawal());
    if (type === "transfer") dispatch(clearLastTransfer());

    router.replace(`/(tabs)/wallets/transaction-details?id=${transactionId}`);
  };

  return (
    <Template
      textBlockProps={COPY[type]}
      ctaProps={{
        title: "View transaction",
        variant: "primary",
        onPress: handleViewTransaction,
        disabled: !hasData,
      }}
    >
      <Spacer size={20} />
      <BadgeStuff
        outerColor={Colors.primary}
        innerColor={Colors.primary}
        IconComponent={
          <MaterialCommunityIcons
            name="check"
            size={48}
            color={Colors.backgroundInk}
          />
        }
      />
      <Spacer size={40} />
      <View style={GeneralStyles.wrapper}>
        <View style={[GeneralStyles.box, { overflow: "hidden" }]}>
          {items.map((item) => (
            <LabelValueItem
              key={item.id}
              label={item.label}
              value={item.value}
              valueColor={item.valueColor}
            />
          ))}
        </View>
      </View>
    </Template>
  );
};

export default SuccessScreen;
