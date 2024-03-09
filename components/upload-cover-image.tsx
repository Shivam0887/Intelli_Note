"use client";

import { useDropzone } from "@uploadthing/react/hooks";
import { generateClientDropzoneAccept } from "uploadthing/client";

import { useUploadThing } from "@/lib/uploadthing";
import { toast } from "sonner";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { useMediaQuery } from "usehooks-ts";
import { useState } from "react";
import { trpc } from "@/trpc/client";

type FileUploaderProps = {
  setProgress: (p: number) => void;
  children: React.ReactNode;
  documentId?: string;
};

export function UploadCoverImage({
  setProgress,
  children,
  documentId,
}: FileUploaderProps) {
  const isTablet = useMediaQuery("(max-width: 1024px)");
  const [isOpen, setIsOpen] = useState(false);
  const utils = trpc.useUtils();
  const remove = trpc.documents.update.useMutation({
    onSuccess: () => {
      utils.documents.getById.invalidate({ documentId: documentId! });
    },
  }).mutateAsync;

  const { startUpload, permittedFileInfo } = useUploadThing(
    "coverImageUploader",
    {
      onClientUploadComplete: (res) => {
        const data = res[0].serverData;
        if (data.documentId) {
          utils.documents.getById.invalidate({ documentId: data.documentId });
        }
      },
      onUploadError: (error) => {
        toast.error(error.message);
      },
      onUploadProgress: (progress) => {
        setProgress(progress);
      },
    }
  );

  const onDrop = async (acceptedFiles: File[]) => {
    if (acceptedFiles.length) {
      setIsOpen(false);
      await startUpload(acceptedFiles);
    }
  };

  const fileTypes = permittedFileInfo?.config
    ? Object.keys(permittedFileInfo?.config)
    : [];

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: fileTypes ? generateClientDropzoneAccept(fileTypes) : undefined,
    multiple: false,
  });

  const removeCoverImage = () => {
    const promise = remove({ _id: documentId!, coverImage: null });
    toast.promise(promise, {
      loading: "Removing cover image...",
      success: "Cover image removed.",
      error: "Failed to remove cover image!",
    });
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent
        side={isTablet ? "bottom" : "right"}
        sideOffset={10}
        align={isTablet ? "start" : "center"}
        className="dark:bg-neutral-800 bg-neutral-50 sm:w-[560px] rounded-sm p-0 pb-2 shadow"
      >
        <div className="p-3 flex justify-between items-center border-b border-neutral-300 dark:border-neutral-700">
          <p className="text-foreground text-xs sm:text-sm">Upload</p>
          <button
            aria-label="remove cover image"
            onClick={removeCoverImage}
            type="button"
            className="text-muted-foreground text-xs sm:text-sm"
          >
            Remove
          </button>
        </div>
        <div
          {...getRootProps()}
          className="mx-2 mt-3 border border-neutral-300 dark:border-neutral-700 cursor-pointer flex flex-col items-center justify-center rounded-sm"
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center p-2 ">
            <p className="text-foreground font-normal text-xs sm:text-sm">
              Click to upload or drag & drop
            </p>
          </div>
        </div>
        <div className="flex flex-col items-center gap-y-3 mt-3">
          <p className="text-[10px] sm:text-xs text-muted-foreground/75">
            Images wider than 1500 pixels work best.
          </p>
          <p className="text-muted-foreground text-[10px] sm:text-xs">
            The maximum size per file is 4MB.
          </p>
        </div>
      </PopoverContent>
    </Popover>
  );
}
