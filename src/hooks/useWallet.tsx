import {
  useGetDepositAddressesQuery,
  useGetWalletQuery,
} from "@/store/services/walletsApi";
import { Balance } from "@/types/wallets";
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

  const {
    data: depositAddresses = [],
    isLoading: isDepositAddressesLoading,
    refetch: refetchDepositAddresses,
  } = useGetDepositAddressesQuery();

  const wallet = data?.wallet;
  const verification = data?.verification;
  const portfolioValue = data?.portfolioValue ?? 0;
  const portfolioValueUsd = data?.portfolioValueUsd ?? 0;
  const portfolioCurrency = data?.portfolioCurrency ?? "USD";
  const balances: Balance[] = wallet?.balances;

  const getDepositAddressBySymbol = useCallback(
    (symbol: string) => {
      if (!symbol) return {};
      const targetSymbol = symbol.toUpperCase();
      const found = depositAddresses.find(
        (addr) => addr.assetSymbol === targetSymbol,
      );
      return {
        address: found?.address,
        network: found?.network,
        qrPayload: found?.qrPayload,
        assetSymbol: found?.assetSymbol,
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
    // deposit addresses state
    isDepositAddressesLoading,
    refetchDepositAddresses,
  };
}
