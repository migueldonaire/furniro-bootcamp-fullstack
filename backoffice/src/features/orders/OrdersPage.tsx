import { useState } from "react";
import { formatEuro } from "../../lib/money";
import { type OrderStatus, useGetAdminOrdersQuery } from "./ordersApi";
import "./OrdersPage.css";

const STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING: "Pendiente",
  SHIPPED: "Enviado",
  DELIVERED: "Entregado",
  CANCELLED: "Cancelado",
};

const STATUSES = Object.keys(STATUS_LABELS) as OrderStatus[];

export function OrdersPage() {
  const [status, setStatus] = useState<OrderStatus | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState("");

  const { data: orders, isLoading, isError } = useGetAdminOrdersQuery(status);

  const query = searchTerm.toLowerCase().trim();
  const filteredOrders = orders
    ? orders.filter((order) => {
        if (query === "") {
          return true;
        }

        const matchesOrder = order.id.toLowerCase().includes(query);
        const matchesCustomer =
          order.customerName.toLowerCase().includes(query) ||
          order.customerEmail.toLowerCase().includes(query);
        const matchesProduct = order.products.some((product) =>
          product.name.toLowerCase().includes(query),
        );

        return matchesOrder || matchesCustomer || matchesProduct;
      })
    : [];

  return (
    <section className="orders">
      <div className="orders__header">
        <div className="orders__heading">
          <h1 className="orders__title">Pedidos</h1>
          <p className="orders__subtitle">
            Gestiona los pedidos de los clientes, revisa los productos y consulta su estado.
          </p>
        </div>

        <div className="orders__search">
          <input
            type="search"
            className="orders__search-input"
            aria-label="Buscar por pedido, cliente o producto"
            placeholder="Buscar pedido, cliente o producto..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </div>
      </div>

      <div className="orders__tabs">
        <button
          type="button"
          className={`orders__tab orders__tab--all ${
            status === undefined ? "orders__tab--active" : ""
          }`}
          aria-pressed={status === undefined}
          onClick={() => setStatus(undefined)}
        >
          Todos
        </button>

        {STATUSES.map((option) => (
          <button
            key={option}
            type="button"
            className={`orders__tab orders__tab--${option.toLowerCase()} ${
              status === option ? "orders__tab--active" : ""
            }`}
            aria-pressed={status === option}
            onClick={() => setStatus(option)}
          >
            {STATUS_LABELS[option]}
          </button>
        ))}
      </div>

      {isLoading && <p className="orders__feedback">Cargando...</p>}
      {isError && (
        <p className="orders__feedback orders__feedback--error">
          No se han podido cargar los pedidos.
        </p>
      )}
      {orders?.length === 0 && <p className="orders__feedback">Todavía no hay pedidos</p>}

      {orders && orders.length > 0 && (
        <>
          {filteredOrders.length === 0 ? (
            <p className="orders__feedback">No hay pedidos que coincidan con tu búsqueda.</p>
          ) : (
            <div className="orders__table-wrapper">
              <table className="orders__table">
                <thead className="orders__table-head">
                  <tr className="orders__table-row">
                    <th scope="col" className="orders__table-header">
                      Pedido
                    </th>
                    <th scope="col" className="orders__table-header">
                      Cliente
                    </th>
                    <th scope="col" className="orders__table-header">
                      Fecha
                    </th>
                    <th scope="col" className="orders__table-header">
                      Productos
                    </th>
                    <th scope="col" className="orders__table-header">
                      Total
                    </th>
                    <th scope="col" className="orders__table-header">
                      Estado
                    </th>
                  </tr>
                </thead>
                <tbody className="orders__table-body">
                  {filteredOrders.map((order) => {
                    const orderDate = new Date(order.orderDate);

                    return (
                      <tr key={order.id} className="orders__table-row">
                        <td className="orders__table-cell orders__table-cell--id" title={order.id}>
                          #{order.id.slice(-6)}
                        </td>

                        <td className="orders__table-cell orders__table-cell--customer">
                          <div className="orders__customer-name">{order.customerName}</div>
                          <div className="orders__customer-email">{order.customerEmail}</div>
                        </td>

                        <td className="orders__table-cell orders__table-cell--date">
                          <div className="orders__date">
                            {orderDate.toLocaleDateString("es-ES")}
                          </div>
                          <div className="orders__time">
                            {orderDate.toLocaleTimeString("es-ES", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                        </td>

                        <td className="orders__table-cell orders__table-cell--products">
                          <div className="orders__products">
                            <div className="orders__thumbs">
                              {order.products.map((product) =>
                                product.imageUrl ? (
                                  <img
                                    key={product.id}
                                    src={product.imageUrl}
                                    alt={product.name}
                                    title={`${product.name} (x${product.quantity})`}
                                    className="orders__thumb"
                                  />
                                ) : null,
                              )}
                            </div>
                            <span className="orders__products-count">
                              {order.products.length}{" "}
                              {order.products.length === 1 ? "producto" : "productos"}
                            </span>
                          </div>
                        </td>

                        <td className="orders__table-cell orders__table-cell--total">
                          {formatEuro(order.total)}
                        </td>

                        <td className="orders__table-cell orders__table-cell--status">
                          <span
                            className={`orders__badge orders__badge--${order.status.toLowerCase()}`}
                          >
                            {STATUS_LABELS[order.status]}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          <div className="orders__footer">
            <span className="orders__count">
              Mostrando {filteredOrders.length} de {orders.length} pedidos
            </span>
          </div>
        </>
      )}
    </section>
  );
}
