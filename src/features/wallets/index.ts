// ─── Screens (Consumed by the routing layer in src/app) ─────────────
export { DepositAddressScreen } from "./screens/DepositAddressScreen";
export { DepositAssetSelectionScreen } from "./screens/DepositAssetSelectionScreen";
export { PortfolioHistoryScreen } from "./screens/PortfolioHistoryScreen";
export { SimulateDepositScreen } from "./screens/SimulateDepositScreen";
export { SuccessScreen } from "./screens/SuccessScreen";
export { TransactionDetailsScreen } from "./screens/TransactionDetailsScreen";
export { TransactionHistoryScreen } from "./screens/TransactionHistoryScreen";
export { TransferScreen } from "./screens/TransferScreen";
export { WalletsScreen } from "./screens/WalletsScreen";
export { WithdrawConfirmationScreen } from "./screens/WithdrawConfirmationScreen";
export { WithdrawFormScreen } from "./screens/WithdrawFormScreen";

// ─── Public Hooks (Consumed by other features requiring wallet data) ──
export { useTransactionById } from "./hooks/useTransactionById";
export { useTransactions } from "./hooks/useTransactions";
export { default as useWallet } from "./hooks/useWallet";

// ─── Components (Consumed by other features) ──

export { default as BalanceComponent } from "./components/Balance";
export { default as CryptoAssetItem } from "./components/CryptoAssetItem";

// ─── Domain Models (Consumed by cross-feature types and props) ──────
export type {
  Balance,
  DepositAddress,
  PortfolioChartPoint,
  Transaction,
  TransactionStatus,
  TransactionType,
  TransferData,
  Wallet,
  WalletVerification,
  Withdrawal,
} from "./types/wallets"; // Assuming your types file is saved here
