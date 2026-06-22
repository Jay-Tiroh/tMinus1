// store/slices/walletsSlice.ts
import {
  InternalTransferResponse,
  SimulateDepositResponse,
  Withdrawal,
  WithdrawalRequest,
} from "@/types/wallets";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type RecentContact = {
  id: string;
  name: string;
  address: string;
  initials: string;
};

type WalletsState = {
  lastDeposit: SimulateDepositResponse["data"] | null;
  withdrawalDraft: WithdrawalRequest | null;
  lastWithdrawal: Withdrawal | null;
  lastTransfer: InternalTransferResponse["data"] | null;
  recentContacts: RecentContact[];
};

const initialState: WalletsState = {
  lastDeposit: null,
  withdrawalDraft: null,
  lastWithdrawal: null,
  lastTransfer: null,
  recentContacts: [],
};

const MAX_RECENT_CONTACTS = 5;

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
    setWithdrawalDraft(state, action: PayloadAction<WithdrawalRequest>) {
      state.withdrawalDraft = action.payload;
    },
    clearWithdrawalDraft(state) {
      state.withdrawalDraft = null;
    },
    setLastWithdrawal(state, action: PayloadAction<Withdrawal>) {
      state.lastWithdrawal = action.payload;
    },
    clearLastWithdrawal(state) {
      state.lastWithdrawal = null;
    },
    setLastTransfer(
      state,
      action: PayloadAction<InternalTransferResponse["data"]>,
    ) {
      state.lastTransfer = action.payload;
    },
    clearLastTransfer(state) {
      state.lastTransfer = null;
    },
    addRecentContact(
      state,
      action: PayloadAction<{ address: string; name?: string }>,
    ) {
      const { address, name } = action.payload;
      const existing = state.recentContacts.filter(
        (c) => c.address !== address,
      );
      const displayName = name?.trim() || address;
      const initials = displayName
        .split(" ")
        .map((w) => w[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

      state.recentContacts = [
        { id: address, name: displayName, address, initials },
        ...existing,
      ].slice(0, MAX_RECENT_CONTACTS);
    },
  },
});

export const {
  setLastDeposit,
  clearLastDeposit,
  setWithdrawalDraft,
  clearWithdrawalDraft,
  setLastWithdrawal,
  clearLastWithdrawal,
  setLastTransfer,
  clearLastTransfer,
  addRecentContact,
} = walletsSlice.actions;

export default walletsSlice.reducer;
