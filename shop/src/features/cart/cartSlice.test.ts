import { describe, expect, it } from "vitest";
import type { RootState } from "../../app/store";
import cartReducer, {
  itemAdded,
  getAddToCartError,
  quantityChanged,
  selectCartTotals,
  toCartItem,
} from "./cartSlice";

const nora = {
  productId: "nora",
  productName: "Silla Nora",
  unitPrice: 100,
  taxRate: 21,
  imgURL: "/silla-nora.jpg",
  stock: 5,
  quantity: 2,
};

const asgaard = {
  productId: "asgaard",
  productName: "Mesa Asgaard",
  unitPrice: 250,
  taxRate: 21,
  imgURL: "/mesa-asgaard.jpg",
  stock: 3,
  quantity: 1,
};

describe("cart line", () => {
  it("builds a cart line from a product of the API", () => {
    const product = {
      id: "nora",
      title: "Silla Nora",
      description: "Silla de diseño",
      basePrice: 100,
      taxRate: 21,
      imgURL: "/silla-nora.jpg",
    };
    expect(toCartItem(product, 2, 5)).toEqual(nora);
  });
});

describe("cartSlice", () => {
  it("adds 2 chairs to an empty cart", () => {
    const state = cartReducer(undefined, itemAdded(nora));
    expect(state.items).toHaveLength(1);
    expect(state.items[0].quantity).toBe(2);
  });

  it("does not add more units than the stock", () => {
    const before = { items: [] };
    const tooMany = { ...nora, quantity: 6 };

    expect(getAddToCartError(before.items, tooMany)).toBe("Solo quedan 5 unidades");
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
    expect(getAddToCartError(before.items, { ...nora, quantity: 2 })).toBe(
      "Solo quedan 5 unidades",
    );
  });

  it("does not add 0 units or negative units", () => {
    expect(getAddToCartError([], { ...nora, quantity: 0 })).toBe("La cantidad mínima es 1");
    expect(getAddToCartError([], { ...nora, quantity: -1 })).toBe("La cantidad mínima es 1");
  });

  it("returns a new state and does not change the old one", () => {
    const before = { items: [nora] };
    const after = cartReducer(before, itemAdded({ ...nora, quantity: 1 }));
    expect(before.items[0].quantity).toBe(2);
    expect(after).not.toBe(before);
  });
  it("calculates subtotal, VAT and total of two chairs", () => {
    const state = { cart: { items: [nora] } } as RootState;
    expect(selectCartTotals(state)).toEqual({ subtotal: 200, vat: 42, total: 242 });
  });

  it("calculates the VAT with the tax rate of each line", () => {
    // 2 chairs at 100 € with 21 % and 1 lamp at 50 € with 10 %
    const lamp = { ...asgaard, productId: "lamp", unitPrice: 50, taxRate: 10, quantity: 1 };
    const state = { cart: { items: [nora, lamp] } } as RootState;
    expect(selectCartTotals(state)).toEqual({ subtotal: 250, vat: 47, total: 297 });
  });
});

describe("changing the quantity in the cart (FUR-37)", () => {
  it("changes the quantity of a product to 4", () => {
    // Dado: el carrito tiene 2 "Silla Nora"
    const before = { items: [nora] };
    // Cuando: el visitante cambia la cantidad a 4
    const state = cartReducer(before, quantityChanged({ productId: "nora", quantity: 4 }));
    // Entonces: el carrito tiene 4 "Silla Nora"
    expect(state.items[0].quantity).toBe(4);
  });

  it("removes the line when the quantity is 0", () => {
    // Dado: el carrito tiene 2 "Silla Nora" y 1 "Mesa Asgaard"
    const before = { items: [nora, asgaard] };
    // Cuando: el visitante cambia la cantidad de "Silla Nora" a 0
    const state = cartReducer(before, quantityChanged({ productId: "nora", quantity: 0 }));
    // Entonces: el carrito solo tiene 1 "Mesa Asgaard"
    expect(state.items).toEqual([asgaard]);
  });

  it("does not change the cart when the quantity is more than the stock", () => {
    // Dado: el carrito tiene 2 "Silla Nora" (stock 5)
    const before = { items: [nora] };
    // Cuando: el visitante cambia la cantidad a 6
    const state = cartReducer(before, quantityChanged({ productId: "nora", quantity: 6 }));
    // Entonces: el carrito sigue con 2 "Silla Nora" (el aviso «Solo quedan 5 unidades» va en la página)
    expect(state.items[0].quantity).toBe(2);
  });

  it("returns a new array and does not change the old one", () => {
    const before = { items: [nora] };
    const state = cartReducer(before, quantityChanged({ productId: "nora", quantity: 4 }));
    expect(state.items).not.toBe(before.items);
    expect(before.items[0].quantity).toBe(2);
  });
});
