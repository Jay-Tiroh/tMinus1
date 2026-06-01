import {
  useAddToWatchlistMutation,
  useGetWatchlistQuery,
  useRemoveFromWatchlistMutation,
} from "@/store/services/watchlistApi";

export function useWatchlist(pollIntervalMs = 10000) {
  const { data, isLoading, isError, refetch, isUninitialized } =
    useGetWatchlistQuery(undefined, {
      pollingInterval: pollIntervalMs, // Refreshes every 10 seconds by default
      refetchOnFocus: true, // Refreshes when the user returns to the tab
      refetchOnReconnect: true, // Refreshes if the network drops and reconnects
    });

  // 2. Hook up the mutations for adding/removing
  const [
    addTrigger,
    { isLoading: isAdding, isSuccess: isAdded, isError: isAddingError },
  ] = useAddToWatchlistMutation();
  const [
    removeTrigger,
    { isLoading: isRemoving, isSuccess: isRemoved, isError: isRemovingError },
  ] = useRemoveFromWatchlistMutation();

  // 3. Convenience method to check if a symbol is already in the watchlist
  const isInWatchlist = (symbol: string) => {
    if (!data) return false;
    return data.some((asset) => asset.symbol === symbol);
  };

  return {
    // Data & Query States
    watchlist: data ?? [],
    isLoading,
    isError,
    refetch,
    isUninitialized,

    // Mutations
    addToWatchlist: addTrigger,
    isAdding,
    isAdded,
    isAddingError,
    removeFromWatchlist: removeTrigger,
    isRemoving,
    isRemoved,
    isRemovingError,

    // Helpers
    isInWatchlist,
  };
}
