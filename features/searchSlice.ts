import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isOpen: false,
};

export const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    onOpen: (state) => {
      state.isOpen = true;
    },
    onClose: (state) => {
      state.isOpen = false;
    },
    onToggle: (state) => {
      state.isOpen = !state.isOpen;
    },
  },
});

export const { onClose, onOpen, onToggle } = searchSlice.actions;
export default searchSlice.reducer;
