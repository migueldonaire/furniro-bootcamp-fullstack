import { Navigate, Outlet, useLocation } from "react-router";
import { useAppSelector } from "../../app/hooks";

type ProtectedRouteProps = {
  role?: "ADMIN"; // optional: if it is set, the user needs that role
};

// Hiding pages is NOT security: the API must check the token and the role too
export function ProtectedRoute({ role }: ProtectedRouteProps) {
  const user = useAppSelector((state) => state.auth.user);
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }
  if (role && user.role !== role) {
    return <p className="error">No tienes permiso para ver esta página.</p>;
  }
  return <Outlet />;
}
