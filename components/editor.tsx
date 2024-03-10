"use client";

type EditorProps = {
  onChange: (value: string) => void;
  initialContent?: string | null;
  editable?: boolean;
};

import { BlockNoteEditor, PartialBlock } from "@blocknote/core";
import { BlockNoteView, useCreateBlockNote } from "@blocknote/react";
import { useUploadThing } from "@/lib/uploadthing";
import "@blocknote/react/style.css";
import { useTheme } from "next-themes";

const Editor = ({ initialContent, onChange, editable }: EditorProps) => {
  const { resolvedTheme } = useTheme();
  const { startUpload } = useUploadThing("imageUploader");

  const handleImageUpload = async (file: File) => {
    const files = [file];
    const response = await startUpload(files);

    return response![0].url;
  };

  const editor: BlockNoteEditor = useCreateBlockNote({
    initialContent: initialContent
      ? (JSON.parse(initialContent) as PartialBlock[])
      : undefined,
    uploadFile: handleImageUpload,
  });

  const editorContainer = document.querySelector<HTMLDivElement>(
    ".ProseMirror.bn-editor"
  )!;
  if (editorContainer) {
    editorContainer.style.backgroundColor =
      resolvedTheme === "dark" ? "#191919" : "white";
  }

  //editor.document - Retrieve a snapshot of the document (all top-level, non-nested blocks) in the editor

  return (
    <div>
      <BlockNoteView
        editor={editor}
        editable={editable}
        onChange={() => onChange(JSON.stringify(editor.document, null, 2))}
        theme={resolvedTheme === "dark" ? "dark" : "light"}
      />
    </div>
  );
};

export default Editor;
