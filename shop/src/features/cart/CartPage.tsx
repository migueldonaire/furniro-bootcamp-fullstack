import pageBanner from "../../assets/images/page-banner.jpg";
import pageLogo from "../../assets/images/logo.png";

export function CartPage() {
  return (
    <>
      <section>
        <div>
          <img src={pageBanner} alt="page-banner" />
          <img src={pageLogo} alt="page-logo" />
          <h1>Cart</h1>
          <h4>Home {">"} Cart</h4>
        </div>
      </section>
      <section>
        <div>
          <aside>
            <div>
              <h4>Product</h4>
              <h4>Price</h4>
              <h4>Quantity</h4>
              <h4>Subtotal</h4>
            </div>
            <div>
              //Aqui van las sections es decir las order line
              <section>
                <img></img>
                <h4>Asgaard sofa</h4>
                <h4>Precio Euros</h4>
                <h4>1</h4>
                <h4>250</h4>
                <button>
                  <img src={pageLogo} alt="trash-can" />
                </button>
              </section>
            </div>
          </aside>
          <aside>
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
      <section>
        <div>
          <img src={pageLogo} alt="trophy" />
          <h1>High Quality</h1>
          <h4>crafted from top materials</h4>
        </div>
        <div>
          <img src={pageLogo} alt="trash-can" />
          <h1>Warranty Protection</h1>
          <h4>Over 2 years</h4>
        </div>
        <div>
          <img src={pageLogo} alt="trash-can" />
          <h1>Free Shiping</h1>
          <h4>Order over 150 $</h4>
        </div>
        <div>
          <img src={pageLogo} alt="trash-can" />
          <h1>24 / 7 Support</h1>
          <h4>Dedicated support</h4>
        </div>
      </section>
    </>
  );
}
