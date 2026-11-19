import { configureStore } from "@reduxjs/toolkit";
import { api } from "./api";
import { rootReducer } from "./rootReducer";

// Reads a key from localStorage. If there is nothing or it is wrong, undefined
function loadSaved(key: string) {
  try {
    const text = localStorage.getItem(key);
    return text ? JSON.parse(text) : undefined;
  } catch {
    return undefined;
  }
}

export function makeStore(preloadedState?: Partial<ReturnType<typeof rootReducer>>) {
  return configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(api.middleware),
    preloadedState,
  });
}

// The session is kept when you reload the page (the cart is not, see the specification)
export const store = makeStore({ auth: loadSaved("shop-auth") });

store.subscribe(() => {
  localStorage.setItem("shop-auth", JSON.stringify(store.getState().auth));
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof makeStore>;
export type AppDispatch = AppStore["dispatch"];
