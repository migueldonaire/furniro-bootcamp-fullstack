import { screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderWithProviders } from "../../test/renderWithProviders";
import { OrderPage } from "./OrderPage";
import { type AdminOrderDetail, useGetAdminOrderQuery } from "./ordersApi";

vi.mock("./ordersApi", () => ({ useGetAdminOrderQuery: vi.fn() }));
const mockedQuery = vi.mocked(useGetAdminOrderQuery);

function answer(order: AdminOrderDetail | undefined, isError = false) {
  mockedQuery.mockReturnValue({
    data: order,
    isLoading: false,
    isError,
  } as unknown as ReturnType<typeof useGetAdminOrderQuery>);
}

const anaOrder: AdminOrderDetail = {
  id: "f0000000-0000-4000-8000-000000000001",
  orderDate: "2026-11-10T10:00:00.000Z",
  status: "PENDING",
  shippingCost: 8,
  currency: "EUR",
  customer: { name: "Ana López", email: "ana@mail.com", phone: "611223344" },
  address: {
    fullName: "Ana López",
    street: "Calle Mayor 1",
    city: "Madrid",
    province: "Madrid",
    postalCode: "28001",
    country: "ES",
  },
  lines: [
    {
      id: "f2000000-0000-4000-8000-000000000001",
      productName: "Silla Nora",
      sku: "FUR-SIL-001",
      quantity: 2,
      unitPrice: 100,
      taxRate: 21,
    },
  ],
  total: 250, // la API ya lo manda calculado: 2 x 121 + 8
};

describe("OrderPage", () => {
  beforeEach(() => {
    mockedQuery.mockReset();
  });

  it("shows the customer, the products, the address and the total", () => {
    // Dado: el pedido de Ana
    answer(anaOrder);

    // Cuando: se pinta la página
    renderWithProviders(<OrderPage />);

    // Entonces: ve sus datos y el total (2 x 121 + 8 = 250)
    expect(screen.getAllByText("Ana López")).toHaveLength(2);
    expect(screen.getByText("ana@mail.com")).toBeInTheDocument();
    expect(screen.getByText("611223344")).toBeInTheDocument();
    expect(screen.getByText("FUR-SIL-001")).toBeInTheDocument();
    expect(screen.getByText("Calle Mayor 1")).toBeInTheDocument();
    expect(screen.getByText("Envío: 8,00 €")).toBeInTheDocument();
    expect(screen.getByText("Total: 250,00 €")).toBeInTheDocument();
  });

  it("shows the price of the line as it was when the order was made", () => {
    // Dado: la línea guarda 100 € sin IVA
    answer(anaOrder);

    // Cuando: se pinta la página
    renderWithProviders(<OrderPage />);

    // Entonces: la línea muestra 100,00 €
    expect(screen.getByText("100,00 €")).toBeInTheDocument();
  });

  it("shows a message when the order does not exist", () => {
    // Dado: la API responde con error (404)
    answer(undefined, true);

    // Cuando: se pinta la página
    renderWithProviders(<OrderPage />);

    // Entonces: ve el mensaje
    expect(screen.getByText("Pedido no encontrado")).toBeInTheDocument();
  });
});
