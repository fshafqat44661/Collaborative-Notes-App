"use client";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { useEffect } from "react";
import { EditorToolbar } from "./EditorToolbar";

interface Props {
  content: string;
  onChange: (content: string) => void;
  editable?: boolean;
}

export const TiptapEditor = ({ content, onChange, editable = true }: Props) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder: "Start writing your note..." }),
    ],
    immediatelyRender: false,
    content: content,
    editable: editable,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose-base dark:prose-invert focus:outline-none max-w-none p-4 min-h-[50vh]",
      },
    },
  });

  // Sync content if it changes externally (e.g. version restore or another user)
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  return (
    <div className="flex flex-col w-full h-full">
      {editable && <EditorToolbar editor={editor} />}
      <div className="flex-grow overflow-y-auto">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};
