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

export interface Meta {
  count: number;
  market: Market;
}

export interface Prices {
  symbol: string;
  name: string;
  priceUsd: number;
  change24h: number;
  updatedAt: string; // ISO 8601 Date String
}

export interface AssetsResponse {
  data: Asset[];
  meta: Meta;
}

export interface Market {
  mode: string;
  source: string;
  lastUpdatedAt: string;
  tickIntervalMs: number;
}

export interface ChartData {
  time: string;
  priceUsd: number;
}

export interface AssetDetailsResponse extends Asset {
  chart: ChartData[];
}

export interface AssetDetailsRequest {
  symbol: string;
}

export interface PricesResponse {
  data: Prices[];
  meta: Meta;
}
