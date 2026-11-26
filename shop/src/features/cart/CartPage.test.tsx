import { act, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderWithProviders } from "../../test/renderWithProviders";
import { formatEuro } from "../../lib/money";
import { CartPage } from "./CartPage";
import { itemAdded } from "./cartSlice";

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
    expect(screen.getByText(formatEuro(121))).toBeInTheDocument();
    expect(screen.getAllByText(formatEuro(242))).not.toHaveLength(0);
  });
});
