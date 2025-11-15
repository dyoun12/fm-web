"use client";

import { useEditor, EditorContent, JSONContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import { PostEditorHeader } from "@/app/components/molecules/post-editor-header/post-editor-header";

export type PostEditorProps = {
  content: JSONContent | null;
  onChange: (newContent: JSONContent) => void;
};

export function PostEditor({ content, onChange }: PostEditorProps) {

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }), 
      Image,
      Placeholder.configure({
        placeholder: "내용을 입력해주세요...",
        emptyEditorClass: "is-editor-empty",
        showOnlyWhenEditable: true,
        showOnlyCurrent: false,
      }),
    ],
    content: content ?? null,
    onUpdate({ editor }) {
      const json = editor.getJSON();
      onChange?.(json);
    },
    editorProps: {
      attributes: {
        class: "tiptap"
      }
    },
    parseOptions: {
      preserveWhitespace: "full",
    },
    immediatelyRender: false,
  });

  if (!editor) return null;         // editor 초기화 전 차단

  return (
    <div className="w-full h-full overflow-auto">
      {/* 툴바 */}
      <PostEditorHeader editor={editor}/>

      {/* 에디터 본문 */}
      <div className="mt-[40px] h-full border-t-gray-300 border-t-1">
        <EditorContent editor={editor} className="h-full overflow-auto" />
      </div>
    </div>
  );
}
