import { Outlet, useLocation, Navigate } from "react-router-dom";
import { Box } from "@mui/material";
import { useEffect } from "react";
import GuideNavbar from "../components/GuideNavbar";
import GuideFooter from "../components/GuideFooter";
import { useAuth } from "../hooks/useAuth";

export default function GuideLayout() {
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
  if (user?.role !== "guide") {
    return <Navigate to="/" replace />;
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <GuideNavbar />
      <Box component="main" sx={{ flexGrow: 1 }}>
        <Outlet />
      </Box>
      <GuideFooter />
    </Box>
  );
}
