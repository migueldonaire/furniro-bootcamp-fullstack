import { act, fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderWithProviders } from "../../test/renderWithProviders";
import { formatEuro } from "../../lib/money";
import { CartPage } from "./CartPage";
import { itemAdded } from "./cartSlice";

// The page prints a regular space before €, but formatEuro uses a non-breaking one,
// and Testing Library normalizes the DOM text only. Compare with the same space.
const euro = (amount: number) => formatEuro(amount).replace(/\u00a0/g, " ");

const nora = {
  productId: "nora",
  name: "Silla Nora",
  basePrice: 100,
  taxRate: 21,
  stock: 5,
  imageUrl: "/silla-nora.jpg",
  quantity: 2,
};

function renderCartWithNora() {
  const result = renderWithProviders(<CartPage />);
  act(() => {
    result.store.dispatch(itemAdded(nora));
  });
  return { ...result, input: screen.getByLabelText("Cantidad") };
}

describe("CartPage", () => {
  it("shows a message when the cart is empty", () => {
    renderWithProviders(<CartPage />);
    expect(screen.getByText("Tu carrito está vacío")).toBeInTheDocument();
  });

  it("shows the lines without VAT and the totals with VAT", () => {
    const { store } = renderWithProviders(<CartPage />);
    act(() => {
      store.dispatch(
        itemAdded({
          productId: "nora",
          name: "Silla Nora",
          basePrice: 100,
          taxRate: 21,
          stock: 5,
          imageUrl: "/silla-nora.jpg",
          quantity: 2,
        }),
      );
    });
    expect(screen.getByText("Silla Nora")).toBeInTheDocument();
    expect(screen.getByText(euro(100))).toBeInTheDocument();
    expect(screen.getAllByText(euro(200))).toHaveLength(2);
    expect(screen.getByText(euro(242))).toBeInTheDocument();
  });
});

describe("CartPage quantity input (FUR-37)", () => {
  it("does not let the quantity go below 1", () => {
    const { input } = renderCartWithNora();
    expect(input).toHaveAttribute("min", "1");
  });

  it("changes the quantity", () => {
    // Dado: el carrito tiene 2 "Silla Nora" (stock 5)
    const { store, input } = renderCartWithNora();
    // Cuando: el visitante cambia la cantidad a 4
    fireEvent.change(input, { target: { value: "4" } });
    // Entonces: el carrito tiene 4 "Silla Nora"
    expect(store.getState().cart.items[0].quantity).toBe(4);
  });

  it("shows a message and does not change the cart above the stock", () => {
    // Dado: el carrito tiene 2 "Silla Nora" (stock 5)
    const { store, input } = renderCartWithNora();
    // Cuando: el visitante cambia la cantidad a 6
    fireEvent.change(input, { target: { value: "6" } });
    // Entonces: ve «Solo quedan 5 unidades» y el carrito sigue con 2
    expect(screen.getByRole("alert")).toHaveTextContent("Solo quedan 5 unidades");
    expect(store.getState().cart.items[0].quantity).toBe(2);
  });

  it("does not accept a quantity below 1", () => {
    const { store, input } = renderCartWithNora();
    fireEvent.change(input, { target: { value: "0" } });
    expect(store.getState().cart.items[0].quantity).toBe(2);
  });
});
