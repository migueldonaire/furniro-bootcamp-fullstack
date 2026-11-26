import { useState } from "react";
import checkoutLogo from "../../assets/images/logo.png";
import { AddressForm } from "./AddressForm";
import type { Address } from "./addressSchema";
import styles from "./CheckoutPage.module.css";

const examplePrice = "250,00 €";

export function CheckoutPage() {
  const [address, setAddress] = useState<Address | null>(null);

  return (
    <section>
      <div className={styles.banner}>
        <img className={styles.bannerLogo} src={checkoutLogo} alt="" />
        <h1>Finalizar compra</h1>
        <nav aria-label="Ruta de navegación">
          <a href="/">Inicio</a>
          <span aria-hidden="true"> › </span>
          <span aria-current="page">Finalizar compra</span>
        </nav>
      </div>

      <div className={styles.columns}>
        <div className={styles.delivery}>
          <h2>Dirección de entrega</h2>
          <AddressForm onSubmit={setAddress} />
          {address && (
            <p role="status">
              Dirección guardada. Envío a {address.firstName} {address.lastName}, {address.street},{" "}
              {address.postalCode} {address.city}.
            </p>
          )}
        </div>

        <aside aria-label="Resumen del pedido de ejemplo">
          <table className={styles.totals}>
            <thead>
              <tr>
                <th scope="col">Producto</th>
                <th scope="col">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Sofá Asgaard × 1</td>
                <td>{examplePrice}</td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <th scope="row">Subtotal</th>
                <td>{examplePrice}</td>
              </tr>
              <tr>
                <th scope="row">Total</th>
                <td className={styles.total}>{examplePrice}</td>
              </tr>
            </tfoot>
          </table>

          <div className={styles.payment}>
            <p>Métodos de pago de ejemplo</p>
            <ul>
              <li>Transferencia bancaria</li>
              <li>Pago contra reembolso</li>
            </ul>

            <button type="button" disabled>
              Realizar pedido
            </button>
          </div>
        </aside>
      </div>
    </section>
  );
}
