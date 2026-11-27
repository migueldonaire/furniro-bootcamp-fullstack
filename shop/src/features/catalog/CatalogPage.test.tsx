import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { renderWithProviders } from "../../test/renderWithProviders";
import { CatalogPage } from "./CatalogPage";
import { useGetProductsQuery } from "./catalogApi";
import { type Product } from "./product";

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
    // Dado: la API manda la Silla Nora con el precio ya calculado con IVA (100 € + 21 %)
    const product: Product = {
      id: "silla-nora",
      imgURL: "https://example.com/silla-nora.jpg",
      title: "Silla Nora",
      description: "Silla de diseño",
      price: "121,00 €", // el IVA lo calcula la API; aquí ya llega hecho
    };
    vi.mocked(useGetProductsQuery).mockReturnValue({
      data: [product],
      isLoading: false,
      error: undefined,
    } as never);

    // Cuando: un visitante abre la tienda
    renderWithProviders(<CatalogPage />);

    // Entonces: ve la Silla Nora con el precio tal cual lo manda la API
    expect(screen.getByRole("heading", { name: "Silla Nora" })).toBeInTheDocument();
    expect(screen.getByText("121,00 €")).toBeInTheDocument();
  });

  it("Escenario: Producto sin foto", () => {
    // Dado: un producto sin imágenes (la API manda imgURL: null)
    const product: Product = {
      id: "producto-sin-foto",
      imgURL: null,
      title: "Mesa Sin Foto",
      description: "Producto de prueba sin imágenes",
      price: "60,50 €",
    };
    vi.mocked(useGetProductsQuery).mockReturnValue({
      data: [product],
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
