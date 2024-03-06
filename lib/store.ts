import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import modalReducer from "@/features/modelSlice";
import searchReducer from "@/features/searchSlice";
import settingsReducer from "@/features/settingsSlice";

export const store = configureStore({
  reducer: {
    model: modalReducer,
    search: searchReducer,
    settings: settingsReducer,
  },
  // devTools: true,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useAppDispatch: () => AppDispatch = useDispatch;
