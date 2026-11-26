import { NavLink } from "react-router";
import { useAppSelector } from "../../app/hooks";
import { selectCartCount } from "../../features/cart/cartSlice";

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
