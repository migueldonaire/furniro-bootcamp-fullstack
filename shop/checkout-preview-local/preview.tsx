import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { createMemoryRouter, RouterProvider } from "react-router";
import { makeStore } from "../src/app/store";
import { Layout } from "../src/components/layout/Layout";
import { CheckoutPage } from "../src/features/checkout/CheckoutPage";
import "../src/index.css";

const router = createMemoryRouter([
  { path: "/", element: <Layout />, children: [{ index: true, element: <CheckoutPage /> }] },
]);

createRoot(document.getElementById("root")!).render(
  <Provider store={makeStore()}>
    <RouterProvider router={router} />
  </Provider>,
);
