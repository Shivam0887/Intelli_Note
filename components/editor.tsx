"use client";

type EditorProps = {
  onChange: (value: string) => void;
  initialContent?: string | null;
  editable?: boolean;
};

import { PartialBlock } from "@blocknote/core";
import { BlockNoteView } from "@blocknote/react";
import { useUploadThing } from "@/lib/uploadthing";
import "@blocknote/react/style.css";
import { useTheme } from "next-themes";
import { useEffect } from "react";
import { useChatContext } from "./providers/chat-provider";
import useEditor from "@/hooks/use-editor";
import CustomFormattingToolbar from "./custom-formatting-toolbar";

const Editor = ({ initialContent, onChange, editable }: EditorProps) => {
  const { resolvedTheme } = useTheme();
  const { startUpload } = useUploadThing("imageUploader");

  const { setIsOpen, textCursorPositionRef, data, promptRef } =
    useChatContext();

  const handleImageUpload = async (file: File) => {
    const files = [file];
    const response = await startUpload(files);

    return response![0].url;
  };

  const editor = useEditor({ initialContent, handleImageUpload });

  const editorContainer = document.querySelector<HTMLDivElement>(
    ".ProseMirror.bn-editor"
  )!;
  if (editorContainer) {
    editorContainer.style.backgroundColor =
      resolvedTheme === "dark" ? "#191919" : "white";
  }

  useEffect(() => {
    const handleTextCursor = (e: KeyboardEvent) => {
      if (e.key === "/" && e.ctrlKey) {
        textCursorPositionRef.current = editor.getTextCursorPosition().block;
        setIsOpen(true);
      }
    };
    document.addEventListener("keydown", handleTextCursor, false);

    return () =>
      document.removeEventListener("keydown", handleTextCursor, false);
  }, [editor]);

  useEffect(() => {
    async function handleData(data: string | undefined) {
      if (textCursorPositionRef.current && data) {
        const response = (await editor.tryParseHTMLToBlocks(
          data
        )) as PartialBlock[];
        editor.insertBlocks(response, textCursorPositionRef.current, "after");
        textCursorPositionRef.current = null;
        promptRef.current = { query: "", type: "explain", lang: "English" };
      }
    }
    handleData(data);
  }, [data, editor]);

  return (
    <div className="mb-6">
      <BlockNoteView
        editor={editor}
        editable={editable}
        onSelectionChange={() =>
          (promptRef.current = {
            ...promptRef.current,
            query: editor.getSelectedText(),
          })
        }
        onChange={() => onChange(JSON.stringify(editor.document, null, 2))}
        theme={resolvedTheme === "dark" ? "dark" : "light"}
        formattingToolbar={false}
      >
        <CustomFormattingToolbar />
      </BlockNoteView>
    </div>
  );
};

export default Editor;
