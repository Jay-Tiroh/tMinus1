import { createSlice } from "@reduxjs/toolkit";

type MenuState = {
  isOpen: boolean;
};

const initialState: MenuState = {
  isOpen: false,
};

const menuSlice = createSlice({
  name: "menu",
  initialState,
  reducers: {
    setMenuOpen(state) {
      state.isOpen = true;
    },
    setMenuClose(state) {
      state.isOpen = false;
    },
    toggleMenu(state) {
      state.isOpen = !state.isOpen;
    },
  },
});

export const { setMenuOpen, setMenuClose, toggleMenu } = menuSlice.actions;
export default menuSlice.reducer;

// Selectors
export const selectIsMenuOpen = (state: { menu: MenuState }) =>
  state.menu.isOpen;
