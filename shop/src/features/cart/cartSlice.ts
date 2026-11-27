import { createSelector, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../app/store";
import { priceWithTax } from "../../lib/money";

export type CartItem = {
  productId: string;
  name: string;
  basePrice: number;
  taxRate: number;
  quantity: number;
  stock: number;
  imageUrl: string;
};

type CartState = { items: CartItem[] };

const initialState: CartState = { items: [] };

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
      const newItem = action.payload;
      if (getAddToCartError(state.items, newItem) !== null) {
        return state;
      }
      const exists = state.items.some((line) => line.productId === newItem.productId);
      if (exists) {
        return {
          ...state,
          items: state.items.map((line) =>
            line.productId === newItem.productId
              ? { ...line, quantity: line.quantity + newItem.quantity }
              : line,
          ),
        };
      }
      return { ...state, items: [...state.items, newItem] };
    },
  },
});

export const { itemAdded } = cartSlice.actions;

export default cartSlice.reducer;

export const selectCartCount = (state: RootState) =>
  state.cart.items.reduce((total, line) => total + line.quantity, 0);

export const selectCartTotals = createSelector(
  (state: RootState) => state.cart.items,
  (items) => {
    const subtotal = items.reduce((sum, line) => sum + line.basePrice * line.quantity, 0);
    const total = items.reduce(
      (sum, line) => sum + priceWithTax(line.basePrice, line.taxRate) * line.quantity,
      0,
    );
    return { subtotal, vat: total - subtotal, total };
  },
);
