"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import useDocUpdate from "@/hooks/use-docUpdate";
import useThrottle from "@/hooks/use-throttle";
import type { ModifiedDocType } from "@/types";
import { useRef, useState } from "react";

type TitleProps = {
  initialData: ModifiedDocType;
};

const Title = ({ initialData }: TitleProps) => {
  const { updateDocument } = useDocUpdate(initialData?._id);

  const inputRef = useRef<HTMLInputElement>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(initialData?.title || "Untitled");

  const throttledTitle = useThrottle(updateDocument(), 300);

  const enableInput = () => {
    setIsEditing(true);
    setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.setSelectionRange(0, inputRef.current.value.length);
    }, 0);
  };

  const disableInput = () => {
    setIsEditing(false);
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    throttledTitle({ _id: initialData._id, title: e.target.value });
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      disableInput();
    }
  };

  return (
    <div className="flex items-center gap-x-1">
      {!!initialData.icon && <p>{initialData.icon}</p>}
      {isEditing ? (
        <Input
          className="h-7 px-2 focus-visible:ring-transparent"
          ref={inputRef}
          onChange={onChange}
          onBlur={disableInput}
          onClick={enableInput}
          onKeyDown={onKeyDown}
          value={title}
        />
      ) : (
        <Button
          className="font-normal h-auto p-1"
          variant="ghost"
          size="sm"
          onClick={enableInput}
        >
          <span className="truncate">{initialData?.title}</span>
        </Button>
      )}
    </div>
  );
};

Title.Skeleton = function TitleSkeleton() {
  return <Skeleton className="h-9 w-20 rounded-md" />;
};

export default Title;
