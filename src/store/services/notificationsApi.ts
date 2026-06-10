import { NotificationsResponse } from "@/types/notification";
import { baseApi } from "./baseApi";

const notificationsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    notifications: builder.query<NotificationsResponse, void>({
      query: () => "/me/notifications",
      providesTags: ["Notifications"],
    }),
    markNotificationRead: builder.mutation<void, string>({
      query: (notificationId) => ({
        url: `/me/notifications/${notificationId}/read`,
        method: "POST",
      }),
      invalidatesTags: ["Notifications"],
    }),
    markAllNotificationsRead: builder.mutation<void, void>({
      query: () => ({ url: "/me/notifications/read-all", method: "POST" }),
      invalidatesTags: ["Notifications"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useNotificationsQuery,
  useMarkNotificationReadMutation,
  useMarkAllNotificationsReadMutation,
} = notificationsApi;
