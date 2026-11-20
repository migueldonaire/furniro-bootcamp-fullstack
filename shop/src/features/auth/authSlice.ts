import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

// The store only keeps the token. The user (name, email, role...) is NOT
// saved anywhere: the app asks the API for it with GET /auth/me (authApi.ts).
type AuthState = {
  token: string | null; // null = nobody has logged in
};

const initialState: AuthState = { token: null };

// Reducers never change the state: they return a NEW object
// with the old values (...state) and the ones that change.
export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Card C2: POST /auth/login answers { accessToken } -> dispatch(loggedIn(accessToken))
    loggedIn: (state, action: PayloadAction<string>) => ({
      ...state,
      token: action.payload,
    }),
    // Card C3: dispatch(loggedOut()) and then dispatch(api.util.resetApiState())
    // so that the data of the previous user (GET /auth/me...) is forgotten
    loggedOut: (state) => ({
      ...state,
      token: null,
    }),
  },
});

export const { loggedIn, loggedOut } = authSlice.actions;
export default authSlice.reducer;
