import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
} from "@mui/material";
import MapIcon from "@mui/icons-material/Map";
import PersonIcon from "@mui/icons-material/Person";
import { useAuth } from "../hooks/useAuth";

export default function CompanyDashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const quickActions = [
    {
      label: "Turlarım",
      description: "Turlarınızı görüntüleyin ve yönetin",
      icon: <MapIcon sx={{ fontSize: 40, color: "secondary.main" }} />,
      path: "/company/tours",
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
              <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                {action.icon}
                <Typography variant="h6" fontWeight={700}>
                  {action.label}
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                {action.description}
              </Typography>
              <Button
                color="secondary"
                sx={{ mt: 2, px: 0, fontWeight: 600 }}
              >
                Görüntüle →
              </Button>
            </Paper>
          ))}
        </Box>
      </Container>
    </Box>
  );
}
