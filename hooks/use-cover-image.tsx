"use client";

import { onOpen, onClose } from "@/features/coverImageSlice";
import { useAppDispatch, useAppSelector } from "@/lib/store";

export const useCoverImage = () => {
  const dispatch = useAppDispatch();
  const { isOpen } = useAppSelector((state) => state.coverImage);

  return {
    isOpen,
    onOpen: () => dispatch(onOpen()),
    onClose: () => dispatch(onClose()),
  };
};
