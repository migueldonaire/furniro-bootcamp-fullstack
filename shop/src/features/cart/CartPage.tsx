import pageBanner from "../../assets/images/page-banner.jpg";
import pageLogo from "../../assets/images/logo.png";
import trashCan from "../../assets/icons/trash-can.svg";
import styles from "./CartPage.module.css";

export function CartPage() {
  return (
    <>
      <section>
        <div className={styles.layout}>
          <aside className={styles.cart}>
            <div className={styles.specsProduct}>
              <h4>Product</h4>
              <h4>Price</h4>
              <h4>Quantity</h4>
              <h4>Subtotal</h4>
            </div>
            <div>
              //Aqui van las sections es decir las order line
              <section className={styles.layout}>
                <img className={styles.productImage}></img>
                <h4>Asgaard sofa</h4>
                <h4>Precio Euros</h4>
                <h4>1</h4>
                <h4>250</h4>
                <button>
                  <img src={trashCan} alt="trash-can" />
                </button>
              </section>
            </div>
          </aside>
          <aside className={styles.cartTotal}>
            <h1>Carts Totals</h1>
            <div>
              <h4>Subtotal</h4>
              <h4>25</h4>
            </div>
            <div>
              <h4>Total</h4>
              <h4>25</h4>
            </div>
            <button>Check Out</button>
          </aside>
        </div>
      </section>
    </>
  );
}
