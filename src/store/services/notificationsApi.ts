import { Notification, NotificationsResponse } from "@/types/notification";
import { baseApi } from "./baseApi";

const notificationsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    notifications: builder.query<NotificationsResponse, void>({
      query: () => "/me/notifications",
      providesTags: ["Notifications"],
    }),
    markNotificationRead: builder.mutation<{ data: Notification }, string>({
      query: (notificationId) => ({
        url: `/me/notifications/${notificationId}/read`,
        method: "PATCH",
      }),
      async onQueryStarted(notificationId, { dispatch, queryFulfilled }) {
        try {
          const { data: response } = await queryFulfilled;
          dispatch(
            notificationsApi.util.updateQueryData(
              "notifications",
              undefined,
              (draft) => {
                const target = draft.data.find((n) => n.id === notificationId);
                if (target) Object.assign(target, response.data);
              },
            ),
          );
        } catch {}
      },
    }),
    markAllNotificationsRead: builder.mutation<void, void>({
      query: () => ({ url: "/me/notifications/read-all", method: "PATCH" }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(
            notificationsApi.util.updateQueryData(
              "notifications",
              undefined,
              (draft) => {
                draft.data.forEach((n) => (n.isRead = true));
                draft.meta.unread = 0;
              },
            ),
          );
        } catch {}
      },
    }),
  }),
  overrideExisting: true,
});

export const {
  useNotificationsQuery,
  useMarkNotificationReadMutation,
  useMarkAllNotificationsReadMutation,
} = notificationsApi;
