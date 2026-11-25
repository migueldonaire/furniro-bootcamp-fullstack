import { api } from "../../app/api";

export type OrderStatus = "PENDING" | "SHIPPED" | "DELIVERED" | "CANCELLED";

// Producto que viene dentro de cada pedido desde GET /admin/orders
export type AdminOrderProduct = {
  id: string;
  name: string;
  quantity: number;
  imageUrl: string | null;
};

// Estructura completa de un pedido en el listado de administración
export type AdminOrder = {
  id: string;
  orderDate: string; // En JSON las fechas llegan como texto
  status: OrderStatus;
  customerName: string;
  customerEmail: string;
  total: number;
  products: AdminOrderProduct[];
};

const ordersApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // GET /admin/orders, o /admin/orders?status=PENDING si se selecciona un estado
    getAdminOrders: builder.query<AdminOrder[], OrderStatus | undefined>({
      query: (status) => (status ? `/admin/orders?status=${status}` : "/admin/orders"),
      providesTags: ["Order"],
    }),
  }),
});

export const { useGetAdminOrdersQuery } = ordersApi;
