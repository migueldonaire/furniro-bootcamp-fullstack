import { NavLink } from "react-router";

// The menu. Cards C2 and C3 add the user name and the logout button.
export function Header() {
  return (
    <header className="header">
      <strong>Furniro Backoffice</strong>
      <nav>
        <NavLink to="/products">Productos</NavLink>
        <NavLink to="/orders">Pedidos</NavLink>
        <NavLink to="/customers">Clientes</NavLink>
        <NavLink to="/login">Entrar</NavLink>
      </nav>
    </header>
  );
}
