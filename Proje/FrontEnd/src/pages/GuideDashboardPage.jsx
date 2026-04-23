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
import BusinessIcon from "@mui/icons-material/Business";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PersonIcon from "@mui/icons-material/Person";
import MapIcon from "@mui/icons-material/Map";
import WorkHistoryIcon from "@mui/icons-material/WorkHistory";
import StarIcon from "@mui/icons-material/Star";
import { useAuth } from "../hooks/useAuth";
import { guideApi } from "../services/api";

export default function GuideDashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [stats, setStats] = useState({
    totalTours: 0,
    totalCompanies: 0,
    experienceYears: 0,
    rating: 0,
  });
  const [statsLoading, setStatsLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    if (!user?.id) return;

    try {
      setStatsLoading(true);
      const [profileRes, companiesRes, toursRes] = await Promise.all([
        guideApi.getDetail(user.id),
        guideApi.listMyCompanies(user.id),
        guideApi.listTours(user.id),
      ]);

      const profile = profileRes?.data ?? profileRes ?? {};
      const companies = companiesRes?.data ?? companiesRes ?? [];
      const tours = toursRes?.data ?? toursRes ?? [];

      setStats({
        totalTours: Array.isArray(tours) ? tours.length : 0,
        totalCompanies: Array.isArray(companies) ? companies.length : 0,
        experienceYears: profile?.experienceYears ?? 0,
        rating: profile?.rating ?? 0,
      });
    } catch {
      // Keep safe defaults when an endpoint fails.
      setStats({
        totalTours: 0,
        totalCompanies: 0,
        experienceYears: 0,
        rating: 0,
      });
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
      label: "Kayıtlı Firma",
      value: stats.totalCompanies,
      icon: <BusinessIcon sx={{ fontSize: 32, color: "secondary.main" }} />,
    },
    {
      label: "Deneyim (Yıl)",
      value: stats.experienceYears,
      icon: <WorkHistoryIcon sx={{ fontSize: 32, color: "secondary.main" }} />,
    },
    {
      label: "Ortalama Puan",
      value: stats.rating > 0 ? Number(stats.rating).toFixed(1) : "0.0",
      icon: <StarIcon sx={{ fontSize: 32, color: "secondary.main" }} />,
    },
  ];

  const quickActions = [
    {
      label: "Tur Firmaları",
      description: "Tüm tur firmalarını görüntüleyin ve kayıt olun",
      icon: <BusinessIcon sx={{ fontSize: 40, color: "secondary.main" }} />,
      path: "/guide/companies",
    },
    {
      label: "Profilim",
      description: "Rehber bilgilerinizi görüntüleyin ve düzenleyin",
      icon: <PersonIcon sx={{ fontSize: 40, color: "secondary.main" }} />,
      path: "/guide/profile",
    },
    {
      label: "Kayıtlı Tur Firmalarım",
      description: "Kayıt olduğunuz tur firmalarını yönetin",
      icon: <CheckCircleIcon sx={{ fontSize: 40, color: "secondary.main" }} />,
      path: "/guide/my-companies",
    },
    {
      label: "Kayıtlı Turlarım",
      description: "Şirket tarafından atanan turlarınızı görüntüleyin",
      icon: <MapIcon sx={{ fontSize: 40, color: "secondary.main" }} />,
      path: "/guide/my-tours",
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
            Rehber panelinizden tur firmalarına kayıt olabilir, turlarınızı
            yönetebilir ve profilinizi güncelleyebilirsiniz.
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
                <Typography variant="h4" fontWeight={800} sx={{ mt: 1 }}>
                  {card.value}
                </Typography>
              )}
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 0.5 }}
              >
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
