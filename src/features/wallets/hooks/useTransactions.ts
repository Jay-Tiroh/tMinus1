import { useGetTransactionsQuery } from "@/features/wallets/api/walletsApi";
import { GetTransactionsQueryParams } from "@/features/wallets/types/wallets";
import { useMemo } from "react";

export function useTransactions(
  params?: GetTransactionsQueryParams,
  pollIntervalMs = 10000,
) {
  const { status, type, page = 1, limit = 10, order = "desc" } = params || {};

  const queryParams: GetTransactionsQueryParams = useMemo(() => {
    const cleanParams: GetTransactionsQueryParams = { page, limit, order };
    if (status) cleanParams.status = status;
    if (type) cleanParams.type = type;
    return cleanParams;
  }, [status, type, page, limit, order]);

  const { data, isLoading, isFetching, isError, refetch, isUninitialized } =
    useGetTransactionsQuery(queryParams, {
      pollingInterval: pollIntervalMs,
      refetchOnFocus: true,
      refetchOnReconnect: true,
    });

  return {
    transactions: data?.data ?? [],
    meta: data?.meta,
    isLoading,
    isFetching,
    isError,
    isUninitialized,
    refetch,
  };
}
