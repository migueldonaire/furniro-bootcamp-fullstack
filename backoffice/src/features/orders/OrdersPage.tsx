import { useEffect, useState } from "react";
import { Pagination } from "../../components/layout/Pagination/Pagination";
import { formatEuro } from "../../lib/money";
import { type OrderStatus, useGetAdminOrdersQuery } from "./ordersApi";
import styles from "./OrdersPage.module.css";

const STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING: "Pendiente",
  SHIPPED: "Enviado",
  DELIVERED: "Entregado",
  CANCELLED: "Cancelado",
};

const STATUS_TAB_CLASSES: Record<OrderStatus, string> = {
  PENDING: styles.tabPending,
  SHIPPED: styles.tabShipped,
  DELIVERED: styles.tabDelivered,
  CANCELLED: styles.tabCancelled,
};

const STATUS_BADGE_CLASSES: Record<OrderStatus, string> = {
  PENDING: styles.badgePending,
  SHIPPED: styles.badgeShipped,
  DELIVERED: styles.badgeDelivered,
  CANCELLED: styles.badgeCancelled,
};

const STATUSES = Object.keys(STATUS_LABELS) as OrderStatus[];
const ORDERS_PER_PAGE = 10;
const COLUMNS = ["Pedido", "Cliente", "Fecha", "Productos", "Total", "Estado"];

type StatusCountProps = {
  status?: OrderStatus;
  search?: string;
  from?: string;
  to?: string;
};

function StatusCount({ status, search, from, to }: Readonly<StatusCountProps>) {
  const { data } = useGetAdminOrdersQuery({ status, search, from, to, page: 1, limit: 1 });

  if (data === undefined) return null;

  return <span className={styles.tabCount}>{data.total}</span>;
}

