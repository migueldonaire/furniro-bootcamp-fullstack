import { Link, useParams } from "react-router";
import { formatEuro, priceWithTax } from "../../lib/money";
import { type OrderStatus, useGetAdminOrderQuery } from "./ordersApi";
import styles from "./OrderPage.module.css";

// Same texts and colors as the list (OrdersPage)
const STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING: "Pendiente",
  SHIPPED: "Enviado",
  DELIVERED: "Entregado",
  CANCELLED: "Cancelado",
};

const STATUS_BADGE_CLASSES: Record<OrderStatus, string> = {
  PENDING: styles.badgePending,
  SHIPPED: styles.badgeShipped,
  DELIVERED: styles.badgeDelivered,
  CANCELLED: styles.badgeCancelled,
};

const COUNTRY_NAMES: Record<string, string> = { ES: "España" };

// "2026-11-02T17:30:00Z" -> "02/11/2026 18:30"
function formatDateTime(isoDate: string) {
  const date = new Date(isoDate);
  const day = date.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  const time = date.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" });
  return `${day} ${time}`;
}

export function OrderPage() {
  const { orderId = "" } = useParams();
  const { data: order, isLoading, isError } = useGetAdminOrderQuery(orderId);

  if (isLoading) {
    return <p className={styles.feedback}>Cargando...</p>;
  }

  if (isError || !order) {
    return (
      <section className={styles.page}>
        <h1 className={styles.title}>Pedido no encontrado</h1>
        <Link to="/orders" className={styles.backButton}>
          Volver a pedidos
        </Link>
      </section>
    );
  }

  // The total comes from the API. Here only the breakdown: subtotal without VAT and the VAT
  const subtotal = order.lines.reduce((sum, line) => sum + line.unitPrice * line.quantity, 0);
  const vat = Math.round((order.total - order.shippingCost - subtotal) * 100) / 100;

  return (
    <section className={styles.page}>
      <header className={styles.header}>
        <div>
          <div className={styles.titleRow}>
            <h1 className={styles.title}>Detalle del pedido</h1>
            <span className={`${styles.badge} ${STATUS_BADGE_CLASSES[order.status]}`}>
              {STATUS_LABELS[order.status]}
            </span>
          </div>
          <div className={styles.meta}>
            <span>
              Fecha: <strong>{formatDateTime(order.orderDate)}</strong>
            </span>
            <span className={styles.orderNumber}>
              Nº de pedido: <code>{order.id}</code>
              <button
                type="button"
                className={styles.copyButton}
                aria-label="Copiar número de pedido"
                onClick={() => void navigator.clipboard.writeText(order.id)}
              >
                <svg className={styles.icon} viewBox="0 0 24 24" aria-hidden="true">
                  <rect x="9" y="9" width="11" height="11" rx="2" />
                  <path d="M5 15V5a2 2 0 0 1 2-2h8" />
                </svg>
              </button>
            </span>
          </div>
        </div>

        <Link to="/orders" className={styles.backButton}>
          ← Volver a pedidos
        </Link>
      </header>

      <div className={styles.layout}>
        <section className={styles.card} aria-labelledby="order-products">
          <h2 id="order-products" className={styles.cardTitle}>
            Productos del pedido
          </h2>

          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th scope="col">Producto</th>
                  <th scope="col">SKU</th>
                  <th scope="col">Cantidad</th>
                  <th scope="col">Precio sin IVA</th>
                  <th scope="col">IVA</th>
                  <th scope="col" className={styles.alignRight}>
                    Total línea
                  </th>
                </tr>
              </thead>
              <tbody>
                {order.lines.map((line) => (
                  <tr key={line.id}>
                    <td>
                      <div className={styles.product}>
                        {line.imageUrl ? (
                          <img src={line.imageUrl} alt="" className={styles.thumb} />
                        ) : (
                          <span className={styles.thumb} aria-hidden="true" />
                        )}
                        <span>{line.productName}</span>
                      </div>
                    </td>
                    <td>
                      <code className={styles.sku}>{line.sku}</code>
                    </td>
                    <td>{line.quantity}</td>
                    <td>{formatEuro(line.unitPrice)}</td>
                    <td>{line.taxRate} %</td>
                    <td className={`${styles.alignRight} ${styles.lineTotal}`}>
                      {formatEuro(priceWithTax(line.unitPrice * line.quantity, line.taxRate))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <dl className={styles.summary}>
            <dt>Subtotal sin IVA</dt>
            <dd>{formatEuro(subtotal)}</dd>
            <dt>IVA</dt>
            <dd>{formatEuro(vat)}</dd>
            <dt>Envío (IVA incluido)</dt>
            <dd>{formatEuro(order.shippingCost)}</dd>
            <dt className={styles.total}>Total</dt>
            <dd className={`${styles.total} ${styles.totalAmount}`}>{formatEuro(order.total)}</dd>
          </dl>

          <p className={styles.notice}>
            Los precios son los del momento de la compra. Si el producto cambia de precio, este
            pedido no cambia.
          </p>
        </section>

        <div className={styles.side}>
          <section className={styles.card} aria-labelledby="order-customer">
            <h2 id="order-customer" className={styles.cardTitle}>
              Cliente
            </h2>
            <dl className={styles.details}>
              <dt>Nombre</dt>
              <dd>{order.customer.name}</dd>
              <dt>Email</dt>
              <dd>{order.customer.email}</dd>
              <dt>Teléfono</dt>
              <dd>{order.customer.phone}</dd>
            </dl>
          </section>

          <section className={styles.card} aria-labelledby="order-address">
            <h2 id="order-address" className={styles.cardTitle}>
              Dirección de entrega
            </h2>
            <dl className={styles.details}>
              <dt>Recibe</dt>
              <dd>{order.address.fullName}</dd>
              <dt>Teléfono</dt>
              <dd>{order.address.phone}</dd>
              <dt>Dirección</dt>
              <dd>{order.address.street}</dd>
              <dt>Ciudad</dt>
              <dd>
                {order.address.postalCode} {order.address.city}
                {order.address.province ? ` (${order.address.province})` : ""}
              </dd>
              <dt>País</dt>
              <dd>{COUNTRY_NAMES[order.address.country] ?? order.address.country}</dd>
            </dl>
          </section>
        </div>
      </div>
    </section>
  );
}
