import { describe, expect, it } from "vitest";
import cartReducer, { itemAdded, type CartItem } from "./cartSlice";

const sofa: CartItem = {
  productId: "p1",
  name: "Sofá",
  basePrice: 100,
  taxRate: 21,
  quantity: 1,
};

describe("cartSlice", () => {
  it("adds the item and does not change the old state", () => {
    const before = { items: [] };
    const after = cartReducer(before, itemAdded(sofa));
    expect(after.items).toEqual([sofa]);
    expect(before.items).toEqual([]);
    expect(after).not.toBe(before);
  });
});
