// Material-UI components and icons
import {
  Container,
  Typography,
  Box,
  Grid,
  Avatar,
  Button,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

// Team members with name, role, and avatar (placeholder for now)
const team = [
  { name: "Beyza Keklikoğlu", role: "Üye", avatar: "" },
  { name: "Recep Arslan", role: "Üye", avatar: "" },
  { name: "Ümmü Fidan", role: "Üye", avatar: "" },
  { name: "Furkan Fatih Şahin", role: "Takım Lideri", avatar: "" },
];

export default function AboutPage() {
  return (
    <Box sx={{ bgcolor: "background.default" }}>
      {/* Team */}
      <Box sx={{ py: 10 }}>
        <Container maxWidth="md">
          <Typography variant="h3" textAlign="center" gutterBottom>
            CodeLegends Ekibi
          </Typography>

          <Grid container spacing={3} justifyContent="center">
            {team.map((t) => (
              <Grid size={{ xs: 6, sm: 3 }} key={t.name}>
                <Box sx={{ textAlign: "center" }}>
                  <Avatar
                    src={t.avatar}
                    sx={{
                      width: 100,
                      height: 100,
                      mx: "auto",
                      mb: 2,
                      bgcolor: "primary.light",
                      fontSize: "2rem",
                    }}
                  >
                    {t.name.charAt(0)}
                  </Avatar>
                  <Typography variant="h6" fontSize="1rem">
                    {t.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t.role}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>

          <Box sx={{ textAlign: "center", mt: 6 }}>
            <Button
              component={RouterLink}
              to="/"
              variant="contained"
              color="secondary"
              size="large"
            >
              Ana Sayfayı Keşfet
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
