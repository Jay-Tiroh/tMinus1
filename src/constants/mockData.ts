// ─── Extended Types ──────────────────────────────────────────────────────────

export interface DetailItem {
  id: string;
  label: string;
  value: string;
  valueColor?: string; // Optional override for specific statuses
}

export interface DepositContextConfig {
  network: string;
  address: string;
  warningText: string;
  simulationAmount: string;
  settlementDelay: string;
}

export interface TransactionDetailsConfig {
  title: string;
  primaryAmount: string;
  status: string;
  ledgerItems: DetailItem[];
}

export interface WithdrawalContextConfig {
  assetLabel: string;
  amount: string;
  destination: string;
  network: string;
  limitTitle: string;
  limitSubtext: string;
  previewItems: DetailItem[];
}

// ─── Types ───────────────────────────────────────────────────────────────────

export interface DepositAssetConfig {
  id: string;
  symbol: string;
  name: string;
  network: string;
  amountFormatted: string;
  statusLabel: string;
  isRecommended: boolean;
}

export interface PortfolioHistoryConfig {
  id: string;
  timestamp: string; // ISO string preferred for real APIs, using display string for now
  displayMonth: string;
  portfolioValueFormatted: string;
  percentageChangeFormatted: string;
  isPositive: boolean;
}

export type TransactionType =
  | "deposit"
  | "withdrawal"
  | "buy"
  | "sell"
  | "swap"
  | "alert";
export type TransactionStatus =
  | "Completed"
  | "Pending"
  | "Review"
  | "Triggered";

export interface TransactionConfig {
  id: string;
  type: TransactionType;
  primaryAssetSymbol: string;
  title: string;
  status: TransactionStatus;
  amountFormatted: string;
  timeFormatted: string;
}

// ─── Mock Data ───────────────────────────────────────────────────────────────

export const DEPOSIT_ASSETS_DATA: DepositAssetConfig[] = [
  {
    id: "asset_1",
    symbol: "USDT",
    name: "Tether",
    network: "TRC20",
    amountFormatted: "$1.00",
    statusLabel: "Recommended",
    isRecommended: true,
  },
  {
    id: "asset_2",
    symbol: "BTC",
    name: "Bitcoin",
    network: "Testnet",
    amountFormatted: "$64,200.50",
    statusLabel: "Available",
    isRecommended: false,
  },
  {
    id: "asset_3",
    symbol: "ETH",
    name: "Ethereum",
    network: "Sepolia",
    amountFormatted: "$3,420.00",
    statusLabel: "Available",
    isRecommended: false,
  },
];

export const PORTFOLIO_HISTORY_DATA: PortfolioHistoryConfig[] = [
  {
    id: "ph_1",
    timestamp: "2026-05-01T00:00:00Z",
    displayMonth: "May 2026",
    portfolioValueFormatted: "$4,892.40",
    percentageChangeFormatted: "+3.8%",
    isPositive: true,
  },
  {
    id: "ph_2",
    timestamp: "2026-04-01T00:00:00Z",
    displayMonth: "April 2026",
    portfolioValueFormatted: "$4,713.20",
    percentageChangeFormatted: "+1.2%",
    isPositive: true,
  },
  {
    id: "ph_3",
    timestamp: "2026-03-01T00:00:00Z",
    displayMonth: "March 2026",
    portfolioValueFormatted: "$4,421.00",
    percentageChangeFormatted: "-0.8%",
    isPositive: false,
  },
];

export const TRANSACTIONS_DATA: TransactionConfig[] = [
  {
    id: "tx_1",
    type: "deposit",
    primaryAssetSymbol: "USDT",
    title: "USDT deposit",
    status: "Completed",
    amountFormatted: "+$250.00",
    timeFormatted: "Today",
  },
  {
    id: "tx_2",
    type: "buy",
    primaryAssetSymbol: "BTC",
    title: "BTC buy",
    status: "Completed",
    amountFormatted: "-$100.00",
    timeFormatted: "Today",
  },
  {
    id: "tx_3",
    type: "withdrawal",
    primaryAssetSymbol: "USDT",
    title: "USDT withdrawal",
    status: "Pending",
    amountFormatted: "-100.00",
    timeFormatted: "Review",
  },
  {
    id: "tx_4",
    type: "swap",
    primaryAssetSymbol: "ETH",
    title: "ETH swap",
    status: "Completed",
    amountFormatted: "0.03 ETH",
    timeFormatted: "Yesterday",
  },
  {
    id: "tx_5",
    type: "alert",
    primaryAssetSymbol: "BTC", // Used for the alert context
    title: "Price alert",
    status: "Triggered",
    amountFormatted: "BTC",
    timeFormatted: "Read",
  },
];
export const TRANSACTION_DETAILS: TransactionDetailsConfig = {
  title: "Sandbox USDT deposit",
  primaryAmount: "+250.00 USDT",
  status: "Completed",
  ledgerItems: [
    { id: "td_1", label: "Reference", value: "txn_193e61b9" },
    { id: "td_2", label: "Asset", value: "USDT" },
    { id: "td_3", label: "Network", value: "TRC20" },
    { id: "td_4", label: "Rate", value: "$1.00" },
    { id: "td_5", label: "Created", value: "May 27, 2026" },
    { id: "td_6", label: "Completed", value: "May 27, 2026" },
  ],
};

export const WITHDRAWAL_CONTEXT: WithdrawalContextConfig = {
  assetLabel: "USDT · Available 1,000.00",
  amount: "100.00",
  destination: "TXYZ...8K21",
  network: "TRC20 sandbox network",
  limitTitle: "Verified limit",
  limitSubtext: "$2,500 per request · $10,000 daily",
  previewItems: [
    { id: "pw_1", label: "Asset", value: "USDT" },
    { id: "pw_2", label: "Network", value: "TRC20" },
    { id: "pw_3", label: "Address", value: "TXYZ...8K21" },
    { id: "pw_4", label: "Fee", value: "1.00 USDT" },
    {
      id: "pw_5",
      label: "You receive",
      value: "99.00 USDT",
      valueColor: "#F1F6F8",
    }, // Colors.snowGray
  ],
};

export const WITHDRAWAL_SUCCESS_DATA: DetailItem[] = [
  {
    id: "ws_1",
    label: "Status",
    value: "Pending review",
    valueColor: "#F1F6F8",
  }, // Colors.snowGray
  { id: "ws_2", label: "Amount", value: "100.00 USDT" },
  { id: "ws_3", label: "Fee", value: "1.00 USDT" },
  { id: "ws_4", label: "Reference", value: "wd_8392" },
  { id: "ws_5", label: "Created", value: "May 27, 2026" },
];
