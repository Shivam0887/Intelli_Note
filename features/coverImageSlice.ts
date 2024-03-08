import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isOpen: false,
};

export const coverImageSlice = createSlice({
  name: "coverImage",
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

export const { onClose, onOpen } = coverImageSlice.actions;
export default coverImageSlice.reducer;
