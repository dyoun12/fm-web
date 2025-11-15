import { type Editor } from "@tiptap/react";
import { RiBold, RiItalic, RiH1, RiH3, RiH2 } from "@remixicon/react";

export type ToolbarAction = {
  name: string;
  label: string;
  icon?: React.ReactNode;   // 아이콘도 지원
  command: (editor: Editor) => void;
  isActive?: (editor: Editor) => boolean;

  // heading인 경우 level을 명시할 수 있도록
  level?: 1 | 2 | 3 | 4 | 5 | 6;
};
export const TOOLBAR_ACTIONS: ToolbarAction[] = [
  {
    name: "bold",
    label: "Bold",
    icon: <RiBold />,
    command: (editor) => editor.chain().focus().toggleBold().run(),
    isActive: (editor) => editor.isActive("bold"),
  },
  {
    name: "italic",
    label: "Italic",
    icon: <RiItalic />,
    command: (editor) => editor.chain().focus().toggleItalic().run(),
    isActive: (editor) => editor.isActive("italic"),
  },
  {
    name: "h1",
    label: "H1",
    level: 1,
    icon: <RiH1 />,
    command: (editor) => editor.chain().focus().toggleHeading({ level: 1 }).run(),
    isActive: (editor) => editor.isActive("heading", { level: 1 }),
  },
  {
    name: "h2",
    label: "H2",
    level: 2,
    icon: <RiH2 />,
    command: (editor) => editor.chain().focus().toggleHeading({ level: 2 }).run(),
    isActive: (editor) => editor.isActive("heading", { level: 2 }),
  },
  {
    name: "h3",
    label: "H3",
    level: 3,
    icon: <RiH3 />,
    command: (editor) => editor.chain().focus().toggleHeading({ level: 3 }).run(),
    isActive: (editor) => editor.isActive("heading", { level: 3 }),
  },
];

export function PostEditorHeader({ editor }: { editor: Editor}) {
  if (!editor) return;

  return (
      <div className="fixed bg-white z-31 h-[40px] ">
        <div className="flex gap-2">
          {TOOLBAR_ACTIONS.map((action) => (
            <button
              key={action.name}
              onClick={() => action.command(editor)}
              className={[
                "p-1 rounded hover:bg-gray-100 transition",
                action.isActive?.(editor) ? "bg-gray-200 text-black" : "text-gray-600",
              ].join(" ")}
              title={action.label ?? action.name}
              type="button"
            >
              {action.icon ?? action.label}
            </button>
          ))}
          
        </div>
        
      </div>
  );
}