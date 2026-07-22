import { countriesApi } from "@/store/country-picker/countriesApi";
import { configureStore } from "@reduxjs/toolkit";
import notificationReducer from "../features/notifications/storage/notificationSlice";
import tradesReducer from "../features/trades/storage/tradesSlice";
import walletsReducer from "../features/wallets/storage/walletsSlice";
import { baseApi } from "./services/baseApi";
import bottomSheetReducer from "./slices/BottomSheetSlice";
import menuReducer from "./slices/MenuSlice";
import authReducer from "./slices/authSlice";
import kycReducer from "./slices/kycSlice";
import userReducer from "./slices/userSlice";
export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    [countriesApi.reducerPath]: countriesApi.reducer,
    menu: menuReducer,
    auth: authReducer,
    notifications: notificationReducer,
    tempUser: userReducer,
    bottomSheet: bottomSheetReducer,
    kyc: kycReducer,
    trades: tradesReducer,
    wallets: walletsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware, countriesApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
