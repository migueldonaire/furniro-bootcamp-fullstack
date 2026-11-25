export type OrderStatus = "PENDING" | "SHIPPED" | "DELIVERED" | "CANCELLED";

// Producto resumido que viene dentro de cada pedido
export interface AdminOrderProduct {
  id: string;
  name: string;
  quantity: number;
  imageUrl: string | null;
}

// Fila tal cual la devuelve PostgreSQL
export interface AdminOrderRow {
  id: string;
  order_date: Date;
  status: OrderStatus;
  customer_name: string;
  customer_email: string;
  total: string; // NUMERIC llega como texto desde pg
  products: AdminOrderProduct[];
}

// Pedido ya formateado como lo devuelve la API al backoffice
export interface AdminOrder {
  id: string;
  orderDate: Date;
  status: OrderStatus;
  customerName: string;
  customerEmail: string;
  total: number;
  products: AdminOrderProduct[];
}

export function toAdminOrder(row: AdminOrderRow): AdminOrder {
  return {
    id: row.id,
    orderDate: row.order_date,
    status: row.status,
    customerName: row.customer_name,
    customerEmail: row.customer_email,
    total: Number(row.total),
    products: row.products ?? [],
  };
}
