import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { generateHTML } from "@tiptap/html";
import { generateJSON, JSONContent } from "@tiptap/react";

export const COMMON_EXTENSIONS = [
  StarterKit.configure({
    heading: {
      levels: [1, 2, 3],
    },
  }),
  Link.configure({
    autolink: true,
    linkOnPaste: true,
    openOnClick: false,
  }),
  Image,
  Placeholder.configure({
    placeholder: "내용을 입력해주세요...",
    emptyEditorClass: "is-editor-empty",
    showOnlyWhenEditable: true,
    showOnlyCurrent: false,
  })
]

export const EMPTY_DOC: JSONContent = {
  type: "doc",
  content: [
    {
      type: "paragraph",
      content: [],
    },
  ],
};

export function generateHtml(json: JSONContent) {
  return generateHTML(json, COMMON_EXTENSIONS);
}

export function generateJson(str: string) {
  return generateJSON(str, COMMON_EXTENSIONS);
}
