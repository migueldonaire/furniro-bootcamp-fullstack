import { configureStore } from "@reduxjs/toolkit";
import { api } from "./api";
import { rootReducer } from "./rootReducer";

// Only the token goes to localStorage, never the user or other data.
// When the app starts, ProtectedRoute asks GET /auth/me who the user is.
const TOKEN_KEY = "backoffice-token";

function loadToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function makeStore(preloadedState?: Partial<ReturnType<typeof rootReducer>>) {
  return configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(api.middleware),
    preloadedState,
  });
}

// The session is kept when you reload the page
export const store = makeStore({ auth: { token: loadToken() } });

store.subscribe(() => {
  const token = store.getState().auth.token;
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof makeStore>;
export type AppDispatch = AppStore["dispatch"];
