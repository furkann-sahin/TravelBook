import { Outlet, useLocation, Navigate } from "react-router-dom";
import { Box } from "@mui/material";
import { useEffect } from "react";
import CompanyNavbar from "../components/CompanyNavbar";
import CompanyFooter from "../components/CompanyFooter";
import { useAuth } from "../hooks/useAuth";
import { getDefaultRouteForRole } from "../utils/authRoutes";

export default function CompanyLayout() {
  const { pathname } = useLocation();
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  // Not logged in → send to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Logged in but wrong role → send to home
  if (user?.role !== "company") {
    return <Navigate to={getDefaultRouteForRole(user?.role)} replace />;
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <CompanyNavbar />
      <Box component="main" sx={{ flexGrow: 1 }}>
        <Outlet />
      </Box>
      <CompanyFooter />
    </Box>
  );
}
