import { useGetTransactionsQuery } from "@/store/services/walletsApi"; // Adjust this import path as needed
import { GetTransactionsQueryParams } from "@/types/wallets";
import { useMemo } from "react";

export function useTransactions(
  params?: GetTransactionsQueryParams,
  pollIntervalMs = 10000,
) {
  // Destructure safely, providing an empty object fallback if params is undefined
  const { status, type, page = 1, limit = 10, order = "desc" } = params || {};

  const queryParams: GetTransactionsQueryParams = useMemo(() => {
    // Only include properties that are defined to keep the query string clean
    const cleanParams: GetTransactionsQueryParams = {
      page,
      limit,
      order,
    };

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

    // Status flags
    isLoading,
    isFetching,
    isError,
    isUninitialized,

    // Actions
    refetch,
  };
}
