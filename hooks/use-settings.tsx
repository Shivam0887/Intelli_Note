"use client";

import { onOpen, onClose } from "@/features/settingsSlice";
import { useAppDispatch, useAppSelector } from "@/lib/store";

export const useSettings = () => {
  const dispatch = useAppDispatch();
  const { isOpen } = useAppSelector((state) => state.settings);

  return {
    isOpen,
    onOpen: () => dispatch(onOpen()),
    onClose: () => dispatch(onClose()),
  };
};
