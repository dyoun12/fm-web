import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import { generateHTML } from "@tiptap/html";
import { JSONContent } from "@tiptap/react";

export const COMMON_EXTENSIONS = [
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
  })
]

export function renderHtmlFromJson(json: JSONContent) {
  return generateHTML(json, COMMON_EXTENSIONS);
}