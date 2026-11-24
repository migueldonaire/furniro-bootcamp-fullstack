import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderWithProviders } from "../../test/renderWithProviders";
import { Header } from "./Header";

describe("Header", () => {
  it("shows the name of the app and the menu", () => {
    renderWithProviders(<Header />);
    expect(screen.getByText("Furniro Backoffice")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Productos" })).toBeInTheDocument();
  });

  // index.css paints the menu with ".header" and the current page with ".active"
  it("uses the classes of index.css and marks the current page", () => {
    renderWithProviders(<Header />, "/orders");
    expect(screen.getByRole("banner")).toHaveClass("header");
    expect(screen.getByRole("link", { name: "Pedidos" })).toHaveClass("active");
    expect(screen.getByRole("link", { name: "Entrar" })).not.toHaveClass("active");
  });
});
