import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { SessionUser } from "../types";

interface UserState {
  currentUser: SessionUser | null;
}

// read the saved user so a refresh doesn't log them out
function loadSavedUser(): SessionUser | null {
  try {
    const saved = localStorage.getItem("currentUser");
    if (!saved) return null;
    const u = JSON.parse(saved);
    // copy only the safe fields, which also cleans out old saves that held a password
    return { id: u.id, email: u.email, name: u.name, surname: u.surname, cellNumber: u.cellNumber };
  } catch {
    return null;
  }
}

const initialState: UserState = { currentUser: loadSavedUser() };

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginUser: (state, action: PayloadAction<SessionUser>) => {
      state.currentUser = action.payload;
    },
    logoutUser: (state) => {
      state.currentUser = null;
    },
    updateUser: (state, action: PayloadAction<SessionUser>) => {
      state.currentUser = action.payload;
    },
  },
});

export const { loginUser, logoutUser, updateUser } = userSlice.actions;
export default userSlice.reducer;