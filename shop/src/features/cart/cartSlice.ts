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
// Until the product page (FUR-35) can add products, the cart starts with these
// products when you run `npm run dev`. The tests and the production build start
// with an empty cart. Remove this block when FUR-35 is merged.
// Data from the seed (database/seed.sql). Stocks go from 1 to 40 to try the limits.
const IMAGES =
  "https://raw.githubusercontent.com/migueldonaire/furniro-bootcamp-fullstack/main/database/images";

function testingItem(
  id: string,
  name: string,
  basePrice: number,
  quantity: number,
  stock: number,
  image: string,
): CartItem {
  return {
    productId: `d0000000-0000-4000-8000-0000000000${id}`,
    name,
    basePrice,
    taxRate: 21,
    quantity,
    stock,
    imageUrl: `${IMAGES}/${image}`,
  };
}

function testingItems(): CartItem[] {
  return [
    testingItem("01", "Silla Nora", 100, 2, 5, "silla-nora-1.jpg"),
    testingItem("06", "Mesa Asgaard", 250, 1, 3, "mesa-asgaard-1.jpg"),
    testingItem("11", "Sofá Asgaard", 890, 1, 2, "sofa-asgaard-1.jpg"),
    testingItem("16", "Lámpara Luna", 89, 3, 15, "lampara-luna-1.jpg"),
    testingItem("09", "Mesa Potty", 310, 1, 1, "mesa-potty-1.jpg"),
    testingItem("02", "Silla Leviosa", 65, 4, 12, "silla-leviosa-1.jpg"),
    testingItem("05", "Sillón Grifo", 190, 2, 2, "sillon-grifo-1.jpg"),
    testingItem("10", "Escritorio Bolt", 160, 1, 7, "escritorio-bolt-1.jpg"),
    testingItem("25", "Cojín Coral", 18, 6, 40, "cojin-coral-1.jpg"),
    testingItem("19", "Cama Ottawa", 450, 1, 3, "cama-ottawa-1.jpg"),
  ];
}

// `npm run dev` only: never in the tests (MODE "test") or in the production build
const useTestingItems = import.meta.env.DEV && import.meta.env.MODE !== "test";
// ---- END TESTING ONLY ----

const initialState: CartState = { items: useTestingItems ? testingItems() : [] };

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
