import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  Skeleton,
} from "@mui/material";
import MapIcon from "@mui/icons-material/Map";
import PersonIcon from "@mui/icons-material/Person";
import StarIcon from "@mui/icons-material/Star";
import RateReviewIcon from "@mui/icons-material/RateReview";
import GroupsIcon from "@mui/icons-material/Groups";
import { useAuth } from "../hooks/useAuth";
import { companyTourApi } from "../services/api";

export default function CompanyDashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [stats, setStats] = useState({
    totalTours: 0,
    avgRating: 0,
    totalReviews: 0,
    totalGuides: 0,
  });
  const [statsLoading, setStatsLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    if (!user?.id) return;
    try {
      setStatsLoading(true);
      const [toursRes, guidesRes] = await Promise.all([
        companyTourApi.listTours(user.id),
        companyTourApi.listGuides(user.id),
      ]);

      const tours = toursRes.data ?? [];
      const guides = guidesRes.data ?? [];

      const ratedTours = tours.filter((t) => t.rating > 0);
      const avgRating =
        ratedTours.length > 0
          ? ratedTours.reduce((sum, t) => sum + t.rating, 0) / ratedTours.length
          : 0;

      const totalReviews = tours.reduce(
        (sum, t) => sum + (t.reviewCount ?? 0),
        0,
      );

      setStats({
        totalTours: tours.length,
        avgRating,
        totalReviews,
        totalGuides: guides.length,
      });
    } catch {
      // keep defaults on error
    } finally {
      setStatsLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const statCards = [
    {
      label: "Toplam Tur",
      value: stats.totalTours,
      icon: <MapIcon sx={{ fontSize: 32, color: "secondary.main" }} />,
    },
    {
      label: "Ortalama Puan",
      value: stats.avgRating > 0 ? stats.avgRating.toFixed(1) : "0.0",
      icon: <StarIcon sx={{ fontSize: 32, color: "secondary.main" }} />,
    },
    {
      label: "Toplam Değerlendirme",
      value: stats.totalReviews,
      icon: <RateReviewIcon sx={{ fontSize: 32, color: "secondary.main" }} />,
    },
    {
      label: "Kayıtlı Rehber",
      value: stats.totalGuides,
      icon: <GroupsIcon sx={{ fontSize: 32, color: "secondary.main" }} />,
    },
  ];

  const quickActions = [
    {
      label: "Turlarım",
      description: "Turlarınızı görüntüleyin ve yönetin",
      icon: <MapIcon sx={{ fontSize: 40, color: "secondary.main" }} />,
      path: "/company/tours",
    },
    {
      label: "Rehberlerim",
      description: "Rehberlerinizi görüntüleyin ve yönetin",
      icon: <GroupsIcon sx={{ fontSize: 40, color: "secondary.main" }} />,
      path: "/company/guides",
    },
    {
      label: "Profilim",
      description: "Firma bilgilerinizi düzenleyin",
      icon: <PersonIcon sx={{ fontSize: 40, color: "secondary.main" }} />,
      path: "/company/profile",
    },
  ];

  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "80vh", py: 6 }}>
      <Container maxWidth="lg">
        {/* Welcome Section */}
        <Box sx={{ mb: 5 }}>
          <Typography variant="h3" fontWeight={800} gutterBottom>
            Hoş geldiniz, {user?.name}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Firma panelinizden turlarınızı yönetebilir ve istatistiklerinizi
            takip edebilirsiniz.
          </Typography>
        </Box>

        {/* Statistics */}
        <Typography variant="h5" fontWeight={700} sx={{ mb: 3 }}>
          İstatistikler
        </Typography>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr 1fr",
              sm: "1fr 1fr 1fr 1fr",
            },
            gap: 3,
            mb: 5,
          }}
        >
          {statCards.map((card) => (
            <Paper
              key={card.label}
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 4,
                border: "1px solid",
                borderColor: "divider",
                textAlign: "center",
              }}
            >
              {card.icon}
              {statsLoading ? (
                <Skeleton
                  variant="text"
                  width={60}
                  height={48}
                  sx={{ mx: "auto", mt: 1 }}
                />
              ) : (
                <Typography
                  variant="h4"
                  fontWeight={800}
                  sx={{ mt: 1 }}
                >
                  {card.value}
                </Typography>
              )}
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                {card.label}
              </Typography>
            </Paper>
          ))}
        </Box>

        {/* Quick Actions */}
        <Typography variant="h5" fontWeight={700} sx={{ mb: 3 }}>
          Hızlı Erişim
        </Typography>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
            gap: 3,
          }}
        >
          {quickActions.map((action) => (
            <Paper
              key={action.label}
              elevation={0}
              sx={{
                p: 4,
                borderRadius: 4,
                border: "1px solid",
                borderColor: "divider",
                cursor: "pointer",
                transition: "all 0.2s ease",
                "&:hover": {
                  borderColor: "secondary.main",
                  transform: "translateY(-2px)",
                  boxShadow: "0 4px 20px rgba(211,84,0,0.1)",
                },
              }}
              onClick={() => navigate(action.path)}
            >
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}
              >
                {action.icon}
                <Typography variant="h6" fontWeight={700}>
                  {action.label}
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                {action.description}
              </Typography>
              <Button color="secondary" sx={{ mt: 2, px: 0, fontWeight: 600 }}>
                Görüntüle →
              </Button>
            </Paper>
          ))}
        </Box>
      </Container>
    </Box>
  );
}
