import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import listsReducer from "./listsSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    lists: listsReducer,
  },
});

// save the logged-in user whenever it changes
store.subscribe(() => {
  const { currentUser } = store.getState().user;
  if (currentUser) {
    localStorage.setItem("currentUser", JSON.stringify(currentUser));
  } else {
    localStorage.removeItem("currentUser");
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;