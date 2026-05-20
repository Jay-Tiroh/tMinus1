import {
  AssetDetailsRequest,
  AssetDetailsResponse,
  AssetsResponse,
  PricesResponse,
} from "@/types/assets";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { baseApi } from "./baseApi";

const marketsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    allAssets: builder.query<AssetsResponse["data"], string | void>({
      query: (q) => ({
        url: `/market/assets`,
        params: q ? { q } : undefined,
      }),
      transformResponse: (response: AssetsResponse) => response.data,
    }),

    getAsset: builder.query<AssetDetailsResponse, AssetDetailsRequest>({
      query: ({ symbol }) => `/market/assets/${symbol}`,
    }),

    getAssets: builder.query<Record<string, AssetDetailsResponse>, string[]>({
      queryFn: async (symbols, _api, _extraOptions, baseQuery) => {
        if (!symbols.length) return { data: {} };

        const results = await Promise.all(
          symbols.map((symbol) =>
            baseQuery({ url: `/market/assets/${symbol}` }),
          ),
        );

        const firstError = results.find(
          (r): r is { error: FetchBaseQueryError; data: undefined } =>
            !!r.error,
        );
        if (firstError) return { error: firstError.error };

        const data: Record<string, AssetDetailsResponse> = {};
        results.forEach((r, i) => {
          data[symbols[i]] = r.data as AssetDetailsResponse;
        });

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
  useGetAssetQuery,
  useGetAssetsQuery,
  useTrendingQuery,
  usePricesQuery,
} = marketsApi;
