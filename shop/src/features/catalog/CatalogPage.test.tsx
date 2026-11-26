import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { renderWithProviders } from "../../test/renderWithProviders";
import { CatalogPage } from "./CatalogPage";
import { useGetProductsQuery } from "./catalogApi";
import { toProduct, type Product, type ProductRow } from "./product";

// Sustituimos el hook de RTK Query por uno falso: el test no llama a la API
vi.mock("./catalogApi", () => ({ useGetProductsQuery: vi.fn() }));

describe("Catálogo", () => {
  it("Escenario: Ver productos sin iniciar sesión", () => {
    // Dado: hay 29 productos activos (los creamos con un bucle)
    const products: Product[] = Array.from({ length: 29 }, (_, i) => ({
      id: `id-${i + 1}`,
      imgURL: `https://example.com/producto-${i + 1}.jpg`,
      title: `Producto ${i + 1}`,
      description: "Descripción de prueba",
      price: `${i + 1},00 €`,
    }));
    
    // El hook falso devuelve esos productos, ya cargados y sin error
    vi.mocked(useGetProductsQuery).mockReturnValue({
      data: products,
      isLoading: false,
      error: undefined,
    } as never);

    // Cuando: un visitante (sin iniciar sesión) abre la tienda
    renderWithProviders(<CatalogPage />);

    // Entonces: ve los 29 productos, cada uno con su foto y su nombre
    expect(screen.getAllByRole("img")).toHaveLength(29);
    expect(screen.getAllByRole("heading", { level: 2 })).toHaveLength(29);

    // Y un producto concreto enseña bien su foto principal, su nombre y su precio
    const photo = screen.getByRole("img", { name: "Producto 7" }); // el alt es el título
    expect(photo).toHaveAttribute("src", "https://example.com/producto-7.jpg");
    expect(screen.getByRole("heading", { name: "Producto 7" })).toBeInTheDocument();
    expect(screen.getByText("7,00 €")).toBeInTheDocument();
  });
  it("Escenario: Precio con IVA", () => {
    // Dado: la Silla Nora cuesta 100 € sin IVA, con IVA 21 % (así la manda la API)
    const row: ProductRow = {
      id: "silla-nora",
      name: "Silla Nora",
      description: "Silla de diseño",
      base_price: "100.00", // sin IVA (pg manda los NUMERIC como texto)
      tax_rate: "21.00",
      url: "https://example.com/silla-nora.jpg",
    };
    // Usamos vuestro toProduct de verdad: es quien calcula el IVA
    vi.mocked(useGetProductsQuery).mockReturnValue({
      data: [toProduct(row)],
      isLoading: false,
      error: undefined,
    } as never);

    // Cuando: un visitante abre la tienda
    renderWithProviders(<CatalogPage />);

    // Entonces: ve la Silla Nora a 121,00 €
    expect(screen.getByRole("heading", { name: "Silla Nora" })).toBeInTheDocument();
    expect(screen.getByText("121,00 €")).toBeInTheDocument();
  });

  it("Escenario: Precio con céntimos", () => {
    // Dado: un producto cuesta 19,99 € sin IVA, con IVA 21 %
    const row: ProductRow = {
      id: "producto-centimos",
      name: "Cojín Coral",
      description: "Cojín de prueba",
      base_price: "19.99", // sin IVA: 19,99 × 1,21 = 24,1879 (más de 2 decimales)
      tax_rate: "21.00",
      url: "https://example.com/cojin-coral.jpg",
    };
    // Usamos vuestro toProduct de verdad: calcula el IVA y redondea
    vi.mocked(useGetProductsQuery).mockReturnValue({
      data: [toProduct(row)],
      isLoading: false,
      error: undefined,
    } as never);

    // Cuando: un visitante abre la tienda
    renderWithProviders(<CatalogPage />);

    // Entonces: lo ve a 24,19 € (redondeado a céntimos)
    expect(screen.getByText("24,19 €")).toBeInTheDocument();
  });

  it("Escenario: Producto sin foto", () => {
    // Dado: un producto no tiene imágenes (la API manda url: null por el LEFT JOIN)
    const row: ProductRow = {
      id: "producto-sin-foto",
      name: "Mesa Sin Foto",
      description: "Producto de prueba sin imágenes",
      base_price: "50.00",
      tax_rate: "21.00",
      url: null,
    };
    vi.mocked(useGetProductsQuery).mockReturnValue({
      data: [toProduct(row)],
      isLoading: false,
      error: undefined,
    } as never);

    // Cuando: un visitante abre la tienda
    renderWithProviders(<CatalogPage />);

    // Entonces: el producto sale igual, con su nombre...
    expect(screen.getByRole("heading", { name: "Mesa Sin Foto" })).toBeInTheDocument();
    // ...sin ninguna imagen rota...
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
    // ...y con el sustituto genérico en su lugar
    expect(screen.getByText("No existe imagen")).toBeInTheDocument();
    });

    it("Escenario: Tienda sin productos", () => {
    // Dado: no hay ningún producto activo (la API devuelve una lista vacía)
    vi.mocked(useGetProductsQuery).mockReturnValue({
      data: [],
      isLoading: false,
      error: undefined,
    } as never);

    // Cuando: un visitante abre la tienda
    renderWithProviders(<CatalogPage />);

    // Entonces: ve el mensaje y ninguna tarjeta de producto
    expect(screen.getByText("Todavía no hay productos")).toBeInTheDocument();
    expect(screen.queryByRole("article")).not.toBeInTheDocument();
  });
});
