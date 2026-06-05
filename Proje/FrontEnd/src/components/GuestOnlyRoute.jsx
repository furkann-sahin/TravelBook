import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { getDefaultRouteForRole } from "../utils/authRoutes";

export default function GuestOnlyRoute({ children }) {
  const { isAuthenticated, user } = useAuth();

  if (isAuthenticated && user) {
    return <Navigate to={getDefaultRouteForRole(user.role)} replace />;
  }

  return children;
}
