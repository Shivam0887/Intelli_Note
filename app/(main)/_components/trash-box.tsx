"use client";

import { Spinner } from "@/components/spinner";
import { Input } from "@/components/ui/input";
import { trpc } from "@/trpc/client";
import { Search, Trash, Undo } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";
import { format } from "date-fns";
import ConfirmModal from "@/components/modals/confirm-modal";

const Trashbox = () => {
  const router = useRouter();
  const params = useParams();

  const utils = trpc.useUtils();

  const { data: documents } = trpc.documents.getTrash.useQuery();
  const { mutateAsync: restore } = trpc.documents.restore.useMutation({
    onSettled: () => {
      utils.invalidate(undefined, {
        queryKey: [["documents", "sidebar"], { type: "query" }],
      });
    },
  });

  const { mutateAsync: remove } = trpc.documents.remove.useMutation({
    onSettled: () => {
      utils.invalidate(undefined, {
        queryKey: [["documents", "getTrash"], { type: "query" }],
      });
    },
  });

  const [search, setSearch] = useState("");

  const filteredDocuments = documents?.filter((document) => {
    return document.title.toLowerCase().includes(search.toLowerCase());
  });

  const onClick = (documentId: string) => {
    router.push(`/documents/${documentId}`);
  };

  const onRestore = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    documentId: string
  ) => {
    e.stopPropagation();

    const promise = restore({ documentId });
    toast.promise(promise, {
      loading: "Restoring note...",
      success: "Note restored!",
      error: "Failed to restore note.",
    });
  };

  const onRemove = (documentId: string) => {
    const promise = remove({ documentId });
    toast.promise(promise, {
      loading: "Deleting note...",
      success: "Note deleted!",
      error: "Failed to delete note.",
    });

    if (params.documentId === documentId) {
      router.push("/documents");
    }
  };

  if (documents === undefined) {
    return (
      <div className="h-full flex items-center justify-center p-4">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="text-sm">
      <div className="flex items-center gap-x-1 p-2">
        <Search className="h-4 w-4" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-7 px-2 focus-visible:ring-transparent bg-secondary"
          placeholder="Filter by page title"
        />
      </div>

      <div className="mt-2 px-1 pb-1">
        <p className="hidden last:block text-xs text-center text-muted-foreground pb-2">
          No documents found.
        </p>
      </div>

      {filteredDocuments?.map((document) => (
        <div
          key={document._id}
          role="button"
          onClick={(e) => {
            e.stopPropagation();
            onClick(document._id);
          }}
          className="text-sm rounded-sm w-full hover:bg-primary/5 flex items-center text-primary justify-between"
        >
          <span className="truncate pl-2">
            {document.title}
            <span className="text-xs">
              {format(document.createdAt, " MM/dd/yyyy-hh:mm")}
            </span>
          </span>

          <div className="flex items-center">
            <div
              onClick={(e) => onRestore(e, document._id)}
              role="button"
              className="rounded-sm p-2 hover:bg-neutral-300 dark:hover:bg-neutral-600"
            >
              <Undo className="h-4 w-4 text-muted-foreground" />
            </div>
            <ConfirmModal onConfirm={() => onRemove(document._id)}>
              <div
                role="button"
                className="rounded-sm p-2 hover:bg-neutral-300 dark:hover:bg-neutral-600"
              >
                <Trash className="h-4 w-4 text-muted-foreground" />
              </div>
            </ConfirmModal>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Trashbox;
