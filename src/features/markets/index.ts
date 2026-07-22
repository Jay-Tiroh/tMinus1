// 1. Screens
export { MarketsScreen } from "./screens/MarketsScreen";
export { TrendingScreen } from "./screens/TrendingScreen";
export { WatchlistScreen } from "./screens/WatchlistScreen";

// 2. Feature Hooks
export { useAllAssets } from "./hooks/useAllAssets";
export { useAssetChart } from "./hooks/useAssetChart";
export { useTrendingAssets } from "./hooks/useTrendingAssets";
export { useWatchlist } from "./hooks/useWatchlist";

// 3. API Query/Mutation Hooks
export {
  useAllAssetsQuery,
  useAllAssetsWithMetaQuery,
  useGetAssetQuery,
  useGetAssetsQuery,
  useGetCandlesQuery,
  useGetOrderBookQuery,
  useGetTradesQuery,
  usePricesQuery,
  useTrendingQuery,
  useTrendingWithMetaQuery,
} from "./api/marketsApi";

// 4. Domain Models and Types
export type {
  Asset,
  AssetDetailsResponse,
  AssetStats,
  Candle,
  ChartData,
  FeaturedMeta,
  Market,
  OrderBook,
  OrderBookLevel,
  Prices,
  Trade,
  TrendingMeta,
} from "./types/assets";
