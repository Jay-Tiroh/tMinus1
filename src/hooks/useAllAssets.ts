import { useAllAssetsQuery } from "@/store/services/marketsApi";
import { AssetsQueryParams } from "@/types/assets";
import { useMemo } from "react";

export function useAllAssets(q?: string, pollIntervalMs = 10000) {
  const params: AssetsQueryParams | undefined = useMemo(() => {
    // Check if 'q' is actually a string before trimming
    if (typeof q !== "string" || q.trim() === "") return undefined;

    return {
      search: q.trim().toLowerCase(),
      page: 1,
      limit: 10,
      sort: "priceUsd",
      order: "desc",
    };
  }, [q]);

  const { data, isLoading, isFetching, isError, refetch } = useAllAssetsQuery(
    params,
    {
      pollingInterval: pollIntervalMs,
      refetchOnFocus: true,
      refetchOnReconnect: true,
    },
  );

  return {
    coins: data ?? [],
    isSearching: isFetching,
    isError,
    refetch,
  };
}
