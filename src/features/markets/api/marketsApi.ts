import { baseApi } from "@/core/store/baseApi";
import {
  Asset,
  AssetDetailsEnvelope,
  AssetDetailsRequest,
  AssetDetailsResponse,
  AssetsEnvelope,
  AssetsQueryParams,
  AssetsResponse,
  CandlesQueryParams,
  CandlesResponse,
  OrderBookQueryParams,
  OrderBookResponse,
  PricesResponse,
  TradesQueryParams,
  TradesResponse,
  TrendingQueryParams,
  TrendingResponse,
} from "@/features/markets/types/assets";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";

const marketsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    allAssets: builder.query<AssetsResponse["data"], AssetsQueryParams | void>({
      query: (params) => {
        return {
          url: `/market/assets`,
          params: params ?? undefined,
        };
      },
      transformResponse: (response: AssetsResponse) => response.data,
    }),

    allAssetsWithMeta: builder.query<AssetsEnvelope, AssetsQueryParams | void>({
      query: (params) => ({
        url: `/market/assets`,
        params: params ?? undefined,
      }),
    }),

    getAsset: builder.query<AssetDetailsResponse, AssetDetailsRequest>({
      query: ({ symbol }) => `/market/assets/${symbol}`,
      transformResponse: (response: AssetDetailsEnvelope) => response.data,
    }),

    getCandles: builder.query<CandlesResponse["data"], CandlesQueryParams>({
      query: ({ symbol, ...params }) => ({
        url: `/market/assets/${symbol}/candles`,
        params,
      }),
      transformResponse: (response: CandlesResponse) => response.data,
    }),

    getOrderBook: builder.query<
      OrderBookResponse["data"],
      OrderBookQueryParams
    >({
      query: ({ symbol, ...params }) => ({
        url: `/market/assets/${symbol}/order-book`,
        params,
      }),
      transformResponse: (response: OrderBookResponse) => response.data,
    }),

    getTrades: builder.query<TradesResponse["data"], TradesQueryParams>({
      query: ({ symbol, ...params }) => ({
        url: `/market/assets/${symbol}/trades`,
        params,
      }),
      transformResponse: (response: TradesResponse) => response.data,
    }),

    getAssets: builder.query<Asset[], string[]>({
      queryFn: async (symbols, _api, _extraOptions, baseQuery) => {
        if (!symbols.length) return { data: [] };

        const results = await Promise.all(
          symbols.map((symbol) =>
            baseQuery({
              url: `/market/assets`,
              params: { q: symbol },
            }),
          ),
        );

        const firstError = results.find(
          (r): r is { error: FetchBaseQueryError; data: undefined } =>
            !!r.error,
        );
        if (firstError) return { error: firstError.error };

        const data = results.flatMap((r) => (r.data as AssetsResponse).data);

        return { data };
      },
      serializeQueryArgs: ({ queryArgs }) => queryArgs.slice().sort().join(","),
    }),

    trending: builder.query<
      TrendingResponse["data"],
      TrendingQueryParams | void
    >({
      query: (params) => ({
        url: `/market/trending`,
        params: params ?? undefined,
      }),
      transformResponse: (response: TrendingResponse) => response.data,
    }),

    trendingWithMeta: builder.query<
      TrendingResponse,
      TrendingQueryParams | void
    >({
      query: (params) => ({
        url: `/market/trending`,
        params: params ?? undefined,
      }),
    }),

    prices: builder.query<PricesResponse["data"], void>({
      query: () => `/market/prices`,
      transformResponse: (response: PricesResponse) => response.data,
    }),
  }),
  overrideExisting: true,
});

export const {
  useAllAssetsQuery,
  useAllAssetsWithMetaQuery,
  useGetAssetQuery,
  useGetCandlesQuery,
  useGetOrderBookQuery,
  useGetTradesQuery,
  useGetAssetsQuery,
  useTrendingQuery,
  useTrendingWithMetaQuery,
  usePricesQuery,
} = marketsApi;
