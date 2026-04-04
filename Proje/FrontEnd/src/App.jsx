import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider, CssBaseline } from "@mui/material";
import theme from "./theme/theme";
import MainLayout from "./layouts/MainLayout";
import CompanyLayout from "./layouts/CompanyLayout";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import CompanyProfilePage from "./pages/CompanyProfilePage";
import CompanyDashboardPage from "./pages/CompanyDashboardPage";
import CompanyToursPage from "./pages/CompanyToursPage";
import CreateTourPage from "./pages/CreateTourPage";
import NotFoundPage from "./pages/NotFoundPage";
import { useAuth } from "./hooks/useAuth";

/* Picks CompanyLayout for company users, MainLayout for everyone else */
function AdaptiveLayout() {
  const { isAuthenticated, user } = useAuth();
  return isAuthenticated && user?.role === "company" ? <CompanyLayout /> : <MainLayout />;
}

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          {/* Public pages – layout adapts to user role */}
          <Route element={<AdaptiveLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
          </Route>

          {/* Company panel – protected by CompanyLayout */}
          <Route path="/company" element={<CompanyLayout />}>
            <Route index element={<CompanyDashboardPage />} />
            <Route path="tours" element={<CompanyToursPage />} />
            <Route path="tours/create" element={<CreateTourPage />} />
            <Route path="profile" element={<CompanyProfilePage />} />
          </Route>

          {/* Auth pages */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
