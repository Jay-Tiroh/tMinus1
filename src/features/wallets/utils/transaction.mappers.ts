import { Colors } from "@/constants/Colors";
import { formatAmount, timeAgo } from "@/helpers/functions";
import { Transaction } from "../types/wallets"; // Adjust type import based on your codebase

export type SuccessScreenType = "deposit" | "withdrawal" | "transfer";

export interface TransactionDisplayItem {
  id: string;
  label: string;
  value: string;
  valueColor?: string;
}

export const mapTransactionToDisplayItems = (
  type: SuccessScreenType,
  lastDeposit?: any,
  lastWithdrawal?: any,
  lastTransfer?: any,
): {
  items: TransactionDisplayItem[];
  transactionId?: string;
  hasData: boolean;
} => {
  if (type === "deposit" && lastDeposit) {
    const transaction = lastDeposit.transaction;
    const estimatedCompletionAt = lastDeposit.estimatedCompletionAt;
    return {
      hasData: true,
      transactionId: transaction?.id,
      items: [
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
      ],
    };
  }

  if (type === "withdrawal" && lastWithdrawal) {
    return {
      hasData: true,
      transactionId: lastWithdrawal.id,
      items: [
        { id: "s_1", label: "Asset", value: lastWithdrawal.assetSymbol ?? "—" },
        {
          id: "s_2",
          label: "Amount",
          value: `-${formatAmount(lastWithdrawal.amount)}`,
          valueColor: Colors.loss,
        },
        { id: "s_3", label: "Fee", value: `${lastWithdrawal.feeAssetAmount}` },
        {
          id: "s_4",
          label: "Destination",
          value: lastWithdrawal.address ?? "—",
        },
        { id: "s_5", label: "Network", value: lastWithdrawal.network ?? "—" },
        { id: "s_6", label: "Status", value: lastWithdrawal.status ?? "—" },
      ],
    };
  }

  if (type === "transfer" && lastTransfer) {
    const transfer = lastTransfer.transfer;
    const transaction = lastTransfer.transaction;
    return {
      hasData: true,
      transactionId: transaction?.id,
      items: [
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
      ],
    };
  }

  return { hasData: false, items: [] };
};

export const mapTransactionToLedgerItems = (
  transaction?: Transaction | null,
): TransactionDisplayItem[] => {
  if (!transaction) return [];

  const date =
    transaction.status === "completed"
      ? transaction.completedAt
      : transaction.createdAt;

  return [
    { id: "type", label: "Type", value: transaction.type.toUpperCase() },
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
    { id: "reference", label: "Reference", value: transaction.reference },
    { id: "date", label: "Date", value: timeAgo(date as string) },
    { id: "id", label: "Transaction ID", value: transaction.id },
  ];
};
