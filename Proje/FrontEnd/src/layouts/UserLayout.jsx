import { Outlet, useLocation, Navigate } from "react-router-dom";
import { Box } from "@mui/material";
import { useEffect } from "react";
import UserNavbar from "../components/UserNavbar";
import Footer from "../components/Footer";
import { useAuth } from "../hooks/useAuth";
import { getDefaultRouteForRole } from "../utils/authRoutes";

export default function UserLayout() {
  const { pathname } = useLocation();
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== "user") {
    return <Navigate to={getDefaultRouteForRole(user?.role)} replace />;
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <UserNavbar />
      <Box component="main" sx={{ flexGrow: 1 }}>
        <Outlet />
      </Box>
      <Footer />
    </Box>
  );
}
