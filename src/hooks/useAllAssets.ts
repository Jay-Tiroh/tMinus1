import { useAllAssetsQuery } from "@/store/services/marketsApi";

export function useAllAssets() {
  const { data, isLoading, isError, refetch } = useAllAssetsQuery();
  return { coins: data, isLoading, isError, refetch };
}
