import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import searchReducer from "@/features/searchSlice";
import settingsReducer from "@/features/settingsSlice";
import coverImageReducer from "@/features/coverImageSlice";

export const store = configureStore({
  reducer: {
    search: searchReducer,
    settings: settingsReducer,
    coverImage: coverImageReducer,
  },
  devTools: true,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useAppDispatch: () => AppDispatch = useDispatch;
