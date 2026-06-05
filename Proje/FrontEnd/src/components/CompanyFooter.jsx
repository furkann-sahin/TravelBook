import { Link as RouterLink } from "react-router-dom";
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  IconButton,
  Divider,
} from "@mui/material";
import GitHubIcon from "@mui/icons-material/GitHub";
import BrandLogo from "./BrandLogo";

const companyLinks = [
  { label: "Ana Sayfa", path: "/company" },
  { label: "Dashboard", path: "/company/dashboard" },
  { label: "Turlarım", path: "/company/tours" },
  { label: "Profilim", path: "/company/profile" },
];

const publicLinks = [
  { label: "Hakkımızda", path: "/about" },
];

export default function CompanyFooter() {
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
            <BrandLogo
              to="/company"
              iconSize={28}
              textVariant="h5"
              textColor="#fff"
              sx={{ mb: 2 }}
            />

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

          {/* Company Links */}
          <Grid size={{ xs: 6, md: 2 }}>
            <Typography
              variant="h6"
              color="#fff"
              gutterBottom
              fontWeight={600}
              fontSize="1rem"
            >
              Firma Paneli
            </Typography>
            {companyLinks.map((item) => (
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

          {/* Public Links */}
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
            {publicLinks.map((item) => (
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
