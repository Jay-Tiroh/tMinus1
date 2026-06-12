import { useGetWalletQuery } from "@/store/services/walletsApi";
import { Balance, DepositAddress } from "@/types/wallets";
import { useCallback } from "react";

export default function useWallet(pollIntervalMs = 30000) {
  const {
    data,
    isLoading,
    isFetching,
    isError,
    isSuccess,
    isUninitialized,
    refetch,
  } = useGetWalletQuery(undefined, {
    pollingInterval: pollIntervalMs,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  const wallet = data?.wallet;
  const verification = data?.verification;
  const portfolioValue = data?.portfolioValue ?? 0;
  const portfolioValueUsd = data?.portfolioValueUsd ?? 0;
  const portfolioCurrency = data?.portfolioCurrency ?? "USD";
  const balances: Balance[] = wallet?.balances ?? [];
  const depositAddresses: DepositAddress[] = wallet?.depositAddresses ?? [];

  const getDepositAddressBySymbol = useCallback(
    (symbol: string) => {
      if (!symbol) return {};

      const targetSymbol = symbol.toUpperCase();
      const foundAddress = depositAddresses.find(
        (addr) => addr.assetSymbol === targetSymbol,
      );

      return {
        address: foundAddress?.address,
        network: foundAddress?.network,
        qrPayload: foundAddress?.qrPayload,
        assetSymbol: foundAddress?.assetSymbol,
      };
    },
    [depositAddresses],
  );

  const getBalanceBySymbol = useCallback(
    (symbol: string) => {
      if (!symbol) return null;
      return (
        balances.find((b) => b.assetSymbol === symbol.toUpperCase()) ?? null
      );
    },
    [balances],
  );

  return {
    wallet,
    verification,
    portfolioValue,
    portfolioValueUsd,
    portfolioCurrency,
    balances,
    depositAddresses,
    getDepositAddressBySymbol,
    getBalanceBySymbol,
    isLoading,
    isFetching,
    isError,
    isSuccess,
    isUninitialized,
    refetch,
  };
}
