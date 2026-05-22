// Enums / Literal Types
export type PortfolioRange = "1D" | "1W" | "1M" | "1Y";
export type TransactionStatus =
  | "pending"
  | "completed"
  | "failed"
  | "cancelled";
export type TransactionType =
  | "buy"
  | "sell"
  | "swap"
  | "deposit"
  | "withdrawal";

// Base Models
export interface DepositAddress {
  assetSymbol: string;
  network: string;
  address: string;
  qrPayload: string;
}

export interface Balance {
  assetSymbol: string;
  available: number;
  locked: number;
}

export interface Wallet {
  id: string;
  userId: string;
  fiatCurrency: string;
  depositAddresses: DepositAddress[];
  balances: Balance[];
}

export interface PortfolioChartPoint {
  time: string;
  valueUsd: number;
}

export interface Transaction {
  id: string;
  userId: string;
  type: TransactionType;
  status: TransactionStatus;
  fromAsset: string;
  toAsset: string;
  fromAmount: number;
  toAmount: number;
  feeAmount: number;
  rate: number;
  reference: string;
  note: string;
  createdAt: string;
  completedAt: string | null;
}

export interface Withdrawal {
  id: string;
  userId: string;
  assetSymbol: string;
  amount: number;
  feeAssetAmount: number;
  address: string;
  network: string;
  status: TransactionStatus; // Typically shares the same status types
  createdAt: string;
  reviewedAt: string | null;
  reviewerNote: string | null;
}

// Request Data Models
export interface SimulateDepositRequest {
  amount: number;
  settlementDelaySeconds: number;
}

export interface WithdrawalRequest {
  assetSymbol: string;
  amount: number;
  address: string;
  network: string;
}

export interface GetTransactionsQueryParams {
  status?: TransactionStatus;
  type?: TransactionType;
  page?: number;
  limit?: number;
  order?: "asc" | "desc";
}

// Response Models
export interface WalletResponse {
  data: {
    wallet: Wallet;
    portfolioValueUsd: number;
  };
}

export interface PortfolioHistoryMeta {
  count: number;
  range: PortfolioRange;
  latestValueUsd: number;
}

export interface PortfolioHistoryResponse {
  data: PortfolioChartPoint[];
  meta: PortfolioHistoryMeta;
}

export interface DepositAddressesResponse {
  data: DepositAddress[];
  meta: {
    count: number;
  };
}

export interface SingleDepositAddressResponse {
  data: DepositAddress;
}

export interface TransactionsResponse {
  data: Transaction[];
  meta: {
    count: number;
  };
}

export interface TransactionDetailResponse {
  data: Transaction;
}

export interface SimulateDepositResponse {
  data: {
    transaction: Transaction;
    wallet: Wallet;
    estimatedCompletionAt: string;
    pollingUrl: string;
  };
}

export interface WithdrawalResponse {
  data: Withdrawal;
}
