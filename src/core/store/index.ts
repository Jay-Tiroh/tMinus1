import authReducer from "@/features/auth/storage/authSlice";
import kycReducer from "@/features/kyc/store/kycSlice";
import notificationReducer from "@/features/notifications/storage/notificationSlice";
import tradesReducer from "@/features/trades/storage/tradesSlice";
import walletsReducer from "@/features/wallets/storage/walletsSlice";
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
