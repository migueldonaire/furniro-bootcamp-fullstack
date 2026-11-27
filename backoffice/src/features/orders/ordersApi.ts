import { api } from "../../app/api";

export type OrderStatus = "PENDING" | "SHIPPED" | "DELIVERED" | "CANCELLED";

export type AdminOrderProduct = {
  id: string;
  name: string;
  quantity: number;
  imageUrl: string | null;
};

export type AdminOrder = {
  id: string;
  orderDate: string;
  status: OrderStatus;
  customerName: string;
  customerEmail: string;
  total: number;
  products: AdminOrderProduct[];
};

export type PaginatedAdminOrders = {
  items: AdminOrder[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type AdminOrdersFilters = {
  status?: OrderStatus;
  search?: string;
  page?: number;
  limit?: number;
  from?: string; // YYYY-MM-DD
  to?: string; // YYYY-MM-DD
};
export type AdminOrderLine = {
  id: string;
  productName: string;
  sku: string;
  quantity: number;
  unitPrice: number; // sin IVA
  taxRate: number;
};

export type AdminOrderDetail = {
  id: string;
  orderDate: string;
  status: OrderStatus;
  shippingCost: number;
  currency: string;
  customer: { name: string; email: string; phone: string };
  address: {
    fullName: string;
    street: string;
    city: string;
    province: string | null;
    postalCode: string;
    country: string;
  };
  lines: AdminOrderLine[];
  total: number;
};

const ordersApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAdminOrders: builder.query<PaginatedAdminOrders, AdminOrdersFilters>({
      // RTK Query builds the ?status=...&page=... and skips the undefined values
      query: (filters) => ({ url: "/admin/orders", params: filters }),
      providesTags: ["Order"],
    }),
    getAdminOrder: builder.query<AdminOrderDetail, string>({
      query: (orderId) => `/admin/orders/${orderId}`,
      providesTags: ["Order"],
    }),
  }),
});

export const { useGetAdminOrdersQuery, useGetAdminOrderQuery } = ordersApi;
