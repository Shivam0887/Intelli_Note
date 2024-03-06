"use client";

import { useEffect, useState } from "react";
import { File, TrendingUp } from "lucide-react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useSearch } from "@/hooks/use-search";
import { trpc } from "@/trpc/client";

export const SearchCommand = () => {
  const { user } = useUser();
  const router = useRouter();

  const { data: documents } = trpc.documents.getSearch.useQuery();
  const [isMounted, setIsMounted] = useState(false);

  const { isOpen, onClose, onToggle } = useSearch();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onToggle();
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [onToggle]);

  const onSelect = (id: string) => {
    onClose();
    router.push(`/documents/${id}`);
  };

  if (!isMounted) {
    return null;
  }

  return (
    <CommandDialog open={isOpen} onOpenChange={onClose}>
      <CommandInput
        placeholder={`Search ${user?.fullName}'s Intelli-Note...`}
      />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Documents">
          {documents?.map((document) => (
            <CommandItem
              key={document._id}
              value={`${document._id}-${document.title}`}
              title={document.title}
              onSelect={() => onSelect(document._id)}
            >
              {document.icon ? (
                <p className="mr-2 text-[18px]">{document.icon}</p>
              ) : (
                <File className="mr-2 h-4 w-4" />
              )}
              <span>{document.title}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
};
