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

export interface AdminOrderDetailRow {
  id: string;
  order_date: Date;
  status: OrderStatus;
  shipping_cost: string;
  currency: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  full_name: string;
  address_phone: string;
  street: string;
  city: string;
  province: string | null;
  postal_code: string;
  country: string;
}

export interface AdminOrderLineRow {
  id: string;
  product_name: string;
  sku: string;
  quantity: number;
  unit_price: string;
  tax_rate: string;
  image_url: string | null;
}

export interface AdminOrderLine {
  id: string;
  productName: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  taxRate: number;
  imageUrl: string | null;
}

export interface AdminOrderDetail {
  id: string;
  orderDate: Date;
  status: OrderStatus;
  shippingCost: number;
  currency: string;
  customer: { name: string; email: string; phone: string };
  address: {
    fullName: string;
    phone: string;
    street: string;
    city: string;
    province: string | null;
    postalCode: string;
    country: string;
  };
  lines: AdminOrderLine[];
  total: number;
}

export function toAdminOrderDetail(
  row: AdminOrderDetailRow,
  lineRows: AdminOrderLineRow[],
): AdminOrderDetail {
  const lines = lineRows.map((line) => ({
    id: line.id,
    productName: line.product_name,
    sku: line.sku,
    quantity: line.quantity,
    unitPrice: Number(line.unit_price),
    taxRate: Number(line.tax_rate),
    imageUrl: line.image_url,
  }));

  const shippingCost = Number(row.shipping_cost);
  const linesTotal = lines.reduce(
    (sum, line) => sum + line.unitPrice * line.quantity * (1 + line.taxRate / 100),
    0,
  );
  const total = Math.round((linesTotal + shippingCost) * 100) / 100;

  return {
    id: row.id,
    orderDate: row.order_date,
    status: row.status,
    shippingCost,
    currency: row.currency,
    customer: {
      name: row.customer_name,
      email: row.customer_email,
      phone: row.customer_phone,
    },
    address: {
      fullName: row.full_name,
      phone: row.address_phone,
      street: row.street,
      city: row.city,
      province: row.province,
      postalCode: row.postal_code,
      country: row.country,
    },
    lines,
    total,
  };
}
