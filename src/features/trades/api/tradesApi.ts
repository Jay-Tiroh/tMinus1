// api/tradesApi.ts

import {
  CreateQuoteRequest,
  ExecuteQuoteRequest,
  ExecuteQuoteResponse,
  QuoteResponse,
} from "@/features/trades";
import { baseApi } from "@/store/services/baseApi";

const tradesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // POST /trade/quotes
    createQuote: builder.mutation<QuoteResponse["data"], CreateQuoteRequest>({
      query: (body) => ({
        url: `/trade/quotes`,
        method: "POST",
        body,
      }),
      transformResponse: (response: QuoteResponse) => response.data,
    }),

    // GET /trade/quotes/{quoteId}
    getQuote: builder.query<QuoteResponse["data"], string>({
      query: (quoteId) => `/trade/quotes/${quoteId}`,
      transformResponse: (response: QuoteResponse) => response.data,
    }),

    // POST /trade/execute
    executeQuote: builder.mutation<
      ExecuteQuoteResponse["data"],
      ExecuteQuoteRequest
    >({
      query: ({ idempotencyKey, ...body }) => ({
        url: `/trade/execute`,
        method: "POST",
        headers: idempotencyKey
          ? { "Idempotency-Key": idempotencyKey }
          : undefined,
        body,
      }),
      transformResponse: (response: ExecuteQuoteResponse) => response.data,
      // Invalidate Wallet, Transaction, and Portfolio to trigger refetches across the app
      invalidatesTags: ["Wallet", "Transaction", "Portfolio"],
    }),
  }),
  overrideExisting: true,
});

export const {
  useCreateQuoteMutation,
  useGetQuoteQuery,
  useExecuteQuoteMutation,
} = tradesApi;
