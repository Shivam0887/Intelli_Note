"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { trpc } from "@/trpc/client";
import { useUser } from "@clerk/nextjs";
import {
  ChevronDown,
  ChevronRight,
  LucideIcon,
  MoreHorizontal,
  Plus,
  Trash,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type ItemsProps = {
  id?: string;
  documentIcon?: string | null;
  active?: boolean;
  expanded?: boolean;
  isSearch?: boolean;
  level?: number;
  onExpand?: () => void;
  onClick?: () => void;
  label: string;
  icon: LucideIcon;
};

const Item = ({
  icon: Icon,
  label,
  onClick,
  active,
  documentIcon,
  expanded,
  id,
  isSearch,
  level = 0,
  onExpand,
}: ItemsProps) => {
  const { user } = useUser();
  const utils = trpc.useUtils();
  const router = useRouter();

  const ChevronIcon = expanded ? ChevronDown : ChevronRight;

  const { mutateAsync: createDocument } = trpc.documents.create.useMutation({
    onSettled: (data) => {
      utils.invalidate(undefined, {
        queryKey: [["documents", "getSidebar"], { type: "query" }],
      });

      if (!expanded) {
        onExpand?.();
      }

      router.push(`/documents/${data?._id.toString()}`);
    },
  });

  const { mutateAsync: archiveDocument } = trpc.documents.archieve.useMutation({
    onSettled: () => {
      utils.invalidate(undefined, {
        queryKey: [["documents", "getSidebar"], { type: "query" }],
      });

      if (!expanded) {
        onExpand?.();
      }
    },
  });

  const onArchive = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
    if (!id) return;

    const promise = archiveDocument({ documentId: id });
    toast.promise(promise, {
      loading: "Moving to trash...",
      success: "Note moved to trash!",
      error: "Failed to archieve note.",
    });
  };

  const handleExpand = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
    onExpand?.();
  };

  const onCreate = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
    if (!id) return;
    const promise = createDocument({ title: "Untitled", parentDocument: id });
    toast.promise(promise, {
      loading: "Creating a new note...",
      success: "New note created!",
      error: "Failed to create a new note.",
    });
  };

  return (
    <div
      onClick={onClick}
      role="button"
      style={{ paddingLeft: level ? `${level * 12 + 12}px` : "12px" }}
      className={cn(
        "group min-h-7 text-sm py-1 pr-3 w-full hover:bg-primary/5 flex items-center text-muted-foreground font-medium",
        active && "bg-primary/5 text-primary"
      )}
    >
      {!!id && (
        <div
          role="button"
          className="rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600 mx-1"
          onClick={handleExpand}
        >
          <ChevronIcon className="h-4 w-4 shrink-0 text-muted-foreground/50" />
        </div>
      )}

      {documentIcon ? (
        <div className="shrink-0 mr-2 text-lg">{documentIcon}</div>
      ) : (
        <Icon className="shrink-0 h-4 mr-2 text-muted-foreground" />
      )}

      <span className="truncate">{label}</span>

      {isSearch && (
        <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
          <span className="text-xs">ctrl</span> K
        </kbd>
      )}

      {!!id && (
        <div className="ml-auto flex items-center gap-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <div
                role="button"
                className="opacity-0 group-hover:opacity-100 h-full ml-auto rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600"
              >
                <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-60 dark:bg-neutral-900"
              align="start"
              side="right"
              forceMount
            >
              <DropdownMenuItem onClick={onArchive}>
                <Trash className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <div className="text-xs text-muted-foreground p-2">
                Last edited by: {user?.fullName}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
          <div
            role="button"
            onClick={onCreate}
            className="opacity-0 group-hover:opacity-100 p-1 h-full ml-auto rounded-sm hover:bg-neutral-300 dark:bg-neutral-600"
          >
            <Plus className="h-3 w-3 text-muted-foreground stroke-2" />
          </div>
        </div>
      )}
    </div>
  );
};

Item.Skeleton = function ItemSkeleton({ level }: { level?: number }) {
  return (
    <div
      style={{ paddingLeft: level ? `${level * 12 + 25}px` : "12px" }}
      className="flex gap-x-2 py-[3px]"
    >
      <Skeleton className="h-3 w-4" />
      <Skeleton className="h-3 w-[50%]" />
    </div>
  );
};

export default Item;
