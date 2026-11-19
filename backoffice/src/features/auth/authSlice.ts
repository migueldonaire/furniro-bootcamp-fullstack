import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export type User = {
  id: string;
  name: string;
  lastName: string;
  email: string;
  role: "CUSTOMER" | "ADMIN";
};

type AuthState = {
  token: string | null;
  user: User | null; // null = nobody has logged in
};

const initialState: AuthState = { token: null, user: null };

// Ready for the login card (C2): dispatch(loggedIn({ token, user }))
export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loggedIn(state, action: PayloadAction<{ token: string; user: User }>) {
      state.token = action.payload.token;
      state.user = action.payload.user;
    },
    loggedOut(state) {
      state.token = null;
      state.user = null;
    },
  },
});

export const { loggedIn, loggedOut } = authSlice.actions;
export default authSlice.reducer;
