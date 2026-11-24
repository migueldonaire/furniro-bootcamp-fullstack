import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderWithProviders } from "../../test/renderWithProviders";
import { Header } from "./Header";

describe("Header", () => {
  it("shows the name of the app and the menu", () => {
    renderWithProviders(<Header />);
    expect(screen.getByText("Furniro")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Catálogo" })).toBeInTheDocument();
  });

  // index.css paints the menu with ".header" and the current page with ".active"
  it("uses the classes of index.css and marks the current page", () => {
    renderWithProviders(<Header />, "/cart");
    expect(screen.getByRole("banner")).toHaveClass("header");
    expect(screen.getByRole("link", { name: "Carrito" })).toHaveClass("active");
    expect(screen.getByRole("link", { name: "Entrar" })).not.toHaveClass("active");
  });
});
