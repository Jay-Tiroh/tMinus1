import {
  CreatePriceAlertRequest,
  CreatePriceAlertResponse,
  DeleteResponse,
  PriceAlertsResponse,
  UpdatePriceAlertRequest,
  UpdatePriceAlertResponse,
} from "@/features/user/types/priceAlerts";
import { baseApi } from "@/store/services/baseApi";

const priceAlertsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPriceAlerts: builder.query<PriceAlertsResponse, void>({
      query: () => "/me/price-alerts",
      providesTags: ["PriceAlerts"],
    }),

    createPriceAlert: builder.mutation<
      CreatePriceAlertResponse,
      CreatePriceAlertRequest
    >({
      query: (alertData) => ({
        url: "/me/price-alerts",
        method: "POST",
        body: alertData,
      }),
      invalidatesTags: ["PriceAlerts"],
    }),

    updatePriceAlert: builder.mutation<
      UpdatePriceAlertResponse,
      { alertId: string; data: UpdatePriceAlertRequest }
    >({
      query: ({ alertId, data }) => ({
        url: `/me/price-alerts/${alertId}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["PriceAlerts"],
    }),

    deletePriceAlert: builder.mutation<DeleteResponse, string>({
      query: (alertId) => ({
        url: `/me/price-alerts/${alertId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["PriceAlerts"],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetPriceAlertsQuery,
  useCreatePriceAlertMutation,
  useUpdatePriceAlertMutation,
  useDeletePriceAlertMutation,
} = priceAlertsApi;
