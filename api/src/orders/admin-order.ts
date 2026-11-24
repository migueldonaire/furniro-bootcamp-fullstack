export type OrderStatus = 'PENDING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

// A row of the query, as pg returns it
export interface AdminOrderRow {
  id: string;
  order_date: Date;
  status: OrderStatus;
  customer_name: string;
  total: string; // NUMERIC arrives as text: "425.45"
}

// An order of the admin list, as the API returns it
export interface AdminOrder {
  id: string;
  orderDate: Date;
  status: OrderStatus;
  customerName: string;
  total: number;
}

export function toAdminOrder(row: AdminOrderRow): AdminOrder {
  return {
    id: row.id,
    orderDate: row.order_date,
    status: row.status,
    customerName: row.customer_name,
    total: Number(row.total),
  };
}
