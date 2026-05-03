import { Box, Button, Container, Grid, Paper, Stack, Typography } from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ExploreIcon from "@mui/icons-material/Explore";
import FavoriteIcon from "@mui/icons-material/Favorite";
import HistoryIcon from "@mui/icons-material/History";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function UserHomePage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const actions = [
    {
      title: "Dashboard",
      description: "Kullanıcı paneline gidin ve istatistiklerinizi yönetin.",
      path: "/user/dashboard",
      icon: <DashboardIcon sx={{ fontSize: 34, color: "secondary.main" }} />,
    },
    {
      title: "Turları Keşfet",
      description: "Yeni rotaları inceleyin ve kendinize uygun turları bulun.",
      path: "/user/tours",
      icon: <ExploreIcon sx={{ fontSize: 34, color: "secondary.main" }} />,
    },
    {
      title: "Favorilerim",
      description: "Favorilere eklediğiniz turları gözden geçirin.",
      path: "/user/favorites",
      icon: <FavoriteIcon sx={{ fontSize: 34, color: "secondary.main" }} />,
    },
    {
      title: "Seyahatlerim",
      description: "Yaklaşan ve geçmiş rezervasyonlarınıza hızlıca erişin.",
      path: "/user/purchases?status=future",
      icon: <HistoryIcon sx={{ fontSize: 34, color: "secondary.main" }} />,
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
          <Typography variant="h3" fontWeight={800} sx={{ mb: 1 }}>
            Hoş geldin, {user?.name || "Gezgin"}
          </Typography>
          <Typography sx={{ opacity: 0.9, maxWidth: 700 }}>
            Burası kişisel ana sayfanız. Dashboard ve diğer kullanıcı
            özelliklerine buradan hızlıca erişebilirsiniz.
          </Typography>
        </Paper>

        <Grid container spacing={2.5}>
          {actions.map((action) => (
            <Grid size={{ xs: 12, sm: 6 }} key={action.title}>
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
                  {action.icon}
                  <Typography variant="h6" fontWeight={700}>
                    {action.title}
                  </Typography>
                </Stack>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {action.description}
                </Typography>
                <Button variant="outlined" color="secondary" onClick={() => navigate(action.path)}>
                  Aç
                </Button>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
