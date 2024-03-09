"use client";

import { ModifiedDocType } from "@/types";
import IconPicker from "./icon-picker";
import { Button } from "./ui/button";
import { ImageIcon, Smile, X } from "lucide-react";
import { ElementRef, useRef, useState } from "react";
import useDocUpdate from "@/hooks/use-docUpdate";
import useThrottle from "@/hooks/use-throttle";
import TextareaAutosize from "react-textarea-autosize";
import { UploadCoverImage } from "./upload-cover-image";
import { Skeleton } from "./ui/skeleton";

type ToolbarProps = {
  initialData: ModifiedDocType;
  preview?: boolean;
  setProgress: (progress: number) => void;
};

const Toolbar = ({ initialData, preview, setProgress }: ToolbarProps) => {
  const inputRef = useRef<ElementRef<"textarea">>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(initialData.title);

  const update = useDocUpdate(initialData._id).updateDocument();

  const throttleTitle = useThrottle(update, 300);

  const enableInput = () => {
    if (preview) return;

    setIsEditing(true);
    setTimeout(() => {
      setTitle(initialData.title);
      inputRef.current?.focus();
    }, 0);
  };

  const disableInput = () => {
    setIsEditing(false);
  };

  const onInput = (value: string) => {
    setTitle(value);
    throttleTitle({ _id: initialData._id, title: value || "Untitled" });
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      disableInput();
    }
  };

  const onIconSelect = (icon: string) => {
    update({ _id: initialData._id, icon });
  };

  return (
    <div className="pl-[54px] group relative">
      {!!initialData.icon && !preview && (
        <div className="flex items-center gap-x-2 group/icon pt-6">
          <IconPicker onChange={onIconSelect} asChild>
            <p className="text-6xl hover:opacity-75 transition">
              {initialData.icon}
            </p>
          </IconPicker>
          <Button
            onClick={() => update({ _id: initialData._id, icon: null })}
            className="rounded-full opacity-0 group-hover/icon:opacity-100 transition text-muted-foreground text-xs"
            variant="outline"
            size="icon"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
      {!!initialData.icon && preview && (
        <p className="text-6xl pt-0">{initialData.icon}</p>
      )}

      <div className="opacity-0 group-hover:opacity-100 flex items-center gap-x-1 py-4">
        {!initialData.icon && !preview && (
          <IconPicker onChange={onIconSelect} asChild>
            <Button
              className="text-muted-foreground text-xs"
              variant="outline"
              size="sm"
            >
              <Smile className="h-4 w-4 mr-2" />
              Add icon
            </Button>
          </IconPicker>
        )}

        {!initialData.coverImage && !preview && (
          <UploadCoverImage setProgress={setProgress}>
            <Button
              className="text-muted-foreground text-xs"
              variant="outline"
              size="sm"
            >
              <ImageIcon className="h-4 w-4 mr-2" />
              Add cover
            </Button>
          </UploadCoverImage>
        )}
      </div>

      {isEditing && !preview ? (
        <TextareaAutosize
          ref={inputRef}
          onBlur={disableInput}
          onKeyDown={onKeyDown}
          value={title}
          onChange={(e) => onInput(e.target.value)}
          className="text-5xl bg-transparent font-bold break-words outline-none text-[#3f3f3f] dark:text-[#cfcfcf] resize-none"
        />
      ) : (
        <div
          onClick={enableInput}
          className="pb-[11.5px] text-5xl font-bold break-words outline-none text-[#3f3f3f] dark:text-[#cfcfcf]"
        >
          {initialData.title}
        </div>
      )}
    </div>
  );
};

Toolbar.Skeleton = function ToolbarSkeleton() {
  return (
    <div className="w-full mt-[48px]">
      <Skeleton className="w-full h-56" />
      <div className="pl-10 mt-5 md:max-w-3xl lg:max-w-4xl mx-auto flex flex-col justify-center gap-4">
        <Skeleton className="h-14 w-14 rounded-lg" />
        <div className="space-y-4">
          <Skeleton className="w-28 h-6" />
          <Skeleton className="w-14 h-4" />
        </div>
      </div>
    </div>
  );
};

export default Toolbar;
