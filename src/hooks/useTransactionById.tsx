import { useGetTransactionByIdQuery } from "@/store/services/walletsApi"; // Adjust this import path as needed

export function useTransactionById(
  transactionId?: string,
  pollIntervalMs = 0, // Defaulted to 0 (disabled), useful to set higher if waiting for a "pending" status to resolve
) {
  const { data, isLoading, isFetching, isError, refetch, isUninitialized } =
    useGetTransactionByIdQuery(
      // We cast to string because the 'skip' option guarantees the query won't run if it's undefined
      transactionId as string,
      {
        skip: !transactionId, // Prevent query execution until we have a valid ID
        pollingInterval: pollIntervalMs,
        refetchOnFocus: true,
        refetchOnReconnect: true,
      },
    );

  return {
    transaction: data,

    // Status flags
    isLoading,
    isFetching,
    isError,
    isUninitialized,

    // Actions
    refetch,
  };
}
