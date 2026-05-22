import type { RootState } from "@/store";
import { clearCredentials, setCredentials } from "@/store/slices/authSlice"; // Adjust path if needed
import type { RefreshResponse } from "@/types/auth"; // Adjust path if needed
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Mutex } from "async-mutex";

// Create a new mutex to prevent multiple simultaneous refresh calls
const mutex = new Mutex();

// 1. Define your standard base query
const baseQuery = fetchBaseQuery({
  baseUrl: "https://crypto-api-guwm.onrender.com",
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
    // Check if the mutex is locked (meaning another request is already refreshing the token)
    if (!mutex.isLocked()) {
      const release = await mutex.acquire();
      try {
        const refreshToken = (api.getState() as RootState).auth?.refreshToken;

        if (refreshToken) {
          // Attempt to refresh using baseQuery to avoid infinite loops
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
            // Success: extract new tokens
            const refreshData = refreshResult.data as RefreshResponse;
            const data = refreshData.data;

            // Dispatch the new tokens to the Redux store
            api.dispatch(
              setCredentials({
                user: data.user,
                token: data.token,
                refreshToken: data.refreshToken,
              }),
            );

            // Retry the original query with the fresh token
            result = await baseQuery(args, api, extraOptions);
          } else {
            // Refresh failed (e.g., refresh token is expired/invalid)
            api.dispatch(clearCredentials());
          }
        } else {
          // No refresh token available to send
          api.dispatch(clearCredentials());
        }
      } finally {
        // Release the mutex lock so other waiting requests can proceed
        release();
      }
    } else {
      // If the mutex is already locked, wait for it to be unlocked by the first request
      await mutex.waitForUnlock();
      // Retry the original request (it will automatically grab the new token from the store)
      result = await baseQuery(args, api, extraOptions);
    }
  }

  return result;
};

// 3. Inject the wrapped query into your api
export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["User", "Wallet", "Transaction", "Portfolio"],
  endpoints: () => ({}),
});
