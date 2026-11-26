import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderWithProviders } from "../../test/renderWithProviders";
import { OrdersPage } from "./OrdersPage";
import { type AdminOrder, useGetAdminOrdersQuery } from "./ordersApi";

vi.mock("./ordersApi", () => ({ useGetAdminOrdersQuery: vi.fn() }));
const mockedQuery = vi.mocked(useGetAdminOrdersQuery);

function answer(orders: AdminOrder[], total = orders.length, page = 1, totalPages = 1) {
  mockedQuery.mockReturnValue({
    data: {
      items: orders,
      total,
      page,
      limit: 10,
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
      limit: 10,
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
      limit: 10,
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
      limit: 10,
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
