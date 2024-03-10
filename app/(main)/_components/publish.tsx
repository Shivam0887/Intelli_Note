"use client";

import { ModifiedDocType } from "@/types";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import useOrigin from "@/hooks/use-origin";
import { trpc } from "@/trpc/client";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Check, Copy, Globe } from "lucide-react";

type PublishProps = {
  initialData: ModifiedDocType;
};

const Publish = ({ initialData }: PublishProps) => {
  const utils = trpc.useUtils();

  const [isCopied, setIsCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const origin = useOrigin();
  const update = trpc.documents.update.useMutation({
    onSettled: () => {
      setIsSubmitting(false);
      utils.documents.getById.invalidate({ documentId: initialData._id });
    },
  }).mutateAsync;

  const url = `${origin}/preview/${initialData._id}`;

  const onPublish = () => {
    setIsSubmitting(true);

    const promise = update({ _id: initialData._id, isPublished: true });
    toast.promise(promise, {
      loading: "Publishing...",
      success: "Note published.",
      error: "Failed to publish note.",
    });
  };

  const onUnpublish = () => {
    setIsSubmitting(true);

    const promise = update({ _id: initialData._id, isPublished: false });
    toast.promise(promise, {
      loading: "Unpublishing...",
      success: "Note unpublished.",
      error: "Failed to unpublish note.",
    });
  };

  const onCopy = () => {
    navigator.clipboard.writeText(url);
    setIsCopied(true);

    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button size="sm" variant="ghost">
          Publish
          {initialData.isPublished && (
            <Globe className="text-sky-500 w-4 h-4 ml-2 " />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72" align="end" alignOffset={8} forceMount>
        {initialData.isPublished ? (
          <div className="space-y-4">
            <div className="flex items-center gap-x-2">
              <Globe className="text-sky-500 animate-pulse h-4 w-4" />
              <p className="text-xs font-medium text-sky-500">
                This note is live on web.
              </p>
            </div>
            <div className="flex items-center">
              <input
                type="text"
                value={url}
                className="flex-1 px-2 text-xs border rounded-l-md h-8 bg-muted truncate"
                disabled
              />
              <Button
                onClick={onCopy}
                className="h-8 rounded-l-none"
                disabled={isCopied}
              >
                {isCopied ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
            <Button
              disabled={isSubmitting}
              onClick={onUnpublish}
              className="w-full text-xs"
              size="sm"
            >
              Unpublish
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center">
            <Globe className="text-muted-foreground w-8 h-8 mb-2 " />
            <p className="text-sm font-medium mb-2">Publish this note</p>
            <span className="text-xs text-muted-foreground mb-4">
              Share your work with others.
            </span>
            <Button
              disabled={isSubmitting}
              onClick={onPublish}
              className="w-full text-xs"
              size="sm"
            >
              Publish
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default Publish;
