// store/slices/notificationSlice.ts
import { notificationsApi } from "@/features/notifications/api/notificationsApi";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface NotificationState {
  unread: number;
}

const initialState: NotificationState = {
  unread: 0,
};

const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    setUnread: (state, action: PayloadAction<number>) => {
      state.unread = action.payload;
    },
    decrementUnread: (state) => {
      state.unread = Math.max(0, state.unread - 1);
    },
    clearUnread: (state) => {
      state.unread = 0;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      notificationsApi.endpoints.notifications.matchFulfilled,
      (state, action) => {
        state.unread = action.payload.meta.unread;
      },
    );
    builder.addMatcher(
      notificationsApi.endpoints.markNotificationRead.matchFulfilled,
      (state) => {
        state.unread = Math.max(0, state.unread - 1);
      },
    );
    builder.addMatcher(
      notificationsApi.endpoints.markAllNotificationsRead.matchFulfilled,
      (state) => {
        state.unread = 0;
      },
    );
  },
});

export const { setUnread, decrementUnread, clearUnread } =
  notificationSlice.actions;
export default notificationSlice.reducer;
