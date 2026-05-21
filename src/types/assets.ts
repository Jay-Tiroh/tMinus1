export interface Market {
  mode: string;
  source: string;
  lastUpdatedAt: string;
  tickIntervalMs: number;
}

export interface ListMeta {
  count: number;
  market: Market;
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
  meta: DetailMeta;
}

export interface AssetDetailsEnvelope {
  data: AssetDetailsResponse;
  meta: DetailMeta;
}

export interface AssetDetailsRequest {
  symbol: string;
}
