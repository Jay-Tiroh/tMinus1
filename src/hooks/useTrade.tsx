import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  useCreateQuoteMutation,
  useExecuteQuoteMutation,
  useGetQuoteQuery,
} from "@/store/services/tradesApi";
import {
  clearTrade,
  setActiveQuote,
  setLastQuoteRequest,
  setLastTransaction,
} from "@/store/slices/tradesSlice";
import { CreateQuoteRequest } from "@/types/trades";
import { useCallback, useEffect } from "react";

export default function useTrade(pollIntervalMs = 5000) {
  const dispatch = useAppDispatch();
  const activeQuoteId = useAppSelector((s) => s.trades.activeQuoteId);
  const activeQuote = useAppSelector((s) => s.trades.activeQuote);
  const lastQuoteRequest = useAppSelector((s) => s.trades.lastQuoteRequest);

  const [createQuoteMutation, createQuoteState] = useCreateQuoteMutation();
  const [executeQuoteMutation, executeQuoteState] = useExecuteQuoteMutation();

  const {
    data: activeQuoteData,
    isFetching: isFetchingQuote,
    error: quotePollError,
  } = useGetQuoteQuery(activeQuoteId as string, {
    skip: !activeQuoteId,
    pollingInterval: pollIntervalMs,
  });

  useEffect(() => {
    if (activeQuoteData && activeQuoteData !== activeQuote) {
      dispatch(setActiveQuote(activeQuoteData));
    }
  }, [activeQuoteData]);

  const createQuote = useCallback(
    async (request: CreateQuoteRequest) => {
      try {
        dispatch(setLastQuoteRequest(request));
        const quote = await createQuoteMutation(request).unwrap();
        dispatch(setActiveQuote(quote));
        return quote;
      } catch (error) {
        console.error("Failed to create quote:", error);
        throw error;
      }
    },
    [createQuoteMutation, dispatch],
  );

  const executeQuote = useCallback(
    async (pin: string, idempotencyKey?: string) => {
      if (!activeQuoteId) {
        throw new Error("No active quote available to execute.");
      }
      try {
        const result = await executeQuoteMutation({
          quoteId: activeQuoteId,
          pin,
          idempotencyKey,
        }).unwrap();
        dispatch(setLastTransaction(result.transaction));
        dispatch(clearTrade());
        return result;
      } catch (error) {
        console.error("Failed to execute trade:", error);
        throw error;
      }
    },
    [activeQuoteId, executeQuoteMutation, dispatch],
  );

  const clearActiveQuote = useCallback(() => {
    dispatch(clearTrade());
    createQuoteState.reset();
    executeQuoteState.reset();
  }, [dispatch, createQuoteState, executeQuoteState]);

  const isQuoteExpired = activeQuote?.isExpired ?? false;
  const timeRemainingSeconds = activeQuote?.expiresInSeconds ?? 0;
  const lastTransaction = useAppSelector((s) => s.trades.lastTransaction);

  return {
    activeQuote,
    activeQuoteId,
    lastQuoteRequest,
    isQuoteExpired,
    timeRemainingSeconds,
    createQuote,
    executeQuote,
    clearActiveQuote,
    isCreating: createQuoteState.isLoading,
    isExecuting: executeQuoteState.isLoading,
    isFetchingQuote,
    isCreateSuccess: createQuoteState.isSuccess,
    isExecuteSuccess: executeQuoteState.isSuccess,
    createError: createQuoteState.error,
    executeError: executeQuoteState.error,
    pollError: quotePollError,
    lastTransaction,
  };
}
