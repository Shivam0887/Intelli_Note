"use client";

import { trpc } from "@/trpc/client";
import { useCallback } from "react";

const useDocUpdate = (documentId: string) => {
  const updateDocument = useCallback(() => {
    const utils = trpc.useUtils();
    const { mutate } = trpc.documents.update.useMutation({
      onSuccess: () => {
        utils.documents.getSidebar.invalidate();
        utils.documents.getById.invalidate({ documentId });
      },
    });

    return mutate;
  }, [documentId]);

  return { updateDocument };
};

export default useDocUpdate;
