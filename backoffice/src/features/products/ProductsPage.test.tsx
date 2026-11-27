import { vi, describe, it, expect, afterEach } from "vitest";
import { useGetAdminProductsQuery } from "./productsApi";
import { ProductsPage } from "./ProductsPage";
import { renderWithProviders } from "../../test/renderWithProviders";
import { screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// Usa el productsApi real (tipos, productCategories...) y solo cambia el hook por uno falso
vi.mock("./productsApi", async (importOriginal) => ({
  ...(await importOriginal<typeof import("./productsApi")>()),
  useGetAdminProductsQuery: vi.fn(),
}));

describe("ProductsPage", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("se ven los productos", () => {
    // Dado: la API devuelve { data, pagination } con 2 productos
    vi.mocked(useGetAdminProductsQuery).mockReturnValue({
      data: {
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
        pagination: { page: 1, limit: 6, total: 2 },
      },
      isLoading: false,
      isError: false,
    } as never);

    // Cuando: se pinta la página
    renderWithProviders(<ProductsPage />);

    // Entonces: se ven los datos de los dos productos

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
  it("el select con opcion desactivado muestra INACTIVE", async () => {
    const user = userEvent.setup();
    vi.mocked(useGetAdminProductsQuery).mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: false,
    } as never);
    renderWithProviders(<ProductsPage />);
    await user.selectOptions(screen.getByLabelText("Estado:"), "Desactivados");
    // objectContaining: comprueba solo status; el resto de filtros (category, sort, page) da igual aquí
    expect(vi.mocked(useGetAdminProductsQuery)).toHaveBeenLastCalledWith(
      expect.objectContaining({ status: "INACTIVE" }),
    );
  });
  it("el select de categoría filtra por el id de la categoría", async () => {
    // Dado: la página está pintada (no hace falta que haya productos)
    const user = userEvent.setup();
    vi.mocked(useGetAdminProductsQuery).mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: false,
    } as never);
    renderWithProviders(<ProductsPage />);

    // Cuando: elige "Mesas" en el select de categoría
    await user.selectOptions(screen.getByLabelText("Categoría:"), "Mesas");

    // Entonces: la query recibe el id de Mesas (la API compara con category_id), no el nombre
    expect(vi.mocked(useGetAdminProductsQuery)).toHaveBeenLastCalledWith(
      expect.objectContaining({ category: "c0000000-0000-4000-8000-000000000002" }),
    );
  });
  it("busca por nombre o SKU cuando se deja de escribir", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    vi.mocked(useGetAdminProductsQuery).mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: false,
    } as never);
    renderWithProviders(<ProductsPage />);
    await user.type(screen.getByLabelText("Buscar:"), "FUR-SIL-001");
    expect(vi.mocked(useGetAdminProductsQuery)).not.toHaveBeenLastCalledWith(
      expect.objectContaining({ search: "FUR-SIL-001" }),
    );
    act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(vi.mocked(useGetAdminProductsQuery)).toHaveBeenLastCalledWith(
      expect.objectContaining({ search: "FUR-SIL-001" }),
    );
  });
});
