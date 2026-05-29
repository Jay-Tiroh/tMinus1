import { useTrendingWithMetaQuery } from "@/store/services/marketsApi";
import { TrendingQueryParams } from "@/types/assets";

export function useTrendingAssets(
  params?: TrendingQueryParams,
  pollIntervalMs = 10000,
) {
  // Switched to the WithMeta query to access both the list and the featured metadata
  const { data, isLoading, isError, refetch, isUninitialized } =
    useTrendingWithMetaQuery(params, {
      pollingInterval: pollIntervalMs, // Refreshes every 10 seconds by default
      refetchOnFocus: true, // Refreshes when the user returns to the tab
      refetchOnReconnect: true, // Refreshes if the network drops and reconnects
    });

  return {
    // The array of trending assets (with sparklines if requested)
    trending: data?.data ?? [],

    // The hero/featured asset metadata (e.g., the top gainer)
    featured: data?.meta?.featured,

    isLoading,
    isError,
    refetch,
    isUninitialized,
  };
}
