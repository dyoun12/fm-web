"use client";

import { useEditor, EditorContent, JSONContent } from "@tiptap/react";
import { PostEditorHeader } from "@/app/components/molecules/post-editor-header/post-editor-header";
import { COMMON_EXTENSIONS } from "@/lib/tiptap";

export type PostEditorProps = {
  content: JSONContent | null;
  onChange: (newContent: JSONContent) => void;
};

export function PostEditor({ content, onChange }: PostEditorProps) {

  const editor = useEditor({
    extensions: COMMON_EXTENSIONS,
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