export function OrdersPage() {
  const [status, setStatus] = useState<OrderStatus | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  useEffect(() => {
    const trimmed = searchTerm.trim();
    if (trimmed === debouncedSearch) return;

    const timer = setTimeout(() => {
      setDebouncedSearch(trimmed);
      setPage(1);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, debouncedSearch]);

  function handleStatusChange(newStatus: OrderStatus | undefined) {
    setStatus(newStatus);
    setPage(1);
  }

  function handleDateChange(setDate: (value: string) => void, value: string) {
    setDate(value);
    setPage(1);
  }

  // Filters shared by the table and the numbers of the tabs ("" becomes undefined)
  const filters = {
    search: debouncedSearch || undefined,
    from: from || undefined,
    to: to || undefined,
  };

  const { data, isLoading, isError } = useGetAdminOrdersQuery({
    ...filters,
    status,
    page,
    limit: ORDERS_PER_PAGE,
  });

  const orders = data?.items;
  const total = data?.total ?? 0;
  const totalPages = data?.totalPages ?? 1;
  // Position of the first order of this page (page 2 with 10 per page -> 11)
  const firstShown = (page - 1) * ORDERS_PER_PAGE + 1;
  const hasSearch = debouncedSearch !== "";

  return (
    <section className={styles.orders}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Pedidos</h1>
          <p className={styles.subtitle}>
            Gestiona los pedidos de los clientes, revisa los productos y consulta su estado.
          </p>
        </div>

        <div className={styles.filters}>
          <div className={styles.search}>
            <svg className={styles.icon} viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-4-4" />
            </svg>
            <input
              type="search"
              className={styles.searchInput}
              aria-label="Buscar por pedido, cliente o producto"
              placeholder="Buscar pedido, cliente o producto..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </div>

          <div className={styles.dates}>
            <svg className={styles.icon} viewBox="0 0 24 24" aria-hidden="true">
              <rect x="3" y="5" width="18" height="16" rx="2" />
              <path d="M3 10h18M8 3v4M16 3v4" />
            </svg>
            <input
              type="date"
              className={styles.dateInput}
              aria-label="Desde"
              value={from}
              max={to || undefined}
              onClick={(event) => event.currentTarget.showPicker?.()}
              onChange={(event) => handleDateChange(setFrom, event.target.value)}
            />
            <span aria-hidden="true">-</span>
            <input
              type="date"
              className={styles.dateInput}
              aria-label="Hasta"
              value={to}
              min={from || undefined}
              onClick={(event) => event.currentTarget.showPicker?.()}
              onChange={(event) => handleDateChange(setTo, event.target.value)}
            />
          </div>
        </div>
      </div>

      <div className={styles.tabs}>
        <button
          type="button"
          className={`${styles.tab} ${status === undefined ? styles.tabActive : ""}`}
          aria-pressed={status === undefined}
          onClick={() => handleStatusChange(undefined)}
        >
          Todos
          <StatusCount {...filters} />
        </button>

        {STATUSES.map((option) => (
          <button
            key={option}
            type="button"
            className={`${styles.tab} ${STATUS_TAB_CLASSES[option]} ${
              status === option ? styles.tabActive : ""
            }`}
            aria-pressed={status === option}
            onClick={() => handleStatusChange(option)}
          >
            {STATUS_LABELS[option]}
            <StatusCount {...filters} status={option} />
          </button>
        ))}
      </div>

      {isLoading && <p className={styles.feedback}>Cargando...</p>}
      {isError && (
        <p className={`${styles.feedback} ${styles.feedbackError}`}>
          No se han podido cargar los pedidos.
        </p>
      )}

      {orders?.length === 0 && (
        <p className={styles.feedback}>
          {hasSearch ? "No hay pedidos que coincidan con tu búsqueda." : "Todavía no hay pedidos"}
        </p>
      )}

      {orders && orders.length > 0 && (
        <>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead className={styles.tableHead}>
                <tr className={styles.tableRow}>
                  {COLUMNS.map((column) => (
                    <th key={column} scope="col" className={styles.tableHeader}>
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className={styles.tableBody}>
                {orders.map((order) => {
                  const orderDate = new Date(order.orderDate);

                  return (
                    <tr key={order.id} className={styles.tableRow}>
                      <td className={`${styles.tableCell} ${styles.cellId}`} title={order.id}>
                        #{order.id.slice(-6)}
                      </td>

                      <td className={`${styles.tableCell} ${styles.cellCustomer}`}>
                        <div className={styles.customerName}>{order.customerName}</div>
                        <div className={styles.customerEmail}>{order.customerEmail}</div>
                      </td>

                      <td className={`${styles.tableCell} ${styles.cellDate}`}>
                        <div className={styles.date}>{orderDate.toLocaleDateString("es-ES")}</div>
                        <div className={styles.time}>
                          {orderDate.toLocaleTimeString("es-ES", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </td>

                      <td className={`${styles.tableCell} ${styles.cellProducts}`}>
                        <div className={styles.products}>
                          <div className={styles.thumbs}>
                            {order.products.map((product) =>
                              product.imageUrl ? (
                                <img
                                  key={product.id}
                                  src={product.imageUrl}
                                  alt={product.name}
                                  title={`${product.name} (x${product.quantity})`}
                                  className={styles.thumb}
                                />
                              ) : null,
                            )}
                          </div>
                          <span className={styles.productsCount}>
                            {order.products.length}{" "}
                            {order.products.length === 1 ? "producto" : "productos"}
                          </span>
                        </div>
                      </td>

                      <td className={`${styles.tableCell} ${styles.cellTotal}`}>
                        {formatEuro(order.total)}
                      </td>

                      <td className={`${styles.tableCell} ${styles.cellStatus}`}>
                        <span className={`${styles.badge} ${STATUS_BADGE_CLASSES[order.status]}`}>
                          {STATUS_LABELS[order.status]}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className={styles.footer}>
            <span>
              Mostrando {firstShown}–{firstShown + orders.length - 1} de {total}{" "}
              {total === 1 ? "pedido" : "pedidos"}
            </span>

            <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
          </div>
        </>
      )}
    </section>
  );
}
