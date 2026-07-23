import { useTrendingAssets, useWatchlist } from "@/features/markets";
import useProfile from "@/features/user/hooks/useProfile";
import { useTransactions } from "@/features/wallets";
import { formatAmount } from "@/shared/utils/formatCurrency";
import { Href } from "expo-router";
import { useCallback, useMemo } from "react";

export type DashboardAction = {
  id: string;
  title: string;
  subtitle: string;
  statusText?: string;
  route: Href;
};

export const useHomeDashboard = () => {
  const { user, kycStatus, refetch: refetchKyc } = useProfile();

  const {
    trending,
    featured,
    isLoading: trendingLoading,
    isUninitialized: trendingUninitialized,
    refetch: refetchTrending,
  } = useTrendingAssets(undefined, 10000);

  const { watchlist, refetch: refetchWatchlist } = useWatchlist();
  const { transactions, refetch: refetchTransactions } = useTransactions();

  // Derived State
  const firstName = useMemo(
    () => user?.fullName?.split(" ")[0] || "User",
    [user?.fullName],
  );
  const isVerified = kycStatus === "approved";
  const tx = transactions?.[0];

  const topGainer = useMemo(
    () => trending?.find((asset) => asset.symbol === featured?.symbol),
    [trending, featured],
  );

  const watchlistItems = useMemo(
    () => watchlist?.map((asset) => asset.symbol).join(", ") || "BTC, ETH",
    [watchlist],
  );

  // Memoized Action Configuration
  const dashboardActions: DashboardAction[] = useMemo(
    () => [
      {
        id: "trending",
        title: "Trending",
        subtitle: topGainer?.name
          ? `${topGainer.name} is top gainer`
          : "Loading...",
        statusText: topGainer?.change24h ? `+${topGainer.change24h}%` : "",
        route: "/(tabs)/markets/trending" as Href,
      },
      {
        id: "watchlist",
        title: "Watchlist",
        subtitle: watchlistItems,
        statusText: "Live",
        route: "/(tabs)/markets/watchlist" as Href,
      },
      {
        id: "recent_tx",
        title: "Recent transaction",
        subtitle: tx?.note ?? "No recent transactions",
        statusText: tx
          ? `+${formatAmount((tx?.toAmount || 0) + (tx?.feeAmount || 0))} ${tx?.toAsset || ""}`
          : "",
        route: "/wallets/transaction-history" as Href,
      },
      {
        id: "kyc_status",
        title: "KYC status",
        subtitle: isVerified ? "Verified " : "Not verified",
        route: "/kyc" as Href,
      },
    ],
    [topGainer, watchlistItems, tx, isVerified],
  );

  const handleRefetch = useCallback(() => {
    refetchKyc();
    refetchTrending();
    refetchWatchlist();
    refetchTransactions();
  }, [refetchKyc, refetchTrending, refetchWatchlist, refetchTransactions]);

  return {
    firstName,
    isVerified,
    trending,
    trendingLoading,
    trendingUninitialized,
    dashboardActions,
    handleRefetch,
  };
};
