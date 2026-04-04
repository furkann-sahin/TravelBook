import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider, CssBaseline } from "@mui/material";
import theme from "./theme/theme";
import MainLayout from "./layouts/MainLayout";
import CompanyLayout from "./layouts/CompanyLayout";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import GuideDashboard from "./pages/GuideDashboard";
import CompanyProfilePage from "./pages/CompanyProfilePage";
import CompanyDashboardPage from "./pages/CompanyDashboardPage";
import CompanyToursPage from "./pages/CompanyToursPage";
import UserProfilePage from "./pages/UserProfilePage";
import UserPurchasesPage from "./pages/UserPurchasesPage";
import ToursPage from "./pages/ToursPage";
import TourDetailPage from "./pages/TourDetailPage";
import NotFoundPage from "./pages/NotFoundPage";

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          {/* Public pages */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/tours" element={<ToursPage />} />
            <Route path="/tours/:tourId" element={<TourDetailPage />} />
            <Route path="/user/profile" element={<UserProfilePage />} />
            <Route path="/users/:userId/purchases" element={<UserPurchasesPage />} />
          </Route>

          {/* Company panel – protected by CompanyLayout */}
          <Route path="/company" element={<CompanyLayout />}>
            <Route index element={<CompanyDashboardPage />} />
            <Route path="tours" element={<CompanyToursPage />} />
            <Route path="profile" element={<CompanyProfilePage />} />
          </Route>

          {/* Auth pages */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/guide/dashboard" element={<GuideDashboard />} />

          {/* 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
