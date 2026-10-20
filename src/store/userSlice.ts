import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { User } from "../types";

interface UserState {
  currentUser: User | null;
}

// read the saved user so a refresh doesn't log them out
const saved = localStorage.getItem("currentUser");

const initialState: UserState = {
  currentUser: saved ? JSON.parse(saved) : null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginUser: (state, action: PayloadAction<User>) => {
      state.currentUser = action.payload;
    },
    logoutUser: (state) => {
      state.currentUser = null;
    },
    updateUser: (state, action: PayloadAction<User>) => {
      state.currentUser = action.payload;
    },
  },
});

export const { loginUser, logoutUser, updateUser } = userSlice.actions;
export default userSlice.reducer;