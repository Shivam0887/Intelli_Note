"use client";

import { onOpen, onClose, onToggle } from "@/features/searchSlice";
import { useAppDispatch, useAppSelector } from "@/lib/store";

export const useSearch = () => {
  const dispatch = useAppDispatch();
  const { isOpen } = useAppSelector((state) => state.search);

  return {
    isOpen,
    onOpen: () => dispatch(onOpen()),
    onClose: () => dispatch(onClose()),
    onToggle: () => dispatch(onToggle()),
  };
};
