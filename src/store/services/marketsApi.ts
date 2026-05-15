import {
  AssetDetailsRequest,
  AssetDetailsResponse,
  AssetsResponse,
  PricesResponse,
} from "@/types/assets";
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
      // transformResponse: (response: AssetDetailsResponse) => response.data,
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
  useTrendingQuery,
  usePricesQuery,
} = marketsApi;
