// core/store/baseApi.ts
import { RootState } from "@/core/store";
import { getAuthBridge } from "@/core/store/authContract";
import { showErrorToast } from "@/shared/hooks/showToast";
import { getErrorMessage } from "@/shared/utils/errors";
import { clearTokens, saveToken } from "@/shared/utils/secureStore";
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Mutex } from "async-mutex";

// The refresh endpoint's response shape is baseApi's own concern —
// it no longer needs to borrow a type from the auth feature.
type RefreshResponse = {
  data: {
    user: unknown;
    token: string;
    refreshToken: string;
  };
};

const mutex = new Mutex();
const BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth?.token;
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  await mutex.waitForUnlock();

  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    if (!mutex.isLocked()) {
      const release = await mutex.acquire();
      try {
        const refreshToken = (api.getState() as RootState).auth?.refreshToken;
        if (refreshToken) {
          const refreshResult = await baseQuery(
            {
              url: "/auth/refresh",
              method: "POST",
              body: { refreshToken },
            },
            api,
            extraOptions,
          );

          if (refreshResult.data) {
            const refreshData = refreshResult.data as RefreshResponse;
            const data = refreshData.data;

            try {
              await saveToken("ACCESS_TOKEN", data.token);
              await saveToken("REFRESH_TOKEN", data.refreshToken);

              getAuthBridge().setSession({
                user: data.user,
                token: data.token,
                refreshToken: data.refreshToken,
              });

              result = await baseQuery(args, api, extraOptions);
            } catch (persistError) {
              showErrorToast({
                title: "Session Error",
                message: getErrorMessage(
                  persistError,
                  "Failed to persist session data. Please log in again.",
                ),
              });
              await clearTokens();
              getAuthBridge().clearSession();
            }
          } else {
            await clearTokens();
            getAuthBridge().clearSession();
          }
        } else {
          await clearTokens();
          getAuthBridge().clearSession();
        }
      } finally {
        release();
      }
    } else {
      await mutex.waitForUnlock();
      result = await baseQuery(args, api, extraOptions);
    }
  }
  return result;
};

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    "User",
    "Wallet",
    "Transaction",
    "Portfolio",
    "PriceAlerts",
    "Watchlist",
    "Notifications",
    "Kyc",
    "Devices",
  ],
  endpoints: () => ({}),
});
