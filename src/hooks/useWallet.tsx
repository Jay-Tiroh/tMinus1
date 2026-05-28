import { useGetWalletQuery } from "@/store/services/walletsApi";
import { useCallback } from "react";

export default function useWallet() {
  const {
    data: rawData,
    isLoading,
    isError,
    isSuccess,
    refetch,
  } = useGetWalletQuery();

  const apiData = rawData?.data;
  const walletData = apiData?.wallet;
  const portfolioValue = apiData?.portfolioValue ?? 0;
  const portfolioCurrency = apiData?.portfolioCurrency ?? "USD";
  const balances = walletData?.balances ?? [];
  const depositAddresses = walletData?.depositAddresses ?? [];

  // The lookup function
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

  return {
    portfolioValue,
    portfolioCurrency,
    balances,
    depositAddresses,
    getDepositAddressBySymbol,
    wallet: rawData,
    isLoading,
    isError,
    isSuccess,
    refetch,
  };
}
