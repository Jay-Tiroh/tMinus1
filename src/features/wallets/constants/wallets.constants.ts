import { Colors } from "@/constants/Colors";
import { TransactionType } from "@/features/wallets/types/wallets";

export const PORTFOLIO_TIME_OPTIONS = {
  "1D": "1 Day",
  "1W": "1 Week",
  "1M": "1 Month",
  "1Y": "1 Year",
} as const;

export const TRANSACTION_STATUS_COLORS: Record<string, string> = {
  completed: Colors.primaryMist,
  pending: Colors.warningAmber,
  failed: Colors.loss,
};

export const TRANSACTION_TAB_MAP: Record<string, TransactionType | undefined> =
  {
    All: undefined,
    Deposits: "deposit",
    Withdrawals: "withdrawal",
    Transfers: "transfer",
    Buys: "buy",
    Sells: "sell",
    Swaps: "swap",
  };

export const TRANSACTION_TABS = Object.keys(TRANSACTION_TAB_MAP);

export const TRANSFER_STEPS = [
  {
    step: 1,
    title: "Send to",
    body: "Enter a recipient email, phone number, user id, or wallet deposit address.",
    ctaLabel: "Continue",
  },
  {
    step: 2,
    title: "Amount",
    body: "Select an asset and enter the transfer amount.",
    ctaLabel: "Review Transfer",
  },
  {
    step: 3,
    title: "Review Transfer",
    body: "Please verify the details before sending. Transfers are irreversible.",
    ctaLabel: "Confirm & Send",
  },
] as const;

export const TRANSFER_QUICK_AMOUNTS = [25, 50, 75, 100];
export const TRANSFER_NETWORK_FEE_RATE = 0.001;
