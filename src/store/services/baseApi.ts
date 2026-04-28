import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://your-api.com/api/v1/", // ← swap this
    prepareHeaders: (headers) => {
      // attach token here later
      return headers;
    },
  }),
  endpoints: () => ({}),
});
