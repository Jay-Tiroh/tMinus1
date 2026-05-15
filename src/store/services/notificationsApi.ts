import { Notification, NotificationsResponse } from "@/types/notification";
import { baseApi } from "./baseApi";

const notificationsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    notifications: builder.query<NotificationsResponse, void>({
      query: () => "/me/notifications",
    }),
    markNotificationRead: builder.mutation<void, Notification>({
      query: (notification) => ({
        url: `/me/notifications/${notification.id}/read`,
        method: "POST",
      }),
    }),
    markAllNotificationsRead: builder.mutation<void, void>({
      query: () => ({ url: "/me/notifications/read-all", method: "POST" }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useNotificationsQuery,
  useMarkNotificationReadMutation,
  useMarkAllNotificationsReadMutation,
} = notificationsApi;
