import type { RootState } from "@/store";
import {
  clearCredentials,
  setCredentials,
} from "@/features/auth/storage/authSlice";
import { saveToken, clearTokens } from "@/shared/utils/secureStore";
import type { RefreshResponse } from "@/features/auth/types/auth";
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Mutex } from "async-mutex";
import { showErrorToast } from "@/shared/hooks/showToast";
import { getErrorMessage } from "@/shared/utils/errors";

// Create a new mutex to prevent multiple simultaneous refresh calls
const mutex = new Mutex();
const BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;
// 1. Define your standard base query
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

// 2. Create a custom wrapper to handle re-authentication
const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  // Wait until the mutex is available without locking it
  await mutex.waitForUnlock();

  // Try the original request
  let result = await baseQuery(args, api, extraOptions);

  // If the token is expired (401 Unauthorized)

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
              // Persist BEFORE updating Redux/retrying — if this throws,
              // we must not proceed as if the session is healthy.
              await saveToken("ACCESS_TOKEN", data.token);
              await saveToken("REFRESH_TOKEN", data.refreshToken);

              api.dispatch(
                setCredentials({
                  user: data.user,
                  token: data.token,
                  refreshToken: data.refreshToken,
                }),
              );

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
              api.dispatch(clearCredentials());
            }
          } else {
            // Refresh failed (e.g., refresh token is expired/invalid)
            await clearTokens();
            api.dispatch(clearCredentials());
          }
        } else {
          // No refresh token available to send
          await clearTokens();
          api.dispatch(clearCredentials());
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

// 3. Inject the wrapped query into your api
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
