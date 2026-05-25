import {
  CreatePriceAlertRequest,
  CreatePriceAlertResponse,
  DeleteResponse,
  PriceAlertsResponse,
  UpdatePriceAlertRequest,
  UpdatePriceAlertResponse,
} from "@/types/priceAlerts"; // Adjust the import path if necessary
import { baseApi } from "./baseApi";

const priceAlertsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET /me/price-alerts
    getPriceAlerts: builder.query<PriceAlertsResponse, void>({
      query: () => "/me/price-alerts",
      providesTags: ["PriceAlerts"],
    }),

    // POST /me/price-alerts
    createPriceAlert: builder.mutation<
      CreatePriceAlertResponse,
      CreatePriceAlertRequest
    >({
      query: (alertData) => ({
        url: "/me/price-alerts",
        method: "POST",
        body: alertData,
      }),
      // Invalidate so the list refreshes automatically when a new alert is created
      invalidatesTags: ["PriceAlerts"],
    }),

    // PATCH /me/price-alerts/{alertId}
    updatePriceAlert: builder.mutation<
      UpdatePriceAlertResponse,
      { alertId: string; data: UpdatePriceAlertRequest }
    >({
      query: ({ alertId, data }) => ({
        url: `/me/price-alerts/${alertId}`,
        method: "PATCH",
        body: data,
      }),
      // Invalidate so the list reflects the updated alert status/data
      invalidatesTags: ["PriceAlerts"],
    }),

    // DELETE /me/price-alerts/{alertId}
    deletePriceAlert: builder.mutation<DeleteResponse, string>({
      query: (alertId) => ({
        url: `/me/price-alerts/${alertId}`,
        method: "DELETE",
      }),
      // Invalidate so the deleted alert is removed from the list
      invalidatesTags: ["PriceAlerts"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetPriceAlertsQuery,
  useCreatePriceAlertMutation,
  useUpdatePriceAlertMutation,
  useDeletePriceAlertMutation,
} = priceAlertsApi;
