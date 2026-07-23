// types/trades.ts

export type TradeType = "buy" | "sell" | "swap";
export type TransactionStatus = "completed" | "pending" | "failed";

export interface Quote {
  id: string;
  type: TradeType;
  fromAsset: string;
  toAsset: string;
  fromAmount: number;
  toAmount: number;
  rate: number;
  feeAmount: number;
  expiresAt: string;
  expiresInSeconds: number;
  isExpired: boolean;
}

export interface QuoteMeta {
  requestId: string;
}

export interface QuoteResponse {
  data: Quote;
  meta: QuoteMeta;
}

export interface CreateQuoteRequest {
  type: TradeType;
  fromAsset: string;
  toAsset: string;
  fromAmount?: number;
  toAmount?: number;
}

export interface Transaction {
  id: string;
  userId: string;
  type: TradeType;
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
  completedAt: string;
}

export interface WalletBalance {
  assetSymbol: string;
  available: number;
  locked: number;
}

export interface Wallet {
  id: string;
  userId: string;
  fiatCurrency: string;
  depositAddresses: string[]; // Assuming strings, update if objects are expected
  balances: WalletBalance[];
}

export interface ExecuteQuoteData {
  transaction: Transaction;
  wallet: Wallet;
}

export interface ExecuteQuoteResponse {
  data: ExecuteQuoteData;
}

export interface ExecuteQuoteRequest {
  quoteId: string;
  pin: string;
  idempotencyKey?: string; // Passed dynamically via headers
}
