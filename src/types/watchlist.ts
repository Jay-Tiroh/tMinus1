import { Asset } from "@/features/markets/types/assets";

export interface WatchlistMeta {
  requestId: string;
  count?: number;
}

// Response for GET /me/watchlist
export interface WatchlistAssetsResponse {
  data: Asset[];
  meta: WatchlistMeta;
}

// Response for POST and DELETE /me/watchlist/{symbol}
export interface WatchlistSymbolsResponse {
  data: string[]; // Array of symbols, e.g., ["BTC", "ETH", "SOL"]
  meta: WatchlistMeta;
}
