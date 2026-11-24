// backoffice/src/features/orders/OrdersPage.tsx
import { useState } from "react";
import { formatEuro } from "../../lib/money";
import { type OrderStatus, useGetAdminOrdersQuery } from "./ordersApi";

// What the admin sees for each status (texts for the user, in Spanish)
const STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING: "Pendiente",
  SHIPPED: "Enviado",
  DELIVERED: "Entregado",
  CANCELLED: "Cancelado",
};

const STATUSES = Object.keys(STATUS_LABELS) as OrderStatus[];

export function OrdersPage() {
  // undefined = no filter: every order
  const [status, setStatus] = useState<OrderStatus | undefined>(undefined);
  const { data: orders, isLoading, isError } = useGetAdminOrdersQuery(status);

  return (
    <section>
      <h1>Pedidos</h1>

      <div>
        <button
          type="button"
          aria-pressed={status === undefined}
          onClick={() => setStatus(undefined)}
        >
          Todos
        </button>
        {STATUSES.map((option) => (
          <button
            key={option}
            type="button"
            aria-pressed={status === option}
            onClick={() => setStatus(option)}
          >
            {STATUS_LABELS[option]}
          </button>
        ))}
      </div>

      {isLoading && <p>Cargando...</p>}
      {isError && <p className="error">No se han podido cargar los pedidos.</p>}
      {orders && orders.length === 0 && <p>Todavía no hay pedidos</p>}

      {orders && orders.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Cliente</th>
              <th>Estado</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{new Date(order.orderDate).toLocaleDateString("es-ES")}</td>
                <td>{order.customerName}</td>
                <td>{STATUS_LABELS[order.status]}</td>
                <td>{formatEuro(order.total)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}
