// Placeholder page. Card(s): B7, B8
// Replace this content with your card. Keep the name of the component.
import { Link, useParams } from "react-router";
import { formatEuro } from "../../lib/money";
import { useGetAdminOrderQuery } from "./ordersApi";
import styles from "./OrderPage.module.css";

export function OrderPage() {
  const { orderId = "" } = useParams();
  const { data: order, isLoading, isError } = useGetAdminOrderQuery(orderId);

  if (isLoading) {
    return <p>Cargando...</p>;
  }

  if (isError || !order) {
    return (
      <section className={styles.page}>
        <h1>Pedido no encontrado</h1>
        <Link to="/orders">Volver a pedidos</Link>
      </section>
    );
  }

  return (
    <section className={styles.page}>
      <h1>Pedido {order.id}</h1>

      <h2>Cliente</h2>
      <p>{order.customer.name}</p>
      <p>{order.customer.email}</p>
      <p>{order.customer.phone}</p>

      <h2>Productos</h2>
      <table>
        <thead>
          <tr>
            <th scope="col">Producto</th>
            <th scope="col">SKU</th>
            <th scope="col">Cantidad</th>
            <th scope="col">Precio sin IVA</th>
          </tr>
        </thead>
        <tbody>
          {order.lines.map((line) => (
            <tr key={line.id}>
              <td>{line.productName}</td>
              <td>{line.sku}</td>
              <td>{line.quantity}</td>
              <td>{formatEuro(line.unitPrice)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Dirección de entrega</h2>
      <p>{order.address.fullName}</p>
      <p>{order.address.street}</p>
      <p>
        {order.address.postalCode} {order.address.city}
      </p>
      {order.address.province && <p>{order.address.province}</p>}

      <p>Envío: {formatEuro(order.shippingCost)}</p>
      <p>Total: {formatEuro(order.total)}</p>
    </section>
  );
}
