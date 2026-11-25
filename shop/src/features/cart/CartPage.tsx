import trashCan from "../../assets/icons/trash-can.svg";
import styles from "./CartPage.module.css";
import { useState } from "react";

export function CartPage() {
  const [quantity, setQuantity] = useState(1);
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
              //Aqui van las sections es decir las order line
              <section className={styles.cartLine}>
                <img className={styles.productImage} src={trashCan}></img>
                <h4 className={styles.mutedText}>Asgaard sofa</h4>
                <h4 className={styles.mutedText}>Precio Euros</h4>
                <input
                  className={styles.quantity}
                  type="number"
                  min={1}
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))} // the input gives a string
                />
                <h4>250$</h4>
                <button className={styles.removeButton}>
                  <img src={trashCan} alt="trash-can" />
                </button>
              </section>
            </div>
          </aside>
          <aside className={styles.cartTotal}>
            <h1>Cart Totals</h1>
            <div className={styles.totalRow}>
              <h4>Subtotal</h4>
              <h4 className={styles.mutedText}>25$</h4>
            </div>
            <div className={styles.totalRow}>
              <h4>Total</h4>
              <h4 className={styles.totalAmount}>25$</h4>
            </div>
            <button className={styles.checkoutButton}>Check Out</button>
          </aside>
        </div>
      </section>
    </>
  );
}
