import { createSlice } from "@reduxjs/toolkit";

export type CartItem = {
  productId: string;
  name: string;
  basePrice: number; // without VAT
  taxRate: number; // 21 = 21 %
  quantity: number;
  stock: number;
};

type CartState = { items: CartItem[] };

const initialState: CartState = { items: [] };

// The cart lives only in the frontend (not in the database).
// Cards T5, T6, T7 and T8 add the reducers here. They return a NEW object:
// itemAdded: (state, action) => ({ ...state, items: [...state.items, action.payload] })
export function getAddToCartError(items: CartItem[], item: CartItem): string | null {
  if (item.quantity < 1){
    return "Need to have 1 unit";
  }

  const line = items.find((cartLine) => cartLine.productId === item.productId );
  const inCart = line?.quantity ??  0;

  if(inCart + item.quantity > item.stock) {
    return `Only ${item.stock} units left`;
  }
  return null;
}
export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {},
});

export default cartSlice.reducer;
