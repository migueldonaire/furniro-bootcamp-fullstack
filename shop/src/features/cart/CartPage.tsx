import styles from "./CartPage.module.css";
import trashCan from "../../assets/icons/trash-can.svg";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { formatEuro } from "../../lib/money";
import { itemAdded, selectCartTotals } from "./cartSlice";

export function CartPage() {
  const items = useAppSelector((state) => state.cart.items);
  const dispatch = useAppDispatch();
  const totals = useAppSelector(selectCartTotals);
  return (
    <>
      {/*This button is for testing functionality, needs to be removed*/}
      <section>
        {import.meta.env.DEV && (
          <button
            onClick={() =>
              dispatch(
                itemAdded({
                  productId: "d0000000-0000-4000-8000-000000000001",
                  name: "Silla Nora",
                  basePrice: 100,
                  taxRate: 21,
                  stock: 5,
                  imageUrl:
                    "https://raw.githubusercontent.com/migueldonaire/furniro-bootcamp-fullstack/main/database/images/silla-nora-1.jpg",
                  quantity: 1,
                }),
              )
            }
          >
            TEST: añadir Silla Nora
          </button>
        )}
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
                  <span>{line.quantity}</span>
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
