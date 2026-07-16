import { useGetTransactionByIdQuery } from "@/features/wallets/api/walletsApi";

export function useTransactionById(transactionId?: string, pollIntervalMs = 0) {
  const { data, isLoading, isFetching, isError, refetch, isUninitialized } =
    useGetTransactionByIdQuery(transactionId as string, {
      skip: !transactionId,
      pollingInterval: pollIntervalMs,
      refetchOnFocus: true,
      refetchOnReconnect: true,
    });

  return {
    transaction: data,
    isLoading,
    isFetching,
    isError,
    isUninitialized,
    refetch,
  };
}
