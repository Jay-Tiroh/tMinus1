import { useTrendingQuery } from "@/store/services/marketsApi";

export function useTrendingAssets(pollIntervalMs = 10000) {
  const { data, isLoading, isError, refetch, isUninitialized } =
    useTrendingQuery(undefined, {
      pollingInterval: pollIntervalMs, // Refreshes every 60 seconds by default
      refetchOnFocus: true, // Refreshes when the user returns to the tab
      refetchOnReconnect: true, // Refreshes if the network drops and reconnects
    });

  return {
    trending: data ?? [],
    isLoading,
    isError,
    refetch,
    isUninitialized,
  };
}
