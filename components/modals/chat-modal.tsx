"use client";

import { useChatContext } from "@/components/providers/chat-provider";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import Textarea from "react-textarea-autosize";

import { useEffect, useState } from "react";
import { UploadIcon } from "lucide-react";
import { Button } from "../ui/button";
import { usePathname } from "next/navigation";

const ChatModal = () => {
  const { isOpen, setIsOpen, promptRef, handleClick } = useChatContext();
  const [query, setQuery] = useState("");
  const pathname = usePathname();
  const shouldOpen = pathname.includes("preview");

  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        setQuery("");
        setIsOpen(false);
        handleClick();
      }
    };

    document.addEventListener("keydown", handleKeydown);

    return () => document.removeEventListener("keydown", handleKeydown);
  }, []);

  useEffect(() => {
    promptRef.current = {
      ...promptRef.current,
      query: query,
    };
  }, [query]);

  return (
    <Dialog open={isOpen && !shouldOpen} onOpenChange={setIsOpen}>
      <DialogContent className="rounded-sm" forceMount={true}>
        <div className="bg-neutral-100 dark:bg-neutral-900 rounded-sm flex items-center">
          <Textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            maxRows={4}
            autoFocus={false}
            placeholder="Ask any question to AI..."
            className="resize-none text-sm p-3 focus:outline-none w-[85%] bg-transparent"
          />
          <Button
            variant="secondary"
            size="sm"
            className="my-2 ml-2"
            disabled={query.length === 0}
            onClick={() => {
              setQuery("");
              setIsOpen(false);
              handleClick();
            }}
          >
            <UploadIcon className="h-4 w-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ChatModal;
