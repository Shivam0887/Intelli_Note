"use client";

import { BlockNoteEditor, PartialBlock } from "@blocknote/core";
import { useCreateBlockNote } from "@blocknote/react";

type useEditorProps = {
  initialContent?: string | null;
  handleImageUpload?: (file: File) => Promise<string>;
};

const useEditor = ({ initialContent, handleImageUpload }: useEditorProps) => {
  const editor: BlockNoteEditor = useCreateBlockNote({
    initialContent: initialContent
      ? (JSON.parse(initialContent) as PartialBlock[])
      : undefined,
    uploadFile: handleImageUpload,
    placeholders: {
      paragraph: "Enter text, press 'ctrl+/' for AI, or press / for commands",
    },
  });

  return editor;
};

export default useEditor;
