import useWallet from "@/features/wallets/hooks/useWallet";
import { useAllAssets } from "@/hooks/useAllAssets";
import useFiat from "@/hooks/useFiat";
import useProfile from "@/hooks/useProfile";
import { useCallback, useMemo } from "react";

export const useWalletDashboard = () => {
  const { kycStatus, refetch: kycRefetch } = useProfile();
  const { coins, refetch: coinsRefetch } = useAllAssets();
  const { balances, refetch: walletRefetch } = useWallet();
  const { symbol: fiatSymbol, convertFromUSD } = useFiat();

  const isVerified = kycStatus === "approved";

  const handleRefresh = useCallback(() => {
    kycRefetch();
    coinsRefetch();
    walletRefetch();
  }, [kycRefetch, coinsRefetch, walletRefetch]);

  const dashboardAssets = useMemo(() => {
    if (!balances || !coins) return [];

    const assetsHeld = balances.map((balance) => balance.assetSymbol);
    const displayedCoins = coins.filter((coin) =>
      assetsHeld.includes(coin.symbol),
    );

    return displayedCoins.map((coin) => {
      const availableBalance =
        balances.find((b) => b.assetSymbol === coin.symbol)?.available || 0;
      const fiatValue = coin.priceUsd * availableBalance;

      return {
        ...coin,
        availableBalance,
        fiatValue: convertFromUSD(fiatValue),
      };
    });
  }, [balances, coins, convertFromUSD]);

  return {
    isVerified,
    dashboardAssets,
    fiatSymbol,
    handleRefresh,
  };
};
