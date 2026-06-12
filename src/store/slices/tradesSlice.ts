// store/slices/tradesSlice.ts
import { CreateQuoteRequest, Quote, Transaction } from "@/types/trades";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type TradesState = {
  activeQuoteId: string | null;
  activeQuote: Quote | null;
  lastTransaction: Transaction | null;
  lastQuoteRequest: CreateQuoteRequest | null;
};

const initialState: TradesState = {
  activeQuoteId: null,
  activeQuote: null,
  lastTransaction: null,
  lastQuoteRequest: null,
};

const tradesSlice = createSlice({
  name: "trades",
  initialState,
  reducers: {
    setActiveQuoteId(state, action: PayloadAction<string | null>) {
      state.activeQuoteId = action.payload;
    },
    setActiveQuote(state, action: PayloadAction<Quote | null>) {
      state.activeQuote = action.payload;
      state.activeQuoteId = action.payload?.id ?? null;
    },
    setLastTransaction(state, action: PayloadAction<Transaction>) {
      state.lastTransaction = action.payload;
    },
    clearTrade(state) {
      state.activeQuoteId = null;
      state.activeQuote = null;
    },
    setLastQuoteRequest(state, action: PayloadAction<CreateQuoteRequest>) {
      state.lastQuoteRequest = action.payload;
    },
  },
});

export const {
  setActiveQuoteId,
  setActiveQuote,
  setLastTransaction,
  clearTrade,
  setLastQuoteRequest,
} = tradesSlice.actions;

export default tradesSlice.reducer;
