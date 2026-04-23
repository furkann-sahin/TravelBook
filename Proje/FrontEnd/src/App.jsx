import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider, CssBaseline } from "@mui/material";
import theme from "./theme/theme";
import MainLayout from "./layouts/MainLayout";
import CompanyLayout from "./layouts/CompanyLayout";
import GuideLayout from "./layouts/GuideLayout";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import CompanyProfilePage from "./pages/CompanyProfilePage";
import CompanyDashboardPage from "./pages/CompanyDashboardPage";
import CompanyToursPage from "./pages/CompanyToursPage";
import CreateTourPage from "./pages/CreateTourPage";
import CompanyTourDetailPage from "./pages/CompanyTourDetailPage";
import CompanyGuidesPage from "./pages/CompanyGuidesPage";
import CompanyGuideDetailPage from "./pages/CompanyGuideDetailPage";
import GuideDashboardPage from "./pages/GuideDashboardPage";
import GuideCompaniesPage from "./pages/GuideCompaniesPage";
import GuideToursPage from "./pages/GuideToursPage";
import GuideMyCompaniesPage from "./pages/GuideMyCompaniesPage";
import GuideMyToursPage from "./pages/GuideMyToursPage";
import GuideProfilePage from "./pages/GuideProfilePage";
import UserProfilePage from "./pages/UserProfilePage";
import UserPurchasesPage from "./pages/UserPurchasesPage";
import ToursPage from "./pages/ToursPage";
import TourDetailPage from "./pages/TourDetailPage";
import UserTours from "./pages/UserTours";
import FavoritesList from "./pages/FavoritesList";
import GuideList from "./pages/GuideList";
import NotFoundPage from "./pages/NotFoundPage";
import { useAuth } from "./hooks/useAuth";
import ProtectedRoute from "./components/ProtectedRoute";

/* Picks role layout for authenticated panel users, MainLayout otherwise */
function AdaptiveLayout() {
  const { isAuthenticated, user } = useAuth();
  if (!isAuthenticated) return <MainLayout />;
  if (user?.role === "company") return <CompanyLayout />;
  if (user?.role === "guide") return <GuideLayout />;
  return <MainLayout />;
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
            <Route path="/user/tours/:tourId" element={<TourDetailPage />} />
            <Route
              path="/user/profile"
              element={
                <ProtectedRoute allowedRoles={["user"]}>
                  <UserProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/users/:userId/purchases"
              element={
                <ProtectedRoute allowedRoles={["user"]}>
                  <UserPurchasesPage />
                </ProtectedRoute>
              }
            />
            <Route path="/user/tours" element={<ToursPage />} />
            <Route path="/user/tours/mock" element={<UserTours />} />
            <Route
              path="/user/favorites"
              element={
                <ProtectedRoute allowedRoles={["user"]}>
                  <FavoritesList />
                </ProtectedRoute>
              }
            />
            <Route path="/guides" element={<GuideList />} />
          </Route>

          {/* Company panel – protected by CompanyLayout */}
          <Route
            path="/company"
            element={
              <ProtectedRoute allowedRoles={["company"]}>
                <CompanyLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<CompanyDashboardPage />} />
            <Route path="tours" element={<CompanyToursPage />} />
            <Route path="tours/create" element={<CreateTourPage />} />
            <Route path="tours/:tourId" element={<CompanyTourDetailPage />} />
            <Route path="guides" element={<CompanyGuidesPage />} />
            <Route
              path="guides/:guideId"
              element={<CompanyGuideDetailPage />}
            />
            <Route path="profile" element={<CompanyProfilePage />} />
          </Route>

          {/* Guide panel – protected by GuideLayout */}
          <Route
            path="/guide"
            element={
              <ProtectedRoute allowedRoles={["guide"]}>
                <GuideLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<GuideDashboardPage />} />
            <Route path="companies" element={<GuideCompaniesPage />} />
            <Route path="tours" element={<GuideToursPage />} />
            <Route path="my-companies" element={<GuideMyCompaniesPage />} />
            <Route path="my-tours" element={<GuideMyToursPage />} />
            <Route path="profile" element={<GuideProfilePage />} />
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
