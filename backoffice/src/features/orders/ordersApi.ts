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
};

const ordersApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAdminOrders: builder.query<PaginatedAdminOrders, AdminOrdersFilters>({
      query: (filters) => {
        const params = new URLSearchParams();

        if (filters?.status) {
          params.set("status", filters.status);
        }

        if (filters?.search) {
          params.set("search", filters.search);
        }

        if (filters?.page) {
          params.set("page", String(filters.page));
        }

        if (filters?.limit) {
          params.set("limit", String(filters.limit));
        }

        const queryString = params.toString();
        return queryString ? `/admin/orders?${queryString}` : "/admin/orders";
      },
      providesTags: ["Order"],
    }),
  }),
});

export const { useGetAdminOrdersQuery } = ordersApi;
