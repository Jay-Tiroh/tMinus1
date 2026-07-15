import {
  Notification,
  NotificationsResponse,
} from "@/features/notifications/types/notification";
import { baseApi } from "@/store/services/baseApi";

export const notificationsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    notifications: builder.query<NotificationsResponse, void>({
      query: () => "/me/notifications",
      providesTags: [{ type: "Notifications", id: "LIST" }],
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
      invalidatesTags: [{ type: "Notifications", id: "LIST" }],
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
      invalidatesTags: [{ type: "Notifications", id: "LIST" }],
    }),
  }),
  overrideExisting: true,
});

export const {
  useNotificationsQuery,
  useMarkNotificationReadMutation,
  useMarkAllNotificationsReadMutation,
} = notificationsApi;
