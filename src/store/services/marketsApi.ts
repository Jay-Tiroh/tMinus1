import {
  Asset,
  AssetDetailsEnvelope,
  AssetDetailsRequest,
  AssetDetailsResponse,
  AssetsEnvelope,
  AssetsQueryParams,
  AssetsResponse,
  PricesResponse,
} from "@/types/assets";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { baseApi } from "./baseApi";

const marketsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Returns just data[] — for screens that don't need pagination meta
    allAssets: builder.query<AssetsResponse["data"], AssetsQueryParams | void>({
      query: (params) => {
        return {
          url: `/market/assets`,
          params: params ?? undefined,
        };
      },
      transformResponse: (response: AssetsResponse) => response.data,
    }),

    // Returns full envelope — for screens that need meta (pagination, total, etc.)
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

    trending: builder.query<AssetsResponse["data"], void>({
      query: () => `/market/trending`,
      transformResponse: (response: AssetsResponse) => response.data,
    }),

    prices: builder.query<PricesResponse["data"], void>({
      query: () => `/market/prices`,
      transformResponse: (response: PricesResponse) => response.data,
    }),
  }),
  overrideExisting: false,
});

export const {
  useAllAssetsQuery,
  useAllAssetsWithMetaQuery,
  useGetAssetQuery,
  useGetAssetsQuery,
  useTrendingQuery,
  usePricesQuery,
} = marketsApi;
