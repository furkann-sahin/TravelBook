import { Link as RouterLink } from "react-router-dom";

// Material-UI components and icons
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  IconButton,
  Divider,
} from "@mui/material";
import DirectionsBusIcon from "@mui/icons-material/DirectionsBus";
import GitHubIcon from "@mui/icons-material/GitHub";

import { useAuth } from "../hooks/useAuth";
import { getDefaultRouteForRole } from "../utils/authRoutes";

export default function Footer() {
  const { isAuthenticated, user } = useAuth();
  const role = user?.role;
  const isCompany = isAuthenticated && role === "company";
  const isGuide = isAuthenticated && role === "guide";
  const isUser = isAuthenticated && role === "user";
  const homePath = isAuthenticated ? getDefaultRouteForRole(role) : "/";
  const dashboardPath =
    role === "company"
      ? "/company/dashboard"
      : role === "guide"
        ? "/guide/dashboard"
        : role === "user"
          ? "/user/dashboard"
          : null;
  const purchasesPath = "/user/purchases?status=past";

  const quickLinks = [
    { label: "Ana Sayfa", path: homePath },
    { label: "Hakkımızda", path: "/about" },
    ...(dashboardPath ? [{ label: "Dashboard", path: dashboardPath }] : []),
    ...(isCompany
      ? [
          { label: "Turlarım", path: "/company/tours" },
          { label: "Rehberlerim", path: "/company/guides" },
          { label: "Profil", path: "/company/profile" },
        ]
      : []),
    ...(isUser
      ? [
          { label: "Turlar", path: "/user/tours" },
          { label: "Seyahatlerim", path: purchasesPath },
          { label: "Favorilerim", path: "/user/favorites" },
          { label: "Profil", path: "/user/profile" },
        ]
      : []),
    ...(isGuide
      ? [
          { label: "Firmalarım", path: "/guide/my-companies" },
          { label: "Turlarım", path: "/guide/my-tours" },
          { label: "Profil", path: "/guide/profile" },
        ]
      : []),
    ...(!isAuthenticated
      ? [
          { label: "Giriş Yap", path: "/login" },
          { label: "Kayıt Ol", path: "/register" },
        ]
      : []),
  ];
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: "primary.dark",
        color: "rgba(255,255,255,0.8)",
        pt: 8,
        pb: 3,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Brand */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <DirectionsBusIcon
                sx={{ color: "secondary.light", fontSize: 28 }}
              />
              <Typography variant="h5" fontWeight={800} color="#fff">
                TravelBook
              </Typography>
            </Box>

            {/* Social Media Icons */}
            <Box sx={{ display: "flex", gap: 0.5 }}>
              <IconButton
                size="small"
                sx={{ color: "rgba(255,255,255,0.7)" }}
                href="https://github.com/furkann-sahin/TravelBook"
                target="_blank"
                rel="noopener noreferrer"
              >
                <GitHubIcon />
              </IconButton>
            </Box>
          </Grid>

          {/* Quick Links */}
          <Grid size={{ xs: 6, md: 2 }}>
            <Typography
              variant="h6"
              color="#fff"
              gutterBottom
              fontWeight={600}
              fontSize="1rem"
            >
              Keşfet
            </Typography>
            {quickLinks.map((item) => (
              <Link
                key={item.path}
                component={RouterLink}
                to={item.path}
                underline="hover"
                color="inherit"
                display="block"
                sx={{ mb: 0.8, fontSize: "0.9rem" }}
              >
                {item.label}
              </Link>
            ))}
          </Grid>

          {/* Contact Info */}
          <Grid size={{ xs: 12, md: 3 }}>
            <Typography
              variant="h6"
              color="#fff"
              gutterBottom
              fontWeight={600}
              fontSize="1rem"
            >
              İletişim
            </Typography>
            <Typography variant="body2" sx={{ mb: 0.8 }}>
              info@travelbook.com
            </Typography>
            <Typography variant="body2" sx={{ mb: 0.8 }}>
              +90 (555) 123 45 67
            </Typography>
            <Typography variant="body2">Merkez, Isparta, Türkiye</Typography>
          </Grid>
        </Grid>

        <Divider sx={{ borderColor: "rgba(255,255,255,0.12)", my: 4 }} />

        <Typography
          variant="body2"
          textAlign="center"
          sx={{ color: "rgba(255,255,255,0.5)" }}
        >
          © {new Date().getFullYear()} TravelBook. Tüm hakları saklıdır.
        </Typography>
      </Container>
    </Box>
  );
}
