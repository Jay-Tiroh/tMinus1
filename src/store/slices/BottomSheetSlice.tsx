// store/slices/bottomSheetSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type BottomSheetState = {
  isOpen: boolean;
  contentId: string | null;
};

const initialState: BottomSheetState = {
  isOpen: false,
  contentId: null,
};

const bottomSheetSlice = createSlice({
  name: "bottomSheet",
  initialState,
  reducers: {
    // slice stores a string
    openSheet: (state, action: PayloadAction<string>) => {
      state.isOpen = true;
      state.contentId = action.payload;
    },
    closeSheet: (state) => {
      state.isOpen = false;
      state.contentId = null;
    },
  },
});

export const { openSheet, closeSheet } = bottomSheetSlice.actions;
export default bottomSheetSlice.reducer;
