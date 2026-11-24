// backoffice/src/features/orders/ordersApi.ts
import { api } from "../../app/api";

export type OrderStatus = "PENDING" | "SHIPPED" | "DELIVERED" | "CANCELLED";

// An order of the admin list, as GET /admin/orders returns it
export type AdminOrder = {
  id: string;
  orderDate: string; // JSON has no dates: it arrives as text
  status: OrderStatus;
  customerName: string;
  total: number;
};

const ordersApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // GET /admin/orders, or /admin/orders?status=PENDING with a status
    getAdminOrders: builder.query<AdminOrder[], OrderStatus | undefined>({
      query: (status) => (status ? `/admin/orders?status=${status}` : "/admin/orders"),
      providesTags: ["Order"],
    }),
  }),
});

export const { useGetAdminOrdersQuery } = ordersApi;
