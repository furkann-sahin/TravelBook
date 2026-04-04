import { Link as RouterLink } from "react-router-dom";
import { Container, Typography, Box, Button } from "@mui/material";
import SentimentDissatisfiedIcon from "@mui/icons-material/SentimentDissatisfied";

export default function NotFoundPage() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "background.default",
      }}
    >
      <Container maxWidth="sm" sx={{ textAlign: "center" }}>
        <SentimentDissatisfiedIcon
          sx={{ fontSize: 80, color: "text.disabled", mb: 2 }}
        />
        <Typography variant="h2" fontWeight={800} color="primary" gutterBottom>
          404
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
          Aradığınız sayfa bulunamadı.
        </Typography>
        <Button
          component={RouterLink}
          to="/"
          variant="contained"
          color="secondary"
          size="large"
        >
          Ana Sayfaya Dön
        </Button>
      </Container>
    </Box>
  );
}
