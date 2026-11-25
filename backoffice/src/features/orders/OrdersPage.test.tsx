import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderWithProviders } from "../../test/renderWithProviders";
import { OrdersPage } from "./OrdersPage";
import { type AdminOrder, useGetAdminOrdersQuery } from "./ordersApi";

// Fake hook: the tests decide what the "API" answers
vi.mock("./ordersApi", () => ({ useGetAdminOrdersQuery: vi.fn() }));
const mockedQuery = vi.mocked(useGetAdminOrdersQuery);

function answer(orders: AdminOrder[]) {
  mockedQuery.mockReturnValue({
    data: orders,
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

    await userEvent.click(screen.getByRole("button", { name: "Pendiente" }));

    expect(mockedQuery).toHaveBeenLastCalledWith("PENDING");
  });

  it("shows a message when there are no orders", () => {
    answer([]);

    renderWithProviders(<OrdersPage />);

    expect(screen.getByText("Todavía no hay pedidos")).toBeInTheDocument();
    expect(screen.queryByRole("table")).not.toBeInTheDocument();
  });
});
