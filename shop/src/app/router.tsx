import { createBrowserRouter } from "react-router";
import { Layout } from "../components/layout/Layout";
import { NotFoundPage } from "../components/layout/NotFoundPage";
import { ProtectedRoute } from "../features/auth/ProtectedRoute";
import { CatalogPage } from "../features/catalog/CatalogPage";
import { CategoryPage } from "../features/catalog/CategoryPage";
import { ProductPage } from "../features/catalog/ProductPage";
import { CartPage } from "../features/cart/CartPage";
import { LoginPage } from "../features/auth/LoginPage";
import { RegisterPage } from "../features/auth/RegisterPage";
import { CheckoutPage } from "../features/checkout/CheckoutPage";
import { PaymentPage } from "../features/checkout/PaymentPage";
import { MyOrdersPage } from "../features/myOrders/MyOrdersPage";
import { MyOrderPage } from "../features/myOrders/MyOrderPage";

// All the pages of the MVP are already here (as placeholders).
// Your card changes the page file, not this router.
export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <CatalogPage /> },
      { path: "categories/:categoryId", element: <CategoryPage /> },
      { path: "products/:productId", element: <ProductPage /> },
      { path: "cart", element: <CartPage /> },
      { path: "login", element: <LoginPage /> },
      { path: "register", element: <RegisterPage /> },
      {
        element: <ProtectedRoute />, // only logged-in users
        children: [
          { path: "checkout", element: <CheckoutPage /> },
          { path: "payment/:orderId", element: <PaymentPage /> },
          { path: "my-orders", element: <MyOrdersPage /> },
          { path: "my-orders/:orderId", element: <MyOrderPage /> },
        ],
      },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);
