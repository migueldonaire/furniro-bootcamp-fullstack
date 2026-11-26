import { useState, type ChangeEvent } from "react";
import styles from "./CartPage.module.css";
import trashCan from "../../assets/icons/trash-can.svg";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { formatEuro } from "../../lib/money";
import { quantityChanged, selectCartTotals, type CartItem } from "./cartSlice";

export function CartPage() {
  const items = useAppSelector((state) => state.cart.items);
  const totals = useAppSelector(selectCartTotals);
  return (
    <>
      <section>
        <div className={styles.layout}>
          <aside className={styles.cart}>
            <div className={styles.specsProduct}>
              <span />
              <h4>Producto</h4>
              <h4>Precio</h4>
              <h4>Cantidad</h4>
              <h4>Subtotal</h4>
              <span />
            </div>
            <div>
              {items.map((line) => (
                <section key={line.productId} className={styles.cartLine}>
                  <img className={styles.productImage} src={line.imageUrl} alt={line.name} />
                  <h4 className={styles.mutedText}>{line.name}</h4>
                  <h4 className={styles.mutedText}>{formatEuro(line.basePrice)}</h4>
                  <QuantityInput line={line} />
                  <h4>{formatEuro(line.basePrice * line.quantity)}</h4>
                  <button className={styles.removeButton}>
                    <img src={trashCan} alt="Quitar del carrito" />
                  </button>
                </section>
              ))}
              {items.length === 0 && <p className={styles.mutedText}>Tu carrito está vacío</p>}
            </div>
          </aside>
          <aside className={styles.cartTotal}>
            <h1>Total del carrito</h1>
            <div className={styles.totalRow}>
              <span>Subtotal</span>
              <span>{formatEuro(totals.subtotal)}</span>
            </div>
            <div className={styles.totalRow}>
              <span>IVA (21 %)</span>
              <span>{formatEuro(totals.vat)}</span>
            </div>
            <div className={styles.totalRow}>
              <span>Total</span>
              <span>{formatEuro(totals.total)}</span>
            </div>
            <button className={styles.checkoutButton}>Finalizar compra</button>
          </aside>
        </div>
      </section>
    </>
  );
}
function QuantityInput({ line }: { line: CartItem }) {
  const dispatch = useAppDispatch();
  const [error, setError] = useState<string | null>(null);
  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    if (event.target.value === "") return;
    const value = Number(event.target.value);
    if (!Number.isInteger(value) || value < 0) return;

    if (value > line.stock) {
      setError(`Solo quedan ${line.stock} unidades`);
      return;
    }
    setError(null);
    dispatch(quantityChanged({ productId: line.productId, quantity: value }));
  }
  return (
    <div>
      <input
        type="number"
        aria-label="Cantidad"
        className={styles.quantity}
        value={line.quantity}
        onChange={handleChange}
      />
      {error && <p role="alert">{error}</p>}
    </div>
  );
}
