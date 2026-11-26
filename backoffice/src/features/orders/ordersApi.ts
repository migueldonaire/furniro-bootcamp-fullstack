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

const ordersApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAdminOrders: builder.query<PaginatedAdminOrders, AdminOrdersFilters>({
      // RTK Query builds the ?status=...&page=... and skips the undefined values
      query: (filters) => ({ url: "/admin/orders", params: filters }),
      providesTags: ["Order"],
    }),
  }),
});

export const { useGetAdminOrdersQuery } = ordersApi;
