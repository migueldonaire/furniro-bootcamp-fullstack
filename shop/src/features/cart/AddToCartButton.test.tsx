import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { renderWithProviders } from "../../test/renderWithProviders";
import { AddToCartButton } from "./AddToCartButton";

const nora = { productId: "nora", name: "Silla Nora", basePrice: 100, taxRate: 21, stock: 5 };

describe("AddToCartButton", () => {
  it("adds the chosen units to the cart", async () => {
    const { store } = renderWithProviders(<AddToCartButton product={nora} />);
    const input = screen.getByLabelText("Cantidad");
    await userEvent.clear(input);
    await userEvent.type(input, "2"); // the visitor writes 2
    await userEvent.click(screen.getByRole("button", { name: "Añadir al carrito" }));
    expect(store.getState().cart.items[0].quantity).toBe(2);
  });

  it("shows a message when there is not enough stock", async () => {
    renderWithProviders(<AddToCartButton product={nora} />);
    const input = screen.getByLabelText("Cantidad");
    await userEvent.clear(input);
    await userEvent.type(input, "6");
    await userEvent.click(screen.getByRole("button", { name: "Añadir al carrito" }));
    expect(screen.getByRole("alert")).toHaveTextContent("Solo quedan 5 unidades");
  });
});
