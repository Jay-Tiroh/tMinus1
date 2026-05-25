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
}

export interface ChartData {
  time: string;
  priceUsd: number;
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
  meta: ListMeta;
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
  chart: ChartData[];
}

export interface AssetDetailsEnvelope {
  data: AssetDetailsResponse;
  meta: DetailMeta;
}

export interface AssetDetailsRequest {
  symbol: string;
}

// For paginated/filtered asset list requests
export interface AssetsQueryParams {
  q?: string;
  search?: string;
  page?: number;
  limit?: number;
  sort?: string;
  order?: "asc" | "desc";
}

// Full response including meta, for when you need pagination info
export interface AssetsEnvelope {
  data: Asset[];
  meta: ListMeta;
}
