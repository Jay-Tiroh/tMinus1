import { useAllAssets, useTrendingAssets } from "@/features/markets";

export const useCoinsSection = () => {
  const {
    coins,
    isSearching: coinsLoading,
    isUninitialized,
  } = useAllAssets(undefined, 10000);

  const {
    trending,
    isLoading: trendingLoading,
    isUninitialized: trendingUninitialized,
  } = useTrendingAssets(undefined, 10000);

  return {
    coins,
    coinsLoading,
    isUninitialized,
    trending,
    trendingLoading,
    trendingUninitialized,
  };
};
