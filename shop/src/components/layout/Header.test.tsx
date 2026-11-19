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
});
