"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import ConfirmModal from "@/components/modals/confirm-modal";
import { trpc } from "@/trpc/client";

type BannerProps = {
  documentId: string;
};

const Banner = ({ documentId }: BannerProps) => {
  const router = useRouter();
  const utils = trpc.useUtils();

  const remove = trpc.documents.remove.useMutation({
    onSuccess: () => {
      utils.documents.getSidebar.invalidate();
    },
  }).mutateAsync;
  const restore = trpc.documents.restore.useMutation({
    onSuccess: () => {
      utils.documents.getSidebar.invalidate();
      utils.documents.getById.invalidate({ documentId });
    },
  }).mutateAsync;

  const onRemove = () => {
    const promise = remove({ documentId });

    toast.promise(promise, {
      loading: "Deleting note...",
      success: "Note deleted!",
      error: "Failed to delete note.",
    });

    router.push("/documents");
  };

  const onRestore = () => {
    const promise = restore({ documentId });

    toast.promise(promise, {
      loading: "Restoring note...",
      success: "Note restored!",
      error: "Failed to restore note.",
    });
  };

  return (
    <div className="w-full bg-rose-500 text-center text-sm p-2 text-white flex items-center gap-x-2 justify-center">
      <p>This page is in the Trash.</p>
      <Button
        size="sm"
        onClick={onRestore}
        variant="outline"
        className="border-white bg-transparent hover:bg-primary/5 text-white hover:text-white p-1 px-2 h-auto font-normal"
      >
        Restore page
      </Button>
      <ConfirmModal onConfirm={onRemove}>
        <Button
          size="sm"
          variant="outline"
          className="border-white bg-transparent hover:bg-primary/5 text-white hover:text-white p-1 px-2 h-auto font-normal"
        >
          Delete forever
        </Button>
      </ConfirmModal>
    </div>
  );
};

export default Banner;
