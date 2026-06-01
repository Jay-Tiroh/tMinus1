export interface Market {
  mode: string;
  source: string;
  lastUpdatedAt: string;
  tickIntervalMs: number;
}

export interface ListMeta {
  requestId: string;
  count: number;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  market: Market;
  query?: string;
  sort: string;
  order: string;
}

export interface DetailMeta {
  requestId: string;
}

export interface ChartData {
  time: string;
  priceUsd: number;
}

export interface Asset {
  id: string;
  symbol: string;
  name: string;
  network: string;
  priceUsd: number;
  change24h: number;
  isActive: boolean;
  minBuyUsd: number;
  minSellUsd: number;
  iconUrl: string;
  sparkline?: ChartData[];
}

export interface Prices {
  symbol: string;
  name: string;
  priceUsd: number;
  change24h: number;
  updatedAt: string;
}

export interface AssetsResponse {
  data: Asset[];
  meta: ListMeta;
}

export interface PricesResponse {
  data: Prices[];
  meta: {
    requestId: string;
    count: number;
    market: Market;
  };
}

export interface AssetStats {
  marketCapUsd: number;
  volume24hUsd: number;
  circulatingSupply: number;
  maxSupply: number;
  allTimeHighUsd: number;
  high24hUsd: number;
  low24hUsd: number;
  volumeToMarketCapRatio: number;
  about: string;
  websiteUrl: string;
  explorerUrl: string;
}

export interface AssetDetailsResponse {
  id: string;
  symbol: string;
  name: string;
  network: string;
  priceUsd: number;
  change24h: number;
  isActive: boolean;
  minBuyUsd: number;
  minSellUsd: number;
  iconUrl: string;
  stats: AssetStats;
  chart: ChartData[];
}

export interface AssetDetailsEnvelope {
  data: AssetDetailsResponse;
  meta: DetailMeta;
}

export interface AssetDetailsRequest {
  symbol: string;
}

export interface AssetsQueryParams {
  q?: string;
  search?: string;
  page?: number;
  limit?: number;
  sort?: string;
  order?: "asc" | "desc";
  include?: string;
}

export interface AssetsEnvelope {
  data: Asset[];
  meta: ListMeta;
}

export interface FeaturedMeta {
  type: string;
  symbol: string;
  name: string;
  priceUsd: number;
  change24h: number;
  reason: string;
}

export interface TrendingMeta {
  requestId: string;
  count: number;
  market?: Market;
  featured?: FeaturedMeta;
  include?: string[];
}

export interface TrendingResponse {
  data: Asset[];
  meta: TrendingMeta;
}

export interface TrendingQueryParams {
  include?: "sparkline" | "none";
}

export interface Candle {
  time: string;
  openUsd: number;
  highUsd: number;
  lowUsd: number;
  closeUsd: number;
  volume: number;
}

export interface CandlesQueryParams {
  symbol: string;
  interval?: string;
  limit?: number;
}

export interface CandlesResponse {
  data: Candle[];
  meta: {
    requestId: string;
    count: number;
    symbol: string;
    interval: string;
    market: Market;
  };
}

export interface OrderBookLevel {
  priceUsd: number;
  amount: number;
  total: number;
}

export interface OrderBook {
  bids: OrderBookLevel[];
  asks: OrderBookLevel[];
  spreadUsd: number;
  midPriceUsd: number;
}

export interface OrderBookQueryParams {
  symbol: string;
  levels?: number;
}

export interface OrderBookResponse {
  data: OrderBook;
  meta: {
    requestId: string;
    symbol: string;
    levels: number;
    market: Market;
  };
}

export interface Trade {
  id: string;
  side: "buy" | "sell";
  priceUsd: number;
  amount: number;
  totalUsd: number;
  createdAt: string;
}

export interface TradesQueryParams {
  symbol: string;
  limit?: number;
}

export interface TradesResponse {
  data: Trade[];
  meta: {
    requestId: string;
    count: number;
    symbol: string;
    market: Market;
  };
}
