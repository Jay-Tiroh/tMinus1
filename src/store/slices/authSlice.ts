// store/slices/authSlice.ts
import { User } from "@/types/profile";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isLocked: boolean;
}

const initialState: AuthState = {
  user: null,
  token: null,
  refreshToken: null,
  isLocked: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{
        user: User;
        token: string;
        refreshToken: string;
      }>,
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken;
    },
    clearCredentials: (state) => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
    },
    updateUserSettings(
      state,
      action: PayloadAction<Partial<User["settings"]>>,
    ) {
      if (state.user) {
        state.user.settings = {
          ...state.user.settings,
          ...action.payload,
        };
      }
    },
    lockSession: (state) => {
      state.isLocked = true;
    },
    unlockSession: (state) => {
      state.isLocked = false;
    },
  },
});

export const {
  setCredentials,
  clearCredentials,
  updateUserSettings,
  lockSession,
  unlockSession,
} = authSlice.actions;
export default authSlice.reducer;
