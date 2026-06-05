import { Box, Button, Container, Grid, Paper, Stack, Typography } from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import BusinessIcon from "@mui/icons-material/Business";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import MapIcon from "@mui/icons-material/Map";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function GuideHomePage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const actions = [
    {
      title: "Dashboard",
      description: "Rehber istatistiklerinizi ve panel araçlarını görüntüleyin.",
      path: "/guide/dashboard",
      icon: <DashboardIcon sx={{ fontSize: 34, color: "secondary.main" }} />,
    },
    {
      title: "Tur Firmaları",
      description: "Yeni tur firmalarını keşfedin ve kayıt olun.",
      path: "/guide/companies",
      icon: <BusinessIcon sx={{ fontSize: 34, color: "secondary.main" }} />,
    },
    {
      title: "Firmalarım",
      description: "Kayıtlı olduğunuz firmaları yönetin.",
      path: "/guide/my-companies",
      icon: <CheckCircleIcon sx={{ fontSize: 34, color: "secondary.main" }} />,
    },
    {
      title: "Turlarım",
      description: "Atandığınız aktif ve geçmiş turları görüntüleyin.",
      path: "/guide/my-tours",
      icon: <MapIcon sx={{ fontSize: 34, color: "secondary.main" }} />,
    },
  ];

  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "80vh", py: 6 }}>
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
            Hoş geldiniz, {user?.name || "Rehber"}
          </Typography>
          <Typography sx={{ opacity: 0.9, maxWidth: 720 }}>
            Burası rehber ana sayfanız. Dashboard ve rehberlik operasyonlarına
            hızlı erişim için aşağıdaki modülleri kullanabilirsiniz.
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
