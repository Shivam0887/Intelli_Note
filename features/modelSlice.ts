import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type ModelType = "";

type ModelStore = {
  type: ModelType | null;
  data?: any;
  isOpen?: boolean;
};

const initialState: ModelStore = {
  type: null,
  data: {},
  isOpen: false,
};

export const modalSlice = createSlice({
  name: "model",
  initialState,
  reducers: {
    onOpen: (state, action: PayloadAction<ModelStore>) => {
      state.type = action.payload.type;
      state.data = action.payload.data;
      state.isOpen = true;
    },
    onClose: (state) => {
      state.type = null;
      state.isOpen = false;
    },
  },
});

export const { onOpen, onClose } = modalSlice.actions;
export default modalSlice.reducer;
