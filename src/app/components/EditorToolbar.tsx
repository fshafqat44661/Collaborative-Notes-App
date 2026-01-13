import { Editor } from "@tiptap/react";
import { Button, Tooltip, Divider } from "@nextui-org/react";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Heading1,
  Heading2,
  Strikethrough,
  Undo,
  Redo,
  Code2,
} from "lucide-react";
import classNames from "classnames";

export const EditorToolbar = ({ editor }: { editor: Editor | null }) => {
  if (!editor) return null;

  const buttons = [
    {
      label: "Undo",
      icon: <Undo size={18} />,
      onClick: () => editor.chain().focus().undo().run(),
      isDisabled: !editor.can().undo(),
    },
    {
      label: "Redo",
      icon: <Redo size={18} />,
      onClick: () => editor.chain().focus().redo().run(),
      isDisabled: !editor.can().redo(),
    },
    { type: "divider" },
    {
      label: "Bold",
      icon: <Bold size={18} />,
      isActive: editor.isActive("bold"),
      onClick: () => editor.chain().focus().toggleBold().run(),
    },
    {
      label: "Italic",
      icon: <Italic size={18} />,
      isActive: editor.isActive("italic"),
      onClick: () => editor.chain().focus().toggleItalic().run(),
    },
    {
      label: "Strikethrough",
      icon: <Strikethrough size={18} />,
      isActive: editor.isActive("strike"),
      onClick: () => editor.chain().focus().toggleStrike().run(),
    },
    { type: "divider" },
    {
      label: "Heading 1",
      icon: <Heading1 size={18} />,
      isActive: editor.isActive("heading", { level: 1 }),
      onClick: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
    },
    {
      label: "Heading 2",
      icon: <Heading2 size={18} />,
      isActive: editor.isActive("heading", { level: 2 }),
      onClick: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
    },
    { type: "divider" },
    {
      label: "Bullet List",
      icon: <List size={18} />,
      isActive: editor.isActive("bulletList"),
      onClick: () => editor.chain().focus().toggleBulletList().run(),
    },
    {
      label: "Ordered List",
      icon: <ListOrdered size={18} />,
      isActive: editor.isActive("orderedList"),
      onClick: () => editor.chain().focus().toggleOrderedList().run(),
    },
    { type: "divider" },
    {
      label: "Blockquote",
      icon: <Quote size={18} />,
      isActive: editor.isActive("blockquote"),
      onClick: () => editor.chain().focus().toggleBlockquote().run(),
    },
    {
      label: "Code Block",
      icon: <Code2 size={18} />,
      isActive: editor.isActive("codeBlock"),
      onClick: () => editor.chain().focus().toggleCodeBlock().run(),
    },
  ];

  return (
    <div className="border-b border-default-200 p-2 flex gap-1 items-center overflow-x-auto sticky top-0 bg-background/60 backdrop-blur-xl z-20 scrollbar-hide">
      {buttons.map((btn, i) => {
        if (btn.type === "divider") {
          return (
            <Divider
              key={i}
              orientation="vertical"
              className="h-6 mx-1 bg-default-200"
            />
          );
        }
        return (
          <Tooltip key={i} content={btn.label} delay={500} closeDelay={0}>
            <Button
              isIconOnly
              size="sm"
              variant={btn.isActive ? "solid" : "light"}
              color={btn.isActive ? "primary" : "default"}
              onClick={btn.onClick}
              isDisabled={btn.isDisabled}
              className={classNames(
                "transition-all",
                btn.isActive ? "shadow-sm scale-110" : "hover:bg-default-100"
              )}
            >
              {btn.icon}
            </Button>
          </Tooltip>
        );
      })}
    </div>
  );
};
