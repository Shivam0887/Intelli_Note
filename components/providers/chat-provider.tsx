"use client";

import { Block } from "@blocknote/core";
import { useMutation } from "@tanstack/react-query";
import {
  useRef,
  MutableRefObject,
  useState,
  useContext,
  createContext,
  ReactNode,
} from "react";
import { toast } from "sonner";

type PromptProps = {
  query: string;
  type: string;
  lang: string;
};

type ChatContextProps = {
  isOpen: boolean;
  promptRef: MutableRefObject<PromptProps>;
  data: string | undefined;
  textCursorPositionRef: MutableRefObject<Block | null>;
  handleClick: () => void;
  setIsOpen: (val: boolean) => void;
};

const ChatContext = createContext<ChatContextProps>({
  isOpen: false,
  promptRef: {
    current: { lang: "English", query: "", type: "explain" },
  },
  data: undefined,
  textCursorPositionRef: {
    current: null,
  },
  setIsOpen: () => {},
  handleClick: () => {},
});

export const useChatContext = () => useContext(ChatContext);

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const promptRef = useRef<PromptProps>({
    lang: "English",
    query: "",
    type: "explain",
  });
  const textCursorPositionRef = useRef<Block | null>(null);

  const { mutate, data } = useMutation({
    mutationKey: ["sendPrompt"],
    mutationFn: async (prompt: PromptProps) => {
      const resp = await fetch("/api/message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(prompt),
      });

      if (!resp.ok) {
        throw new Error("failed to send message");
      }

      return await resp.text();
    },
    onError: (error) => {
      toast.error(error.message);
    },
    onSettled: () => {
      setIsOpen(false);
    },
  });

  const handleClick = () => {
    mutate(promptRef.current);
  };

  return (
    <ChatContext.Provider
      value={{
        isOpen,
        promptRef,
        setIsOpen,
        handleClick,
        textCursorPositionRef,
        data,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export default ChatProvider;
