import { NavLink } from "react-router";

// The menu. Cards C2 and C3 add the user name and the logout button.
export function Header() {
  return (
    <header className="header">
      <strong>Furniro</strong>
      <nav>
        <NavLink to="/" end>
          Catálogo
        </NavLink>
        <NavLink to="/cart">Carrito</NavLink>
        <NavLink to="/my-orders">Mis pedidos</NavLink>
        <NavLink to="/login">Entrar</NavLink>
      </nav>
    </header>
  );
}
