"use client";

import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useChatContext } from "./providers/chat-provider";
import Image from "next/image";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { ChevronRight, Undo2 } from "lucide-react";
import { useState } from "react";
import { useBlockNoteEditor } from "@blocknote/react";

const langs = [
  "English",
  "Hindi",
  "French",
  "Chinese",
  "Korean",
  "Japanese",
  "Russian",
  "German",
];

const AiDropdown = () => {
  const { handleClick, promptRef, textCursorPositionRef } = useChatContext();
  const [isOpen, setIsOpen] = useState(false);
  const editor = useBlockNoteEditor();

  const handlePrompt = (type: string, lang: string = "English") => {
    promptRef.current = { ...promptRef.current, type, lang };
    setIsOpen(false);
    const block = editor.getSelection()?.blocks.pop();
    if (block) {
      textCursorPositionRef.current = block;
      handleClick();
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button size="sm" variant="ghost" className="space-x-2">
          <Image
            src="/icons/sparcles.svg"
            alt="ask AI"
            width={20}
            height={20}
          />
          <p className="text-purple-400">Ask AI</p>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="bg-neutral-50 dark:bg-neutral-900 rounded p-1 space-y-1 max-w-[250px]"
        align="start"
        sideOffset={6}
        forceMount
      >
        <div
          onClick={() => handlePrompt("summarize")}
          role="button"
          className="flex justify-between items-center p-2 group hover:bg-neutral-200 dark:hover:bg-neutral-800 rounded-sm"
        >
          <div className="flex gap-2 items-center">
            <Image
              src="/icons/summarize.svg"
              alt="summarize"
              width={20}
              height={20}
            />
            <button type="button" className="text-xs">
              Summarize
            </button>
          </div>
          <Undo2 className="w-4 h-4 opacity-0 group-hover:opacity-100 transition" />
        </div>
        <div className="w-full">
          <DropdownMenu>
            <DropdownMenuTrigger asChild className="w-full cursor-pointer">
              <div className="w-full flex justify-between group items-center p-2 hover:bg-neutral-200 dark:hover:bg-neutral-800 rounded-sm">
                <div className="flex gap-2 items-center">
                  <Image
                    src="/icons/languages.svg"
                    alt="translate"
                    width={20}
                    height={20}
                  />
                  <button type="button" className="text-xs">
                    Translate
                  </button>
                </div>
                <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              side="right"
              className="bg-neutral-50 dark:bg-neutral-900"
            >
              {langs.map((lang) => (
                <DropdownMenuItem
                  key={lang}
                  onClick={() => handlePrompt("translate", lang)}
                  className="flex items-center group justify-between p-2"
                >
                  <p className="text-xs">{lang}</p>
                  <Undo2 className="w-4 h-4 opacity-0 group-hover:opacity-100 transition" />
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div
          onClick={() => handlePrompt("explain")}
          role="button"
          className="flex justify-between items-center p-2 group hover:bg-neutral-200 dark:hover:bg-neutral-800 rounded-sm"
        >
          <div className="flex gap-2 items-center">
            <Image
              src="/icons/explain.svg"
              alt="explain"
              width={20}
              height={20}
            />
            <button type="button" className="text-xs">
              Explain this
            </button>
          </div>
          <Undo2 className="w-4 h-4 opacity-0 group-hover:opacity-100 transition" />
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default AiDropdown;
