import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, it } from "vitest";
import { Provider } from "react-redux";
import { createMemoryRouter, RouterProvider } from "react-router";
import { makeStore } from "../../app/store";
import { ProtectedRoute } from "../auth/ProtectedRoute";
import { itemAdded } from "../cart/cartSlice";
import { CheckoutPage } from "./CheckoutPage";

it("shows the saved delivery address after submitting the form", async () => {
  const user = userEvent.setup();
  render(<CheckoutPage />);

  expect(screen.queryByRole("status")).not.toBeInTheDocument();

  await user.type(screen.getByLabelText("Nombre", { exact: true }), "Ana");
  await user.type(screen.getByLabelText("Apellidos"), "López");
  await user.type(screen.getByLabelText("Teléfono"), "611223344");
  await user.type(screen.getByLabelText("Calle y número"), "C/ Colón 10");
  await user.type(screen.getByLabelText("Ciudad"), "Valencia");
  await user.type(screen.getByLabelText("Código postal"), "46004");
  await user.click(screen.getByRole("button", { name: "Continuar" }));

  expect(await screen.findByRole("status")).toHaveTextContent(
    "Dirección guardada. Envío a Ana López, C/ Colón 10, 46004 Valencia.",
  );
});

it("redirects a visitor to login and keeps the products in the cart", async () => {
  const store = makeStore({ auth: { token: null } });
  store.dispatch(
    itemAdded({
      productId: "nora",
      productName: "Silla Nora",
      unitPrice: 100,
      taxRate: 21,
      imgURL: "/silla-nora.jpg",
      stock: 5,
      quantity: 2,
    }),
  );

  const router = createMemoryRouter(
    [
      {
        element: <ProtectedRoute />,
        children: [{ path: "/checkout", element: <CheckoutPage /> }],
      },
      { path: "/login", element: <h1>Iniciar sesión</h1> },
    ],
    { initialEntries: ["/checkout"] },
  );

  render(
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>,
  );

  expect(await screen.findByRole("heading", { name: "Iniciar sesión" })).toBeInTheDocument();
  expect(router.state.location.pathname).toBe("/login");
  expect(router.state.location.state).toEqual({ from: "/checkout" });
  expect(store.getState().cart.items).toMatchObject([{ productId: "nora", quantity: 2 }]);
});
