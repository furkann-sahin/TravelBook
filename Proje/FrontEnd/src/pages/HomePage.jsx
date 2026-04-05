import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Material-UI components and icons
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Chip,
  Stack,
  CircularProgress,
  Alert,
  Skeleton,
} from "@mui/material";
import ExploreIcon from "@mui/icons-material/Explore";
import BusinessIcon from "@mui/icons-material/Business";
import PersonIcon from "@mui/icons-material/Person";
import TravelExploreIcon from "@mui/icons-material/TravelExplore";
import SearchIcon from "@mui/icons-material/Search";
import BookOnlineIcon from "@mui/icons-material/BookOnline";
import CelebrationIcon from "@mui/icons-material/Celebration";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

import { tourApi } from "../services/api";
import TourCard from "../components/TourCard";

const ROLES = [
  {
    icon: <ExploreIcon sx={{ fontSize: 48 }} />,
    title: "Gezginler İçin",
    description:
      "Yüzlerce tur arasından seçim yapın, fiyatları karşılaştırın ve unutulmaz deneyimlere hemen katılın.",
    color: "secondary.main",
  },
  {
    icon: <BusinessIcon sx={{ fontSize: 48 }} />,
    title: "Firmalar İçin",
    description:
      "Turlarınızı oluşturun, yönetin ve binlerce gezgine kolayca ulaşarak işinizi büyütün.",
    color: "info.main",
  },
  {
    icon: <PersonIcon sx={{ fontSize: 48 }} />,
    title: "Rehberler İçin",
    description:
      "Uzmanlık alanlarınızı paylaşın, turlara katılın ve rehberlik kariyerinizi ilerletin.",
    color: "success.main",
  },
];

const STEPS = [
  {
    icon: <SearchIcon sx={{ fontSize: 40 }} />,
    title: "Keşfet",
    description: "İlgi alanınıza uygun turları arayın ve filtreleyin.",
  },
  {
    icon: <BookOnlineIcon sx={{ fontSize: 40 }} />,
    title: "Seç & Katıl",
    description: "Beğendiğiniz turu seçin, detayları inceleyin ve hemen rezervasyon yapın.",
  },
  {
    icon: <CelebrationIcon sx={{ fontSize: 40 }} />,
    title: "Deneyimleyin",
    description: "Profesyonel rehberler eşliğinde unutulmaz bir maceraya çıkın.",
  },
];

