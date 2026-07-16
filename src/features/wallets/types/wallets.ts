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
  | "withdrawal"
  | "transfer"; // Added "transfer"

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

export interface VerificationLimits {
  depositPerTransactionUsd: number;
  tradePerTransactionUsd: number;
  withdrawalPerTransactionUsd: number;
  dailyWithdrawalUsd: number;
}

export interface WalletVerification {
  status: "approved" | "rejected" | "pending";
  tier: string;
  level: number;
  label: string;
  limits: VerificationLimits;
  canTrade: boolean;
  canWithdraw: boolean;
  canUseSandboxDeposits: boolean;
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
  value: number;
  currency: string;
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
  status: TransactionStatus;
  createdAt: string;
  reviewedAt: string | null;
  reviewerNote: string | null;
}

export interface TransferRecipient {
  id: string;
  fullName: string;
  email: string;
  phone: string;
}

export interface TransferData {
  reference: string;
  assetSymbol: string;
  amount: number;
  recipient: TransferRecipient;
}

// Request Data Models
export interface SimulateDepositRequest {
  amount: number;
  settlementDelaySeconds?: number;
}

export interface WithdrawalRequest {
  assetSymbol: string;
  amount: number;
  address: string;
  network: string;
}

export interface InternalTransferRequest {
  assetSymbol: string;
  amount: number;
  recipient: string;
  pin: string;
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
    portfolioValue: number;
    portfolioCurrency: string;
    verification: WalletVerification;
  };
  meta: {
    requestId: string;
  };
}

export interface PortfolioHistoryMeta {
  requestId: string;
  count: number;
  range: PortfolioRange;
  latestValueUsd: number;
  latestValue: number;
  currency: string;
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

export interface TransactionsMeta {
  requestId: string;
  count: number;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  status?: TransactionStatus;
  type?: TransactionType;
  order: "asc" | "desc";
}

export interface TransactionsResponse {
  data: Transaction[];
  meta: TransactionsMeta;
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

export interface InternalTransferResponse {
  data: {
    transfer: TransferData;
    transaction: Transaction;
    recipientTransaction: Transaction;
    wallet: Wallet;
  };
}
