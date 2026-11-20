import { Navigate, Outlet, useLocation } from "react-router";
import { useAppSelector } from "../../app/hooks";
import { useGetMeQuery } from "./authApi";

type ProtectedRouteProps = {
  role?: "ADMIN"; // optional: if it is set, the user needs that role
};

// Hiding pages is NOT security: the API must check the token and the role too
export function ProtectedRoute({ role }: ProtectedRouteProps) {
  const token = useAppSelector((state) => state.auth.token);
  const location = useLocation();
  // Without a token there is nobody to ask for: skip the request
  const { data: user, isLoading, isError } = useGetMeQuery(undefined, { skip: !token });

  if (!token || isError) {
    // No token, or the API says it is not valid (expired...): to the login
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }
  if (isLoading || !user) {
    return <p>Cargando...</p>;
  }
  if (role && user.role !== role) {
    return <p className="error">No tienes permiso para ver esta página.</p>;
  }
  return <Outlet />;
}