/* ───────── component ───────── */
export default function HomePage() {
  const navigate = useNavigate();
  const [tours, setTours] = useState([]);
  const [toursLoading, setToursLoading] = useState(true);
  const [toursError, setToursError] = useState(null);

  useEffect(() => {
    tourApi
      .getTours()
      .then((res) => setTours((res.data || []).slice(0, 4)))
      .catch((err) => setToursError(err.message || "Turlar yüklenemedi."))
      .finally(() => setToursLoading(false));
  }, []);

  return (
    <Box>
      {/* ════════ HERO ════════ */}
      <Box
        sx={{
          position: "relative",
          overflow: "hidden",
          background:
            "linear-gradient(135deg, #2D3436 0%, #636e72 50%, #D35400 100%)",
          color: "#fff",
          py: { xs: 10, md: 14 },
          textAlign: "center",
        }}
      >
        {/* subtle decorative circles */}
        <Box
          sx={{
            position: "absolute",
            width: 400,
            height: 400,
            borderRadius: "50%",
            bgcolor: "rgba(255,255,255,0.04)",
            top: -120,
            right: -80,
          }}
        />
        <Box
          sx={{
            position: "absolute",
            width: 260,
            height: 260,
            borderRadius: "50%",
            bgcolor: "rgba(255,255,255,0.05)",
            bottom: -60,
            left: -40,
          }}
        />

        <Container maxWidth="md" sx={{ position: "relative", zIndex: 1 }}>
          <TravelExploreIcon sx={{ fontSize: 56, mb: 2, opacity: 0.9 }} />
          <Typography
            variant="h2"
            fontWeight={800}
            sx={{
              fontSize: { xs: "2rem", sm: "2.75rem", md: "3.25rem" },
              lineHeight: 1.2,
              mb: 2,
            }}
          >
            Keşfedin, Oluşturun ve Rehberlik Edin
          </Typography>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 400,
              opacity: 0.88,
              maxWidth: 620,
              mx: "auto",
              mb: 5,
              fontSize: { xs: "1rem", md: "1.15rem" },
            }}
          >
            TravelBook — gezginleri, tur firmalarını ve rehberleri tek bir
            platformda buluşturan seyahat deneyimi.
          </Typography>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            justifyContent="center"
          >
            <Button
              variant="contained"
              color="secondary"
              size="large"
              onClick={() => navigate("/user/tours")}
              sx={{ px: 4, py: 1.4 }}
            >
              Turları Keşfet
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate("/register")}
              sx={{
                px: 4,
                py: 1.4,
                color: "#fff",
                borderColor: "rgba(255,255,255,0.5)",
                "&:hover": { borderColor: "#fff", bgcolor: "rgba(255,255,255,0.08)" },
              }}
            >
              Firma Olarak Başla
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate("/register")}
              sx={{
                px: 4,
                py: 1.4,
                color: "#fff",
                borderColor: "rgba(255,255,255,0.5)",
                "&:hover": { borderColor: "#fff", bgcolor: "rgba(255,255,255,0.08)" },
              }}
            >
              Rehber Olarak Katıl
            </Button>
          </Stack>
        </Container>
      </Box>

      {/* ════════ ROLES (Platform Overview) ════════ */}
      <Box sx={{ py: { xs: 8, md: 10 }, bgcolor: "background.default" }}>
        <Container maxWidth="lg">
          <Typography
            variant="h4"
            fontWeight={800}
            textAlign="center"
            gutterBottom
          >
            Herkes İçin Bir Platform
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            textAlign="center"
            sx={{ maxWidth: 560, mx: "auto", mb: 6 }}
          >
            İster dünyayı keşfetmek isteyin, ister turlarınızı yönetmek ya da
            rehberlik yapmak — TravelBook size göre.
          </Typography>

          <Grid container spacing={4}>
            {ROLES.map((role) => (
              <Grid size={{ xs: 12, md: 4 }} key={role.title}>
                <Card
                  elevation={0}
                  sx={{
                    height: "100%",
                    textAlign: "center",
                    p: 4,
                    border: "1px solid",
                    borderColor: "divider",
                  }}
                >
                  <Box sx={{ color: role.color, mb: 2 }}>{role.icon}</Box>
                  <Typography variant="h6" fontWeight={700} gutterBottom>
                    {role.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {role.description}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ════════ FEATURED TOURS ════════ */}
      <Box sx={{ py: { xs: 8, md: 10 }, bgcolor: "background.paper" }}>
        <Container maxWidth="lg">
          <Typography
            variant="h4"
            fontWeight={800}
            textAlign="center"
            gutterBottom
          >
            Öne Çıkan Turlar
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            textAlign="center"
            sx={{ maxWidth: 480, mx: "auto", mb: 6 }}
          >
            En popüler deneyimlerden bir seçki.
          </Typography>

          {/* Loading */}
          {toursLoading && (
            <Grid container spacing={3}>
              {[0, 1, 2, 3].map((i) => (
                <Grid size={{ xs: 12, sm: 6, md: 3 }} key={i}>
                  <Skeleton variant="rounded" height={180} sx={{ borderRadius: 3 }} />
                  <Skeleton width="80%" sx={{ mt: 1 }} />
                  <Skeleton width="50%" />
                </Grid>
              ))}
            </Grid>
          )}

          {/* Error */}
          {!toursLoading && toursError && (
            <Alert severity="error" sx={{ borderRadius: 2 }}>
              {toursError}
            </Alert>
          )}

          {/* Empty */}
          {!toursLoading && !toursError && tours.length === 0 && (
            <Typography textAlign="center" color="text.secondary">
              Henüz tur bulunmuyor.
            </Typography>
          )}

          {/* Tour cards */}
          {!toursLoading && !toursError && tours.length > 0 && (
            <Grid container spacing={3}>
              {tours.map((tour) => (
                <Grid size={{ xs: 12, sm: 6, md: 3 }} key={tour.id}>
                  <TourCard
                    tour={tour}
                    variant="compact"
                    onDetail={(t) => navigate(`/user/tours/${t.id}`)}
                  />
                </Grid>
              ))}
            </Grid>
          )}

          <Box sx={{ textAlign: "center", mt: 5 }}>
            <Button
              variant="outlined"
              color="secondary"
              endIcon={<ArrowForwardIcon />}
              onClick={() => navigate("/user/tours")}
            >
              Tüm Turları Gör
            </Button>
          </Box>
        </Container>
      </Box>

      {/* ════════ HOW IT WORKS ════════ */}
      <Box sx={{ py: { xs: 8, md: 10 }, bgcolor: "background.default" }}>
        <Container maxWidth="md">
          <Typography
            variant="h4"
            fontWeight={800}
            textAlign="center"
            gutterBottom
          >
            Nasıl Çalışır?
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            textAlign="center"
            sx={{ mb: 6 }}
          >
            Üç kolay adımda hayalinizdeki tura katılın.
          </Typography>

          <Grid container spacing={4}>
            {STEPS.map((step, i) => (
              <Grid size={{ xs: 12, md: 4 }} key={step.title}>
                <Box sx={{ textAlign: "center" }}>
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      bgcolor: "secondary.main",
                      color: "#fff",
                      mx: "auto",
                      mb: 2,
                    }}
                  >
                    <Typography variant="h5" fontWeight={800}>
                      {i + 1}
                    </Typography>
                  </Box>
                  <Box sx={{ color: "primary.main", mb: 1 }}>{step.icon}</Box>
                  <Typography variant="h6" fontWeight={700} gutterBottom>
                    {step.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {step.description}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ════════ CTA ════════ */}
      <Box
        sx={{
          py: { xs: 8, md: 10 },
          background:
            "linear-gradient(135deg, #2D3436 0%, #636e72 60%, #D35400 100%)",
          color: "#fff",
          textAlign: "center",
        }}
      >
        <Container maxWidth="sm">
          <Typography
            variant="h4"
            fontWeight={800}
            sx={{ mb: 2, fontSize: { xs: "1.6rem", md: "2rem" } }}
          >
            Maceraya Hazır mısınız?
          </Typography>
          <Typography
            variant="body1"
            sx={{ opacity: 0.88, mb: 4 }}
          >
            Hemen ücretsiz hesap oluşturun ve TravelBook dünyasını
            keşfetmeye başlayın.
          </Typography>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            justifyContent="center"
          >
            <Button
              variant="contained"
              color="secondary"
              size="large"
              onClick={() => navigate("/register")}
              sx={{ px: 5, py: 1.4 }}
            >
              Kayıt Ol
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate("/login")}
              sx={{
                px: 5,
                py: 1.4,
                color: "#fff",
                borderColor: "rgba(255,255,255,0.5)",
                "&:hover": { borderColor: "#fff", bgcolor: "rgba(255,255,255,0.08)" },
              }}
            >
              Giriş Yap
            </Button>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
}
