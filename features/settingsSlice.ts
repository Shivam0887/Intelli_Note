import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isOpen: false,
};

export const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    onOpen: (state) => {
      state.isOpen = true;
    },
    onClose: (state) => {
      state.isOpen = false;
    },
  },
});

export const { onClose, onOpen } = settingsSlice.actions;
export default settingsSlice.reducer;
