// 1. Export Screens
export { MarketsScreen } from "./screens/MarketsScreen";
export { TrendingScreen } from "./screens/TrendingScreen";
export { WatchlistScreen } from "./screens/WatchlistScreen";

// 2. Export API Hooks
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

// 3. Export Domain Models and Types (Public Contract)
// Only export the types that other features genuinely need to know about.
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
