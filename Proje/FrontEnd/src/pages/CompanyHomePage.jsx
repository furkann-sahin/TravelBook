import { Box, Button, Container, Grid, Paper, Stack, Typography } from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import MapIcon from "@mui/icons-material/Map";
import GroupsIcon from "@mui/icons-material/Groups";
import PersonIcon from "@mui/icons-material/Person";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function CompanyHomePage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const actions = [
    {
      title: "Dashboard",
      description: "Firma metriklerini ve yönetim araçlarını açın.",
      path: "/company/dashboard",
      icon: <DashboardIcon sx={{ fontSize: 34, color: "secondary.main" }} />,
    },
    {
      title: "Turlarım",
      description: "Mevcut turları yönetin veya yeni tur oluşturun.",
      path: "/company/tours",
      icon: <MapIcon sx={{ fontSize: 34, color: "secondary.main" }} />,
    },
    {
      title: "Rehberlerim",
      description: "Firmanıza bağlı rehberleri görüntüleyin.",
      path: "/company/guides",
      icon: <GroupsIcon sx={{ fontSize: 34, color: "secondary.main" }} />,
    },
    {
      title: "Profilim",
      description: "Firma bilgilerini düzenleyin ve güncelleyin.",
      path: "/company/profile",
      icon: <PersonIcon sx={{ fontSize: 34, color: "secondary.main" }} />,
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
            Hoş geldiniz, {user?.name || "Firma"}
          </Typography>
          <Typography sx={{ opacity: 0.9, maxWidth: 720 }}>
            Burası firma ana sayfanız. Yönetim işlemleri için dashboard'a,
            operasyon işlemleri için ilgili modüllere devam edebilirsiniz.
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
