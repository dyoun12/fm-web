import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { type JSONContent } from "@tiptap/react";

export interface EditingPostState {
  postId: string | null;
  content: JSONContent | null;
}

const initialState: EditingPostState = {
  postId: null,
  content: null,
};

export const editingPostSlice = createSlice({
  name: "editingPost",
  initialState,
  reducers: {
    initializeEditor: (
      state,
      action: PayloadAction<EditingPostState>
    ) => {
      state.postId = action.payload.postId;
      state.content = action.payload.content;
    },

    setContent: (state, action: PayloadAction<JSONContent>) => {
      state.content = action.payload;
    },

    resetEditor: () => initialState,
  },
});

export const { initializeEditor, setContent, resetEditor } = editingPostSlice.actions;
export default editingPostSlice.reducer;
