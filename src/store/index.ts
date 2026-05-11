import { configureStore } from "@reduxjs/toolkit";
import { baseApi } from "./services/baseApi";
import menuReducer from "./slices/MenuSlice";
import authReducer from "./slices/authSlice";
import notificationReducer from "./slices/notificationSlice";

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    menu: menuReducer,
    auth: authReducer,
    notifications: notificationReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
