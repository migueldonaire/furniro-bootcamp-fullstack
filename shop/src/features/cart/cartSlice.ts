import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../app/store";

export type CartItem = {
  productId: string;
  name: string;
  basePrice: number; // without VAT
  taxRate: number; // 21 = 21 %
  quantity: number;
  stock: number;
  imageUrl: string; // main photo of the product, shown in the cart line
};

type CartState = { items: CartItem[] };

const initialState: CartState = { items: [] };

// The cart lives only in the frontend (not in the database).
// Cards T5, T6, T7 and T8 add the reducers here. They return a NEW object:
// itemAdded: (state, action) => ({ ...state, items: [...state.items, action.payload] })
export function getAddToCartError(items: CartItem[], item: CartItem): string | null {
  if (item.quantity < 1) {
    return "La cantidad mínima es 1";
  }

  const line = items.find((cartLine) => cartLine.productId === item.productId);
  const inCart = line?.quantity ?? 0;

  if (inCart + item.quantity > item.stock) {
    return `Solo quedan ${item.stock} unidades`;
  }
  return null;
}
export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    itemAdded: (state, action: PayloadAction<CartItem>) => {
      const newItem = action.payload; // what the visitor adds
      if (getAddToCartError(state.items, newItem) !== null) {
        return state; // 1. error → the cart does not change
      }
      const exists = state.items.some((line) => line.productId === newItem.productId);
      if (exists) {
        // 2. already in the cart → one line, more units
        return {
          ...state,
          items: state.items.map((line) =>
            line.productId === newItem.productId
              ? { ...line, quantity: line.quantity + newItem.quantity }
              : line,
          ),
        };
      }
      return { ...state, items: [...state.items, newItem] }; // 3. new product → at the end
    },
  },
});

export const { itemAdded } = cartSlice.actions;

export default cartSlice.reducer;

// Total units in the cart (for the cart icon)
export const selectCartCount = (state: RootState) =>
  state.cart.items.reduce((total, line) => total + line.quantity, 0);
