import { vi, describe, it, expect } from "vitest";
import { useGetAdminProductsQuery } from "./productsApi";
import { ProductsPage } from "./ProductsPage";
import { renderWithProviders } from "../../test/renderWithProviders";
import { screen } from "@testing-library/react";
vi.mock("./productsApi", () => ({
  useGetAdminProductsQuery: vi.fn(),
}));

describe("ProductsPage", () => {
  it("se ven los productos", () => {
    vi.mocked(useGetAdminProductsQuery).mockReturnValue({
      data: [
        {
          id: "1",
          name: "Producto 1",
          sku: "SKU1",
          basePrice: "100.00",
          stock: 10,
          status: "ACTIVE",
          categoryName: "Categoría 1",
          imageUrl: null,
        },
        {
          id: "2",
          name: "Producto 2",
          sku: "SKU2",
          basePrice: "200.00",
          stock: 5,
          status: "INACTIVE",
          categoryName: "Categoría 2",
          imageUrl: null,
        },
      ],
      isLoading: false,
      isError: false,
    } as never);

    renderWithProviders(<ProductsPage />);

    expect(screen.getByText("Producto 1")).toBeInTheDocument();
    expect(screen.getByText("Producto 2")).toBeInTheDocument();

    expect(screen.getByText(/SKU1/)).toBeInTheDocument();
    expect(screen.getByText(/SKU2/)).toBeInTheDocument();

    expect(screen.getByText(/200,00/)).toBeInTheDocument();
    expect(screen.getByText(/100,00/)).toBeInTheDocument();

    expect(screen.getByText("Categoría 1")).toBeInTheDocument();
    expect(screen.getByText("Categoría 2")).toBeInTheDocument();

    expect(screen.getByText("Activo")).toBeInTheDocument();
    expect(screen.getByText("Desactivado")).toBeInTheDocument();
  });
  it("muestra mensaje de carga", () => {
    vi.mocked(useGetAdminProductsQuery).mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
    } as never);

    renderWithProviders(<ProductsPage />);

    expect(screen.getByText("Cargando productos...")).toBeInTheDocument();
  });
  it("muestra mensaje de error", () => {
    vi.mocked(useGetAdminProductsQuery).mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
    } as never);
    renderWithProviders(<ProductsPage />);
    expect(screen.getByText("Error al cargar los productos.")).toBeInTheDocument();
  });
});
