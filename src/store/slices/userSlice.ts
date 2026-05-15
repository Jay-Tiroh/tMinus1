// store/slices/userSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type TempUser = { email?: string; phone?: string };

interface UserState {
  user: TempUser | null;
}

const initialState: UserState = {
  user: null,
};

const userSlice = createSlice({
  name: "tempUser",
  initialState,
  reducers: {
    setTempUser: (state, action: PayloadAction<{ user: TempUser }>) => {
      state.user = action.payload.user;
    },
    clearTempUser: (state) => {
      state.user = null;
    },
  },
});

export const { setTempUser, clearTempUser } = userSlice.actions;
export default userSlice.reducer;
