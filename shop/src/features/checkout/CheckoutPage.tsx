import { useState } from "react";
import { HeaderBreadcrumb } from "../../components/layout/Header-BreadCrumb";
import { AddressForm } from "./AddressForm";
import type { Address } from "./addressSchema";
import styles from "./CheckoutPage.module.css";

const examplePrice = "250,00 €";
const breadcrumbs = [{ label: "Inicio", to: "/" }, { label: "Finalizar compra" }];

export function CheckoutPage() {
  const [address, setAddress] = useState<Address | null>(null);

  return (
    <section className={styles.checkout}>
      <HeaderBreadcrumb title="Finalizar compra" breadcrumbs={breadcrumbs} />

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
                <td>
                  <span>Sofá Asgaard</span> × 1
                </td>
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
            <p>
              <input
                type="radio"
                defaultChecked
                disabled
                aria-label="Transferencia bancaria seleccionada"
              />{" "}
              Transferencia bancaria
            </p>
            <p className={styles.paymentNote}>
              Realiza el pago en nuestra cuenta bancaria. Usa el número del pedido como referencia.
              Enviaremos el pedido cuando recibamos el pago.
            </p>
            <p className={styles.paymentNote}>
              <input type="radio" disabled aria-label="Transferencia bancaria" /> Transferencia
              bancaria
            </p>
            <p className={styles.paymentNote}>
              <input type="radio" disabled aria-label="Pago contra reembolso" /> Pago contra
              reembolso
            </p>
            <p>
              Utilizaremos tus datos personales para gestionar tu cuenta y mejorar tu experiencia en
              la tienda, tal como se explica en nuestra <strong>política de privacidad</strong>.
            </p>

            <button type="button" disabled>
              Realizar pedido
            </button>
          </div>
        </aside>
      </div>
    </section>
  );
}
