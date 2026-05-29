import {
  WatchlistAssetsResponse,
  WatchlistSymbolsResponse,
} from "@/types/watchlist";
import { baseApi } from "./baseApi";

export const watchlistApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Fetches the full list of asset objects in the user's watchlist
    getWatchlist: builder.query<WatchlistAssetsResponse["data"], void>({
      query: () => `/me/watchlist`,
      transformResponse: (response: WatchlistAssetsResponse) => response.data,
      providesTags: ["Watchlist"],
    }),

    // Adds a symbol to the watchlist
    addToWatchlist: builder.mutation<WatchlistSymbolsResponse["data"], string>({
      query: (symbol) => ({
        url: `/me/watchlist/${symbol}`,
        method: "POST",
      }),
      transformResponse: (response: WatchlistSymbolsResponse) => response.data,
      invalidatesTags: ["Watchlist"],
    }),

    // Removes a symbol from the watchlist
    removeFromWatchlist: builder.mutation<
      WatchlistSymbolsResponse["data"],
      string
    >({
      query: (symbol) => ({
        url: `/me/watchlist/${symbol}`,
        method: "DELETE",
      }),
      transformResponse: (response: WatchlistSymbolsResponse) => response.data,
      invalidatesTags: ["Watchlist"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetWatchlistQuery,
  useAddToWatchlistMutation,
  useRemoveFromWatchlistMutation,
} = watchlistApi;
