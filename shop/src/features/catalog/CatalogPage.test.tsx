import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { renderWithProviders } from "../../test/renderWithProviders";
import { CatalogPage } from "./CatalogPage";
import { useGetProductsQuery } from "./catalogApi";
import { type Product } from "./product";

// Sustituimos el hook de RTK Query por uno falso: el test no llama a la API
vi.mock("./catalogApi", () => ({ useGetProductsQuery: vi.fn() }));

// El hook falso devuelve estos productos, ya cargados y sin error
function mockProducts(products: Product[]) {
  vi.mocked(useGetProductsQuery).mockReturnValue({
    data: products,
    isLoading: false,
    error: undefined,
  } as never);
}

describe("Catálogo", () => {
  it("Escenario: Ver productos sin iniciar sesión", () => {
    // Dado: hay 29 productos activos (los creamos con un bucle)
    mockProducts(
      Array.from({ length: 29 }, (_, i) => ({
        id: `id-${i + 1}`,
        imgURL: `https://example.com/producto-${i + 1}.jpg`,
        title: `Producto ${i + 1}`,
        description: "Descripción de prueba",
        basePrice: 100,
        taxRate: 21,
      })),
    );

    // Cuando: un visitante (sin iniciar sesión) abre la tienda
    renderWithProviders(<CatalogPage />);

    // Entonces: ve los 29 productos, cada uno con su foto, su nombre y su precio
    expect(screen.getAllByRole("img")).toHaveLength(29);
    expect(screen.getAllByRole("heading", { level: 2 })).toHaveLength(29);
    expect(screen.getAllByText("121,00 €")).toHaveLength(29);

    // Y un producto concreto enseña bien su foto principal y su nombre
    const photo = screen.getByRole("img", { name: "Producto 7" }); // el alt es el título
    expect(photo).toHaveAttribute("src", "https://example.com/producto-7.jpg");
    expect(screen.getByRole("heading", { name: "Producto 7" })).toBeInTheDocument();
  });

  it("Escenario: Precio con IVA", () => {
    // Dado: la Silla Nora cuesta 100 € sin IVA, con IVA 21 % (así la manda la API)
    mockProducts([
      {
        id: "silla-nora",
        imgURL: "https://example.com/silla-nora.jpg",
        title: "Silla Nora",
        description: "Silla de diseño",
        basePrice: 100, // sin IVA
        taxRate: 21,
      },
    ]);

    // Cuando: un visitante abre la tienda
    renderWithProviders(<CatalogPage />);

    // Entonces: ve la Silla Nora a 121,00 € (la web calcula el IVA)
    expect(screen.getByRole("heading", { name: "Silla Nora" })).toBeInTheDocument();
    expect(screen.getByText("121,00 €")).toBeInTheDocument();
  });

  it("Escenario: Precio con céntimos", () => {
    // Dado: un producto cuesta 19,99 € sin IVA, con IVA 21 %
    mockProducts([
      {
        id: "producto-centimos",
        imgURL: "https://example.com/cojin-coral.jpg",
        title: "Cojín Coral",
        description: "Cojín de prueba",
        basePrice: 19.99, // 19,99 × 1,21 = 24,1879 (más de 2 decimales)
        taxRate: 21,
      },
    ]);

    // Cuando: un visitante abre la tienda
    renderWithProviders(<CatalogPage />);

    // Entonces: lo ve a 24,19 € (redondeado a céntimos)
    expect(screen.getByText("24,19 €")).toBeInTheDocument();
  });

  it("Escenario: Producto sin foto", () => {
    // Dado: un producto sin imágenes (la API manda imgURL: null)
    mockProducts([
      {
        id: "producto-sin-foto",
        imgURL: null,
        title: "Mesa Sin Foto",
        description: "Producto de prueba sin imágenes",
        basePrice: 50,
        taxRate: 21,
      },
    ]);

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
    mockProducts([]);

    // Cuando: un visitante abre la tienda
    renderWithProviders(<CatalogPage />);

    // Entonces: ve el mensaje y ninguna tarjeta de producto
    expect(screen.getByText("Todavía no hay productos")).toBeInTheDocument();
    expect(screen.queryByRole("article")).not.toBeInTheDocument();
  });
});
