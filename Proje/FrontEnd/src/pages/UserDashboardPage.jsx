import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Grid,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import HistoryIcon from "@mui/icons-material/History";
import ExploreIcon from "@mui/icons-material/Explore";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import PersonIcon from "@mui/icons-material/Person";

import { favoriteApi, tourApi, userApi } from "../services/api";
import TourCard from "../components/TourCard";
import { useAuth } from "../hooks/useAuth";
import { getErrorMessage } from "../utils/getErrorMessage";

export default function UserDashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [summary, setSummary] = useState({
    favoriteCount: 0,
    upcomingCount: 0,
    pastCount: 0,
    recommendedTours: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const quickActions = [
    {
      label: "Turları Keşfet",
      description: "Yeni rotaları filtrele ve sana uygun turları bul.",
      path: "/user/tours",
      icon: <ExploreIcon sx={{ fontSize: 30 }} />,
    },
    {
      label: "Seyahatlerim",
      description: "Yaklaşan ve geçmiş satın aldığın turları görüntüle.",
      path: "/user/purchases?status=future",
      icon: <EventAvailableIcon sx={{ fontSize: 30 }} />,
    },
    {
      label: "Favorilerim",
      description: "Kaydettiğin turları tek ekranda yönet.",
      path: "/user/favorites",
      icon: <FavoriteIcon sx={{ fontSize: 30 }} />,
    },
    {
      label: "Profilim",
      description: "Hesap bilgilerini ve tercihlerini düzenle.",
      path: "/user/profile",
      icon: <PersonIcon sx={{ fontSize: 30 }} />,
    },
  ];

  const loadDashboard = useCallback(async () => {
    if (!user?.id) return;

    setLoading(true);
    setError("");

    try {
      const [favoritesRes, upcomingRes, pastRes, toursRes] = await Promise.all([
        favoriteApi.getFavorites(user.id),
        userApi.getPurchases(user.id, "future"),
        userApi.getPurchases(user.id, "past"),
        tourApi.getTours(),
      ]);

      const favorites = favoritesRes?.data ?? [];
      const upcoming = upcomingRes?.data ?? [];
      const past = pastRes?.data ?? [];
      const allTours = toursRes?.data ?? [];

      const purchasedTourIds = new Set(
        [...upcoming, ...past]
          .map((purchase) => purchase?.tour?.id)
          .filter(Boolean),
      );

      const filteredRecommendations = allTours.filter(
        (tour) => !purchasedTourIds.has(tour.id),
      );

      setSummary({
        favoriteCount: favorites.length,
        upcomingCount: upcoming.length,
        pastCount: past.length,
        recommendedTours:
          filteredRecommendations.length > 0
            ? filteredRecommendations.slice(0, 3)
            : allTours.slice(0, 3),
      });
    } catch (err) {
      setError(getErrorMessage(err, "Kullanıcı anasayfası yüklenemedi."));
      setSummary((prev) => ({
        ...prev,
        recommendedTours: [],
      }));
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const statCards = [
    {
      label: "Favori Tur",
      value: summary.favoriteCount,
      icon: <FavoriteIcon sx={{ fontSize: 30, color: "secondary.main" }} />,
    },
    {
      label: "Yaklaşan Seyahat",
      value: summary.upcomingCount,
      icon: <EventAvailableIcon sx={{ fontSize: 30, color: "secondary.main" }} />,
    },
    {
      label: "Geçmiş Seyahat",
      value: summary.pastCount,
      icon: <HistoryIcon sx={{ fontSize: 30, color: "secondary.main" }} />,
    },
  ];

  return (
    <Box sx={{ py: 5, minHeight: "80vh", bgcolor: "background.default" }}>
      <Container maxWidth="lg">
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, md: 5 },
            borderRadius: 4,
            border: "1px solid",
            borderColor: "divider",
            mb: 4,
            background:
              "linear-gradient(130deg, rgba(45,52,54,0.98) 0%, rgba(99,110,114,0.96) 60%, rgba(211,84,0,0.96) 100%)",
            color: "#fff",
          }}
        >
          <Chip
            label="Kullanıcı Dashboard"
            size="small"
            sx={{
              mb: 2,
              bgcolor: "rgba(255,255,255,0.18)",
              color: "#fff",
              fontWeight: 600,
            }}
          />
          <Typography variant="h3" fontWeight={800} sx={{ mb: 1 }}>
            Hoş geldin, {user?.name || "Gezgin"}
          </Typography>
          <Typography sx={{ opacity: 0.88, maxWidth: 620 }}>
            Bu panelden kullanıcı istatistiklerini görebilir, favorilerini
            yönetebilir ve seyahat geçmişine erişebilirsin.
          </Typography>
        </Paper>

        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={3} sx={{ mb: 4 }}>
          {statCards.map((card) => (
            <Grid size={{ xs: 12, sm: 4 }} key={card.label}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  border: "1px solid",
                  borderColor: "divider",
                  height: "100%",
                }}
              >
                <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1 }}>
                  {card.icon}
                  <Typography variant="body2" color="text.secondary">
                    {card.label}
                  </Typography>
                </Stack>
                {loading ? (
                  <CircularProgress size={24} color="secondary" />
                ) : (
                  <Typography variant="h4" fontWeight={800}>
                    {card.value}
                  </Typography>
                )}
              </Paper>
            </Grid>
          ))}
        </Grid>

        <Paper
          elevation={0}
          sx={{
            p: { xs: 2.5, md: 3 },
            borderRadius: 3,
            border: "1px solid",
            borderColor: "divider",
            mb: 4,
          }}
        >
          <Typography variant="h5" fontWeight={700} sx={{ mb: 2.5 }}>
            Hızlı Erişim
          </Typography>
          <Grid container spacing={2}>
            {quickActions.map((action) => (
              <Grid size={{ xs: 12, sm: 6 }} key={action.label}>
                <Paper
                  elevation={0}
                  onClick={() => navigate(action.path)}
                  sx={{
                    p: 2.5,
                    borderRadius: 2.5,
                    border: "1px solid",
                    borderColor: "divider",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      borderColor: "secondary.main",
                      transform: "translateY(-2px)",
                      boxShadow: "0 8px 16px rgba(0,0,0,0.06)",
                    },
                  }}
                >
                  <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1 }}>
                    <Box sx={{ color: "secondary.main" }}>{action.icon}</Box>
                    <Typography variant="h6" fontWeight={700}>
                      {action.label}
                    </Typography>
                  </Stack>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                    {action.description}
                  </Typography>
                  <Button
                    size="small"
                    endIcon={<ArrowForwardIcon />}
                    color="secondary"
                    sx={{ px: 0, fontWeight: 600 }}
                  >
                    Git
                  </Button>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Paper>

        <Paper
          elevation={0}
          sx={{
            p: { xs: 2.5, md: 3 },
            borderRadius: 3,
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", sm: "center" }}
            spacing={1}
            sx={{ mb: 2.5 }}
          >
            <Typography variant="h5" fontWeight={700}>
              Sana Özel Tur Önerileri
            </Typography>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => navigate("/user/tours")}
            >
              Tüm Turları Gör
            </Button>
          </Stack>

          {loading && (
            <Box sx={{ py: 4, display: "flex", justifyContent: "center" }}>
              <CircularProgress color="secondary" />
            </Box>
          )}

          {!loading && summary.recommendedTours.length === 0 && (
            <Typography color="text.secondary">
              Şu anda gösterilebilecek öneri bulunamadı.
            </Typography>
          )}

          {!loading && summary.recommendedTours.length > 0 && (
            <Grid container spacing={2.5}>
              {summary.recommendedTours.map((tour) => (
                <Grid size={{ xs: 12, md: 4 }} key={tour.id}>
                  <TourCard
                    tour={tour}
                    variant="compact"
                    onDetail={(selectedTour) =>
                      navigate(`/user/tours/${selectedTour.id}`)
                    }
                  />
                </Grid>
              ))}
            </Grid>
          )}
        </Paper>
      </Container>
    </Box>
  );
}
