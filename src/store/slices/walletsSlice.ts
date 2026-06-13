// store/slices/walletsSlice.ts
import { SimulateDepositResponse } from "@/types/wallets";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type WalletsState = {
  lastDeposit: SimulateDepositResponse["data"] | null;
};

const initialState: WalletsState = {
  lastDeposit: null,
};

const walletsSlice = createSlice({
  name: "wallets",
  initialState,
  reducers: {
    setLastDeposit(
      state,
      action: PayloadAction<SimulateDepositResponse["data"]>,
    ) {
      state.lastDeposit = action.payload;
    },
    clearLastDeposit(state) {
      state.lastDeposit = null;
    },
  },
});

export const { setLastDeposit, clearLastDeposit } = walletsSlice.actions;
export default walletsSlice.reducer;
