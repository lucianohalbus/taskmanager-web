import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "./useAuth";
import { isTokenValid } from "./jwt";

export default function ProtectedRoute() {
  const { isAuthenticated, token } = useAuth();
  const location = useLocation();

  const lsToken = typeof window !== "undefined" ? localStorage.getItem("tm_token") : null;
  const ok = isAuthenticated || isTokenValid(token) || isTokenValid(lsToken);

  if (!ok) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname + location.search }}
      />
    );
  }

  return <Outlet />;
}
