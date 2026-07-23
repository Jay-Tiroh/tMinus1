import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AppBgState {
  color: string;
}

const initialState: AppBgState = {
  color: "#161C22", // default
};

const appBgSlice = createSlice({
  name: "appBg",
  initialState,
  reducers: {
    setAppBg: (state, action: PayloadAction<string>) => {
      state.color = action.payload;
    },
    resetAppBg: (state) => {
      state.color = initialState.color;
    },
  },
});

export const { setAppBg, resetAppBg } = appBgSlice.actions;
export default appBgSlice.reducer;
