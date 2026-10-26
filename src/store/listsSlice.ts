import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { ShoppingList } from "../types";

interface ListsState {
  lists: ShoppingList[];
  sharedLists: ShoppingList[];
}

const initialState: ListsState = { lists: [], sharedLists: [] };

const listsSlice = createSlice({
  name: "lists",
  initialState,
  reducers: {
    setLists: (state, action: PayloadAction<ShoppingList[]>) => {
      state.lists = action.payload;
    },
    setSharedLists: (state, action: PayloadAction<ShoppingList[]>) => {
      state.sharedLists = action.payload;
    },
    addList: (state, action: PayloadAction<ShoppingList>) => {
      state.lists.push(action.payload);
    },
    updateList: (state, action: PayloadAction<ShoppingList>) => {
      const index = state.lists.findIndex((l) => l.id === action.payload.id);
      if (index !== -1) state.lists[index] = action.payload;
    },
    deleteList: (state, action: PayloadAction<number>) => {
      state.lists = state.lists.filter((l) => l.id !== action.payload);
    },
  },
});

export const { setLists, setSharedLists, addList, updateList, deleteList } = listsSlice.actions;
export default listsSlice.reducer;