import { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider, CssBaseline, Box, CircularProgress } from "@mui/material";
import theme from "./theme/theme";
import ProtectedRoute from "./components/ProtectedRoute";
import GuestOnlyRoute from "./components/GuestOnlyRoute";

const MainLayout = lazy(() => import("./layouts/MainLayout"));
const UserLayout = lazy(() => import("./layouts/UserLayout"));
const CompanyLayout = lazy(() => import("./layouts/CompanyLayout"));
const GuideLayout = lazy(() => import("./layouts/GuideLayout"));

const HomePage = lazy(() => import("./pages/HomePage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const RegisterPage = lazy(() => import("./pages/RegisterPage"));
const UserHomePage = lazy(() => import("./pages/UserHomePage"));
const UserDashboardPage = lazy(() => import("./pages/UserDashboardPage"));
const CompanyHomePage = lazy(() => import("./pages/CompanyHomePage"));
const CompanyProfilePage = lazy(() => import("./pages/CompanyProfilePage"));
const CompanyDashboardPage = lazy(() => import("./pages/CompanyDashboardPage"));
const CompanyToursPage = lazy(() => import("./pages/CompanyToursPage"));
const CreateTourPage = lazy(() => import("./pages/CreateTourPage"));
const CompanyTourDetailPage = lazy(() => import("./pages/CompanyTourDetailPage"));
const CompanyGuidesPage = lazy(() => import("./pages/CompanyGuidesPage"));
const CompanyGuideDetailPage = lazy(() => import("./pages/CompanyGuideDetailPage"));
const GuideHomePage = lazy(() => import("./pages/GuideHomePage"));
const GuideDashboardPage = lazy(() => import("./pages/GuideDashboardPage"));
const GuideCompaniesPage = lazy(() => import("./pages/GuideCompaniesPage"));
const GuideMyCompaniesPage = lazy(() => import("./pages/GuideMyCompaniesPage"));
const GuideMyToursPage = lazy(() => import("./pages/GuideMyToursPage"));
const GuideProfilePage = lazy(() => import("./pages/GuideProfilePage"));
const UserProfilePage = lazy(() => import("./pages/UserProfilePage"));
const UserPurchasesPage = lazy(() => import("./pages/UserPurchasesPage"));
const ToursPage = lazy(() => import("./pages/ToursPage"));
const TourDetailPage = lazy(() => import("./pages/TourDetailPage"));
const FavoritesList = lazy(() => import("./pages/FavoritesList"));
const GuideList = lazy(() => import("./pages/GuideList"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));

function RouteLoader() {
  return (
    <Box
      sx={{
        minHeight: "50vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <CircularProgress size={32} />
    </Box>
  );
}

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Suspense fallback={<RouteLoader />}>
          <Routes>
            {/* Public pages */}
            <Route element={<MainLayout />}>
              <Route
                path="/"
                element={
                  <GuestOnlyRoute>
                    <HomePage />
                  </GuestOnlyRoute>
                }
              />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/guides" element={<GuideList />} />
            </Route>

            {/* User app */}
            <Route path="/user" element={<UserLayout />}>
              <Route index element={<UserHomePage />} />
              <Route path="dashboard" element={<UserDashboardPage />} />
              <Route path="tours" element={<ToursPage />} />
              <Route path="tours/:tourId" element={<TourDetailPage />} />
              <Route path="favorites" element={<FavoritesList />} />
              <Route path="profile" element={<UserProfilePage />} />
              <Route path="purchases" element={<UserPurchasesPage />} />
            </Route>

            {/* Legacy user purchases URL */}
            <Route
              path="/users/:userId/purchases"
              element={
                <ProtectedRoute allowedRoles={["user"]}>
                  <Navigate to="/user/purchases" replace />
                </ProtectedRoute>
              }
            />

            {/* Company app */}
            <Route path="/company" element={<CompanyLayout />}>
              <Route index element={<CompanyHomePage />} />
              <Route path="dashboard" element={<CompanyDashboardPage />} />
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

            {/* Guide app */}
            <Route path="/guide" element={<GuideLayout />}>
              <Route index element={<GuideHomePage />} />
              <Route path="dashboard" element={<GuideDashboardPage />} />
              <Route path="companies" element={<GuideCompaniesPage />} />
              <Route
                path="tours"
                element={<Navigate to="/guide/my-tours" replace />}
              />
              <Route path="my-companies" element={<GuideMyCompaniesPage />} />
              <Route path="my-tours" element={<GuideMyToursPage />} />
              <Route path="profile" element={<GuideProfilePage />} />
            </Route>

            {/* Auth pages */}
            <Route
              path="/login"
              element={
                <GuestOnlyRoute>
                  <LoginPage />
                </GuestOnlyRoute>
              }
            />
            <Route
              path="/register"
              element={
                <GuestOnlyRoute>
                  <RegisterPage />
                </GuestOnlyRoute>
              }
            />

            {/* 404 */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ThemeProvider>
  );
}
