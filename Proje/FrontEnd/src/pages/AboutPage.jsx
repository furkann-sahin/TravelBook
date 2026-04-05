import { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Box,
  Grid,
  Avatar,
  Button,
  Paper,
  Stack,
  Chip,
  Skeleton,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import ExploreIcon from "@mui/icons-material/Explore";
import GroupsIcon from "@mui/icons-material/Groups";
import VerifiedIcon from "@mui/icons-material/Verified";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import TravelExploreIcon from "@mui/icons-material/TravelExplore";
import SecurityIcon from "@mui/icons-material/Security";
import SpeedIcon from "@mui/icons-material/Speed";
import { tourApi } from "../services/api";

const team = [
  {
    name: "Furkan Fatih Şahin",
    role: "Takım Lideri",
    avatar: "",
    desc: "",
  },
  {
    name: "Beyza Keklikoğlu",
    role: "Geliştirici",
    avatar: "",
    desc: "",
  },
  {
    name: "Recep Arslan",
    role: "Geliştirici",
    avatar: "",
    desc: "",
  },
  {
    name: "Ümmü Fidan",
    role: "Geliştirici",
    avatar: "",
    desc: "",
  },
];

const statLabels = [
  { key: "userCount", label: "Kayıtlı Kullanıcı" },
  { key: "tourCount", label: "Aktif Tur" },
  { key: "companyCount", label: "Tur Firması" },
  { key: "guideCount", label: "Rehber" },
];

const features = [
  {
    icon: <TravelExploreIcon sx={{ fontSize: 40 }} />,
    title: "Kolay Tur Keşfi",
    desc: "Yüzlerce tur arasından filtreleme ve arama ile size en uygun turu kolayca bulun.",
  },
  {
    icon: <SecurityIcon sx={{ fontSize: 40 }} />,
    title: "Güvenli Rezervasyon",
    desc: "Güvenli ödeme altyapısı ve doğrulanmış tur firmaları ile gönül rahatlığıyla rezervasyon yapın.",
  },
  {
    icon: <SpeedIcon sx={{ fontSize: 40 }} />,
    title: "Hızlı & Modern",
    desc: "Modern web teknolojileri ile geliştirilmiş, hızlı ve akıcı bir kullanıcı deneyimi.",
  },
  {
    icon: <SupportAgentIcon sx={{ fontSize: 40 }} />,
    title: "Profesyonel Rehberlik",
    desc: "Deneyimli ve lisanslı rehberler eşliğinde unutulmaz seyahat deneyimleri yaşayın.",
  },
];

export default function AboutPage() {
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    tourApi
      .getStats()
      .then((res) => setStats(res.data))
      .catch(() => setStats(null))
      .finally(() => setStatsLoading(false));
  }, []);

  return (
    <Box sx={{ bgcolor: "background.default" }}>
      {/* ── Hero Section ── */}
      <Box
        sx={{
          position: "relative",
          overflow: "hidden",
          py: { xs: 10, md: 14 },
          background:
            "linear-gradient(135deg, #2D3436 0%, #4A5568 50%, #D35400 100%)",
          color: "#fff",
        }}
      >
        {/* Decorative circles */}
        <Box
          sx={{
            position: "absolute",
            width: 400,
            height: 400,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.04)",
            top: -120,
            right: -80,
          }}
        />
        <Box
          sx={{
            position: "absolute",
            width: 250,
            height: 250,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.03)",
            bottom: -60,
            left: -40,
          }}
        />

        <Container maxWidth="md" sx={{ position: "relative", zIndex: 1, textAlign: "center" }}>
          <Chip
            icon={<ExploreIcon sx={{ color: "#fff !important" }} />}
            label="Seyahat Platformu"
            sx={{
              mb: 3,
              bgcolor: "rgba(255,255,255,0.15)",
              color: "#fff",
              fontWeight: 600,
              fontSize: "0.85rem",
              backdropFilter: "blur(8px)",
            }}
          />
          <Typography
            variant="h2"
            fontWeight={800}
            sx={{
              mb: 2,
              fontSize: { xs: "2rem", md: "3rem" },
              lineHeight: 1.2,
            }}
          >
            Seyahatin Yeni Adı:
            <br />
            <Box component="span" sx={{ color: "secondary.light" }}>
              TravelBook
            </Box>
          </Typography>
          <Typography
            variant="h6"
            sx={{
              maxWidth: 600,
              mx: "auto",
              fontWeight: 400,
              opacity: 0.9,
              lineHeight: 1.7,
              fontSize: { xs: "1rem", md: "1.15rem" },
            }}
          >
            Türkiye'nin dört bir yanındaki turları keşfedin, güvenilir tur firmaları
            ve deneyimli rehberler ile unutulmaz anılar biriktirin.
          </Typography>
        </Container>
      </Box>

      {/* ── Stats Bar ── */}
      <Container maxWidth="lg" sx={{ mt: -5, position: "relative", zIndex: 2 }}>
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, md: 4 },
            borderRadius: 4,
            border: "1px solid",
            borderColor: "divider",
            boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
          }}
        >
          <Grid container spacing={3}>
            {statLabels.map((s) => (
              <Grid size={{ xs: 6, md: 3 }} key={s.key}>
                <Box sx={{ textAlign: "center" }}>
                  {statsLoading ? (
                    <Skeleton
                      variant="text"
                      width={80}
                      height={48}
                      sx={{ mx: "auto" }}
                    />
                  ) : (
                    <Typography
                      variant="h4"
                      fontWeight={800}
                      color="secondary.main"
                      sx={{ fontSize: { xs: "1.5rem", md: "2rem" } }}
                    >
                      {stats?.[s.key]?.toLocaleString("tr-TR") ?? "—"}
                    </Typography>
                  )}
                  <Typography variant="body2" color="text.secondary" fontWeight={500}>
                    {s.label}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Paper>
      </Container>

      {/* ── Mission Section ── */}
      <Container maxWidth="md" sx={{ py: { xs: 8, md: 10 }, textAlign: "center" }}>
        <GroupsIcon sx={{ fontSize: 48, color: "secondary.main", mb: 2 }} />
        <Typography variant="h4" fontWeight={700} sx={{ mb: 2 }}>
          Misyonumuz
        </Typography>
        <Typography
          color="text.secondary"
          sx={{ maxWidth: 650, mx: "auto", lineHeight: 1.8, fontSize: "1.05rem" }}
        >
          TravelBook, seyahat severleri güvenilir tur firmaları ve profesyonel
          rehberlerle buluşturarak kusursuz bir tatil deneyimi sunmayı amaçlar.
          Platformumuz sayesinde turlarınızı kolayca keşfedebilir, karşılaştırabilir
          ve güvenle rezervasyon yapabilirsiniz. Her adımda yanınızdayız.
        </Typography>
      </Container>

      {/* ── Features ── */}
      <Box sx={{ bgcolor: "background.paper", py: { xs: 8, md: 10 } }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center", mb: 6 }}>
            <Typography variant="h4" fontWeight={700} sx={{ mb: 1 }}>
              Neden TravelBook?
            </Typography>
            <Typography color="text.secondary" sx={{ maxWidth: 500, mx: "auto" }}>
              Size en iyi seyahat deneyimini sunmak için tasarlandık.
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {features.map((f) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={f.title}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3.5,
                    height: "100%",
                    borderRadius: 3,
                    border: "1px solid",
                    borderColor: "divider",
                    textAlign: "center",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-6px)",
                      boxShadow: "0 12px 24px rgba(0,0,0,0.08)",
                      borderColor: "secondary.light",
                    },
                  }}
                >
                  <Box sx={{ color: "secondary.main", mb: 2 }}>{f.icon}</Box>
                  <Typography variant="h6" fontWeight={700} sx={{ mb: 1, fontSize: "1rem" }}>
                    {f.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" lineHeight={1.7}>
                    {f.desc}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ── Team ── */}
      <Box sx={{ py: { xs: 8, md: 10 } }}>
        <Container maxWidth="md">
          <Box sx={{ textAlign: "center", mb: 6 }}>
            <Chip
              icon={<VerifiedIcon />}
              label="CodeLegends"
              color="secondary"
              variant="outlined"
              sx={{ mb: 2, fontWeight: 600 }}
            />
            <Typography variant="h4" fontWeight={700} sx={{ mb: 1 }}>
              Ekibimiz
            </Typography>
            <Typography color="text.secondary" sx={{ maxWidth: 480, mx: "auto" }}>
              TravelBook'u hayata geçiren tutkulu yazılım mühendisliği ekibi.
            </Typography>
          </Box>

          <Grid container spacing={4} justifyContent="center">
            {team.map((t) => (
              <Grid size={{ xs: 6, sm: 3 }} key={t.name}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    textAlign: "center",
                    borderRadius: 3,
                    border: "1px solid",
                    borderColor: "divider",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: "0 8px 20px rgba(0,0,0,0.06)",
                    },
                  }}
                >
                  <Avatar
                    src={t.avatar}
                    sx={{
                      width: 80,
                      height: 80,
                      mx: "auto",
                      mb: 2,
                      bgcolor: "secondary.main",
                      fontSize: "1.75rem",
                      fontWeight: 700,
                    }}
                  >
                    {t.name.charAt(0)}
                  </Avatar>
                  <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 0.25 }}>
                    {t.name}
                  </Typography>
                  <Typography
                    variant="caption"
                    fontWeight={600}
                    color="secondary.main"
                    sx={{ display: "block", mb: 0.5 }}
                  >
                    {t.role}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" fontSize="0.8rem">
                    {t.desc}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}
