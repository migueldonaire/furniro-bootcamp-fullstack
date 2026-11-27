import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderWithProviders } from "../../test/renderWithProviders";
import { OrdersPage } from "./OrdersPage";
import { type AdminOrder, useGetAdminOrdersQuery } from "./ordersApi";
import { ORDERS_PAGE_LIMIT } from "../../app/app";

vi.mock("./ordersApi", () => ({ useGetAdminOrdersQuery: vi.fn() }));
const mockedQuery = vi.mocked(useGetAdminOrdersQuery);

function answer(orders: AdminOrder[], total = orders.length, page = 1, totalPages = 1) {
  mockedQuery.mockReturnValue({
    data: {
      items: orders,
      total,
      page,
      limit: ORDERS_PAGE_LIMIT,
      totalPages,
    },
    isLoading: false,
    isError: false,
  } as unknown as ReturnType<typeof useGetAdminOrdersQuery>);
}

const lauraOrder: AdminOrder = {
  id: "f0000000-0000-4000-8000-000000000012",
  orderDate: "2026-11-17T12:00:00.000Z",
  status: "SHIPPED",
  customerName: "Laura Romero",
  customerEmail: "laura@mail.com",
  total: 425.45,
  products: [
    {
      id: "f1000000-0000-4000-8000-000000000022",
      name: "Estantería Lira",
      quantity: 1,
      imageUrl: null,
    },
  ],
};

describe("OrdersPage", () => {
  beforeEach(() => {
    mockedQuery.mockReset();
  });

  it("shows at most 2 photos and +N for the rest of the products", () => {
    // Dado: un pedido con 3 productos, todos con foto
    answer([
      {
        ...lauraOrder,
        products: [
          {
            id: "p1",
            name: "Estantería Lira",
            quantity: 1,
            imageUrl: "https://example.com/lira.jpg",
          },
          { id: "p2", name: "Espejo Sol", quantity: 1, imageUrl: "https://example.com/espejo.jpg" },
          {
            id: "p3",
            name: "Jarrón Brisa",
            quantity: 3,
            imageUrl: "https://example.com/jarron.jpg",
          },
        ],
      },
    ]);

    // Cuando: se pinta el listado
    renderWithProviders(<OrdersPage />);

    // Entonces: se ven las 2 primeras fotos, la tercera no, "+1" y "3 productos"
    expect(screen.getByAltText("Estantería Lira")).toBeInTheDocument();
    expect(screen.getByAltText("Espejo Sol")).toBeInTheDocument();
    expect(screen.queryByAltText("Jarrón Brisa")).not.toBeInTheDocument();
    expect(screen.getByText("+1")).toBeInTheDocument();
    expect(screen.getByText("3 productos")).toBeInTheDocument();
  });

  it("links each order to its detail page", () => {
    // Dado: el pedido de Laura
    answer([lauraOrder]);

    // Cuando: se pinta el listado
    renderWithProviders(<OrdersPage />);

    // Entonces: "Ver detalles" lleva a /orders/<id>
    expect(screen.getByRole("link", { name: "Ver detalles" })).toHaveAttribute(
      "href",
      "/orders/f0000000-0000-4000-8000-000000000012",
    );
  });

  it("shows each order with date, customer, status and total", () => {
    answer([lauraOrder]);

    renderWithProviders(<OrdersPage />);

    expect(screen.getByText("17/11/2026")).toBeInTheDocument();
    expect(screen.getByText("Laura Romero")).toBeInTheDocument();
    expect(screen.getByRole("cell", { name: "Enviado" })).toBeInTheDocument();
    expect(screen.getByText("425,45 €")).toBeInTheDocument();
  });

  it("asks only for the pending orders when the admin filters by Pendiente", async () => {
    answer([lauraOrder]);
    renderWithProviders(<OrdersPage />);

    await userEvent.click(screen.getByRole("button", { name: /Pendiente/ }));

    expect(mockedQuery).toHaveBeenCalledWith({
      status: "PENDING",
      search: undefined,
      page: 1,
      limit: ORDERS_PAGE_LIMIT,
    });
  });

  it("asks for the selected page when the admin clicks page 2", async () => {
    answer([lauraOrder], 25, 1, 3);
    renderWithProviders(<OrdersPage />);

    await userEvent.click(screen.getByRole("button", { name: "2" }));

    expect(mockedQuery).toHaveBeenCalledWith({
      status: undefined,
      search: undefined,
      page: 2,
      limit: ORDERS_PAGE_LIMIT,
    });
  });

  it("asks for the orders between two dates", async () => {
    // Dado: la página con pedidos
    answer([lauraOrder]);
    renderWithProviders(<OrdersPage />);

    // Cuando: el admin elige "desde" y "hasta"
    await userEvent.type(screen.getByLabelText("Desde"), "2026-11-01");
    await userEvent.type(screen.getByLabelText("Hasta"), "2026-11-15");

    // Entonces: la tabla pide los pedidos de esas fechas, desde la página 1
    expect(mockedQuery).toHaveBeenCalledWith({
      status: undefined,
      search: undefined,
      from: "2026-11-01",
      to: "2026-11-15",
      page: 1,
      limit: ORDERS_PAGE_LIMIT,
    });
  });

  it("shows how many orders each status tab has", () => {
    // Dado: la API responde que hay 4 pedidos (sirve para todas las pestañas)
    answer([lauraOrder], 4);

    // Cuando: se pinta la página
    renderWithProviders(<OrdersPage />);

    // Entonces: cada pestaña pide su propio número (limit 1) y lo muestra
    expect(mockedQuery).toHaveBeenCalledWith({
      status: "PENDING",
      search: undefined,
      page: 1,
      limit: 1,
    });
    expect(screen.getByRole("button", { name: /Pendiente\s*4/ })).toBeInTheDocument();
  });

  it("shows a message when there are no orders", () => {
    answer([]);

    renderWithProviders(<OrdersPage />);

    expect(screen.getByText("Todavía no hay pedidos")).toBeInTheDocument();
    expect(screen.queryByRole("table")).not.toBeInTheDocument();
  });
});
