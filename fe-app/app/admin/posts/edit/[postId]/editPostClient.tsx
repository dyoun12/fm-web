"use client"

import { PostEditor } from "@/app/components/molecules/post-editor/post-editor";
import { useDispatch, useSelector } from "react-redux";
import { setContent } from "@/store/editing-post-slice";
import { RootState } from "@/store";
import type { JSONContent } from "@tiptap/react";

export function EditPostClient() {
  const dispatch = useDispatch();
  const { content } = useSelector((state: RootState) => state.editingPost);

  function handleEditorUpdate(newContent: JSONContent) {
    dispatch(setContent(newContent));
  }

  return <PostEditor
    content={content}
    onChange={handleEditorUpdate}
  />;
}
