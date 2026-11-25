import { describe, expect, it } from "vitest";
import cartReducer, { itemAdded, getAddToCartError } from "./cartSlice";

const nora = {
  productId: "nora",
  name: "Silla Nora",
  basePrice: 100,
  taxRate: 21,
  stock: 5,
  quantity: 2,
};

describe("cartSlice", () => {
  it("adds 2 chairs to an empty cart", () => {
    const state = cartReducer(undefined, itemAdded(nora));
    expect(state.items).toHaveLength(1);
    expect(state.items[0].quantity).toBe(2);
  });

  it("does not add more units than the stock", () => {
    const before = { items: [] };
    const tooMany = { ...nora, quantity: 6 };

    expect(getAddToCartError(before.items, tooMany)).toBe("Only 5 units left");
    expect(cartReducer(before, itemAdded(tooMany))).toBe(before);
  });
  it("adds units to the same line if the product is already in the cart", () => {
    const before = { items: [nora] };
    const state = cartReducer(before, itemAdded({ ...nora, quantity: 1 }));
    expect(state.items).toHaveLength(1);
    expect(state.items[0].quantity).toBe(3);
  });

  it("counts the units already in the cart", () => {
    const before = { items: [{ ...nora, quantity: 4 }] };
    expect(getAddToCartError(before.items, { ...nora, quantity: 2 })).toBe("Only 5 units left");
  });

  it("does not add 0 units or negative units", () => {
    expect(getAddToCartError([], { ...nora, quantity: 0 })).toBe("Need to have 1 unit");
    expect(getAddToCartError([], { ...nora, quantity: -1 })).toBe("Need to have 1 unit");
  });

  it("returns a new state and does not change the old one", () => {
    const before = { items: [nora] };
    const after = cartReducer(before, itemAdded({ ...nora, quantity: 1 }));
    expect(before.items[0].quantity).toBe(2);
    expect(after).not.toBe(before);
  });
});
