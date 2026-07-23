import { authReducer } from "@/features/auth";
import { kycReducer } from "@/features/kyc";
import { notificationReducer } from "@/features/notifications";
import { tradesReducer } from "@/features/trades";
import { walletsReducer } from "@/features/wallets";
import { configureStore } from "@reduxjs/toolkit";
import { baseApi } from "./baseApi";
export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    auth: authReducer,
    notifications: notificationReducer,
    kyc: kycReducer,
    trades: tradesReducer,
    wallets: walletsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
