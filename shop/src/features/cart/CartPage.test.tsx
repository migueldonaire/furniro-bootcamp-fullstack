import { act, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderWithProviders } from "../../test/renderWithProviders";
import { formatEuro } from "../../lib/money";
import { CartPage } from "./CartPage";
import { itemAdded } from "./cartSlice";

// The page prints a regular space before €, but formatEuro uses a non-breaking one,
// and Testing Library normalizes the DOM text only. Compare with the same space.
const euro = (amount: number) => formatEuro(amount).replace(/\u00a0/g, " ");

describe("CartPage", () => {
  it("shows the lines of the cart with prices with VAT", () => {
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
    // Each line shows the price without VAT; VAT is only added in the totals box.
    expect(screen.getByText(euro(100))).toBeInTheDocument();
    expect(screen.getAllByText(euro(200))).toHaveLength(2); // line subtotal and cart subtotal
    expect(screen.getByText(euro(242))).toBeInTheDocument();
  });
});
