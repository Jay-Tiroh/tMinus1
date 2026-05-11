// store/slices/notificationSlice.ts
import { baseApi } from "@/store/services/baseApi";
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
    // sync unread count whenever the notifications query succeeds
    builder.addMatcher(
      baseApi.endpoints.notifications.matchFulfilled,
      (state, action) => {
        state.unread = action.payload.meta.unread;
      },
    );
    // decrement on single mark-read success
    builder.addMatcher(
      baseApi.endpoints.markNotificationRead.matchFulfilled,
      (state) => {
        state.unread = Math.max(0, state.unread - 1);
      },
    );
    // zero out on mark-all-read success
    builder.addMatcher(
      baseApi.endpoints.markAllNotificationsRead.matchFulfilled,
      (state) => {
        state.unread = 0;
      },
    );
  },
});

export const { setUnread, decrementUnread, clearUnread } =
  notificationSlice.actions;
export default notificationSlice.reducer;
