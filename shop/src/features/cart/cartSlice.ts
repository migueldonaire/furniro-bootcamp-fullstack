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

// ---- TESTING ONLY: products to try the cart by hand ----
// Until the product page (FUR-35) can add products, uncomment this block and
// change initialState below to `{ items: testingItems }`. Do not commit it uncommented.
// Data from the seed (database/seed.sql). Stocks go from 1 to 40 to try the limits.
//
// const IMAGES =
//   "https://raw.githubusercontent.com/migueldonaire/furniro-bootcamp-fullstack/main/database/images";
// const item = (id: string, name: string, basePrice: number, quantity: number, stock: number, image: string): CartItem =>
//   ({ productId: `d0000000-0000-4000-8000-0000000000${id}`, name, basePrice, taxRate: 21, quantity, stock, imageUrl: `${IMAGES}/${image}` });
// const testingItems: CartItem[] = [
//   item("01", "Silla Nora", 100, 2, 5, "silla-nora-1.jpg"),
//   item("06", "Mesa Asgaard", 250, 1, 3, "mesa-asgaard-1.jpg"),
//   item("11", "Sofá Asgaard", 890, 1, 2, "sofa-asgaard-1.jpg"),
//   item("16", "Lámpara Luna", 89, 3, 15, "lampara-luna-1.jpg"),
//   item("09", "Mesa Potty", 310, 1, 1, "mesa-potty-1.jpg"),
//   item("02", "Silla Leviosa", 65, 4, 12, "silla-leviosa-1.jpg"),
//   item("05", "Sillón Grifo", 190, 2, 2, "sillon-grifo-1.jpg"),
//   item("10", "Escritorio Bolt", 160, 1, 7, "escritorio-bolt-1.jpg"),
//   item("25", "Cojín Coral", 18, 6, 40, "cojin-coral-1.jpg"),
//   item("19", "Cama Ottawa", 450, 1, 3, "cama-ottawa-1.jpg"),
// ];
// ---- END TESTING ONLY ----

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
    quantityChanged: (state, action: PayloadAction<{ productId: string; quantity: number }>) => {
      const { productId, quantity } = action.payload;
      const line = state.items.find((cartLine) => cartLine.productId === productId);
      if (!line || quantity > line.stock) {
        return state;
      }
      if (quantity === 0) {
        return {
          ...state,
          items: state.items.filter((cartLine) => cartLine.productId !== productId),
        };
      }
      return {
        ...state,
        items: state.items.map((cartLine) =>
          cartLine.productId === productId ? { ...cartLine, quantity } : cartLine,
        ),
      };
    },
  },
});

export const { itemAdded, quantityChanged } = cartSlice.actions;

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
