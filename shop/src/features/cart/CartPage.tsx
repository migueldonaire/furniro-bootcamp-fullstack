import styles from "./CartPage.module.css";
import trashCan from "../../assets/icons/trash-can.svg";
import { useAppSelector } from "../../app/hooks";
import { formatEuro, priceWithTax } from "../../lib/money";

export function CartPage() {
  const items = useAppSelector((state) => state.cart.items);
  const subtotal = items.reduce((sum, line) => sum + line.basePrice * line.quantity, 0); // without VAT
  const total = items.reduce(
    (sum, line) => sum + priceWithTax(line.basePrice, line.taxRate) * line.quantity,
    0,
  );
  return (
    <>
      <section>
        <div className={styles.layout}>
          <aside className={styles.cart}>
            <div className={styles.specsProduct}>
              <span />
              <h4>Product</h4>
              <h4>Price</h4>
              <h4>Quantity</h4>
              <h4>Subtotal</h4>
              <span />
            </div>
            <div>
              {items.map((line) => (
                <section key={line.productId} className={styles.cartLine}>
                  <img className={styles.productImage} src={line.imageUrl} alt={line.name} />
                  <h4 className={styles.mutedText}>{line.name}</h4>
                  <h4 className={styles.mutedText}>
                    {formatEuro(priceWithTax(line.basePrice, line.taxRate))}
                  </h4>
                  <span>{line.quantity}</span>
                  <h4>{formatEuro(priceWithTax(line.basePrice, line.taxRate) * line.quantity)}</h4>
                  <button className={styles.removeButton}>
                    <img src={trashCan} alt="Quitar del carrito" />
                  </button>
                </section>
              ))}
            </div>
          </aside>
          <aside className={styles.cartTotal}>
            <h1>Total del carrito</h1>
            <div className={styles.totalRow}>
              <h4>Subtotal</h4>
              <h4 className={styles.mutedText}>{formatEuro(subtotal)}</h4>
            </div>
            <div className={styles.totalRow}>
              <h4>Total</h4>
              <h4 className={styles.totalAmount}>{formatEuro(total)}</h4>
            </div>
            <button className={styles.checkoutButton}>Finalizar compra</button>
          </aside>
        </div>
      </section>
    </>
  );
}
