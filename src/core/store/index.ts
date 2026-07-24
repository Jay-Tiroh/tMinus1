import authReducer from "@/features/auth/store/authSlice";
import kycReducer from "@/features/kyc/store/kycSlice";
import notificationReducer from "@/features/notifications/store/notificationSlice";
import tradesReducer from "@/features/trades/store/tradesSlice";
import walletsReducer from "@/features/wallets/store/walletsSlice";
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
