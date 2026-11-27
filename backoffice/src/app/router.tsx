import { createBrowserRouter } from "react-router";
import { Layout } from "../components/layout/Layout";
import { NotFoundPage } from "../components/layout/NotFoundPage";
import { ProtectedRoute } from "../features/auth/ProtectedRoute";
import { LoginPage } from "../features/auth/LoginPage";
import { DashboardPage } from "../features/dashboard/DashboardPage";
import { ProductsPage } from "../features/products/ProductsPage";
import { NewProductPage } from "../features/products/NewProductPage";
import { EditProductPage } from "../features/products/EditProductPage";
import { OrdersPage } from "../features/orders/OrdersPage";
import { OrderPage } from "../features/orders/OrderPage";
import { CustomersPage } from "../features/customers/CustomersPage";
import { CustomerPage } from "../features/customers/CustomerPage";

// All the pages of the MVP are already here (as placeholders).
// Your card changes the page file, not this router.
export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        element: <ProtectedRoute role="ADMIN" />, // only ADMIN users
        children: [
          { index: true, element: <DashboardPage /> },
          { path: "products", element: <ProductsPage /> },
          { path: "products/new", element: <NewProductPage /> },
          { path: "products/:productId/edit", element: <EditProductPage /> },
          { path: "orders", element: <OrdersPage /> },
          { path: "orders/:orderId", element: <OrderPage /> },
          { path: "customers", element: <CustomersPage /> },
          { path: "customers/:userId", element: <CustomerPage /> },
        ],
      },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
  { path: "login", element: <LoginPage /> },
]);
