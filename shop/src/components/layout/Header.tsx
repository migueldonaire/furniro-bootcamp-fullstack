import { NavLink } from "react-router";
import { useAppSelector } from "../../app/hooks";
import { selectCartCount } from "../../features/cart/cartSlice";

// The menu. Cards C2 and C3 add the user name and the logout button.
export function Header() {
  const cartCount = useAppSelector(selectCartCount);
  return (
    <header className="header">
      <strong>Furniro</strong>
      <nav>
        <NavLink to="/" end>
          Catálogo
        </NavLink>
        <NavLink to="/cart">Carrito{cartCount > 0 ? ` (${cartCount})` : ""}</NavLink>
        <NavLink to="/my-orders">Mis pedidos</NavLink>
        <NavLink to="/login">Entrar</NavLink>
      </nav>
    </header>
  );
}
