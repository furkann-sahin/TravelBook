import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";

// Material-UI components and icons
import {
  Container,
  Typography,
  Box,
  Paper,
  Avatar,
  Chip,
  Rating,
  Skeleton,
  Alert,
  Button,
  Divider,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CardTravelIcon from "@mui/icons-material/CardTravel";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import LanguageIcon from "@mui/icons-material/Language";
import ExploreIcon from "@mui/icons-material/Explore";
import WorkHistoryIcon from "@mui/icons-material/WorkHistory";
import MapIcon from "@mui/icons-material/Map";
import LinkIcon from "@mui/icons-material/Link";
import StarIcon from "@mui/icons-material/Star";

import { guideApi, getImageUrl } from "../services/api";

const DEFAULT_BANNER =
  "linear-gradient(135deg, #2D3436 0%, #636e72 40%, #D35400 100%)";

function getImageSrc(url) {
  if (!url) return undefined;
  if (url.startsWith("http") || url.startsWith("data:")) return url;
  return getImageUrl(url);
}

export default function CompanyGuideDetailPage() {
  const { guideId } = useParams();
  const navigate = useNavigate();

  const [guide, setGuide] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchGuide = useCallback(async () => {
    if (!guideId) return;
    try {
      setLoading(true);
      setError(null);
      const res = await guideApi.getDetail(guideId);
      setGuide(res.data ?? res);
    } catch (err) {
      setError(err.message || "Rehber bilgileri yüklenirken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  }, [guideId]);

  useEffect(() => {
    fetchGuide();
  }, [fetchGuide]);

  // ── Loading ──
  if (loading) {
    return (
      <Box sx={{ bgcolor: "background.default", minHeight: "80vh", py: 6 }}>
        <Container maxWidth="md">
          <Paper sx={{ borderRadius: 4, overflow: "hidden" }}>
            <Skeleton variant="rectangular" height={220} />
            <Box sx={{ p: 4, display: "flex", gap: 3, alignItems: "center" }}>
              <Skeleton variant="circular" width={110} height={110} />
              <Box sx={{ flex: 1 }}>
                <Skeleton variant="text" width="60%" height={40} />
                <Skeleton variant="text" width="40%" />
              </Box>
            </Box>
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} variant="text" sx={{ mx: 4, mb: 1 }} />
            ))}
          </Paper>
        </Container>
      </Box>
    );
  }

  // ── Error ──
  if (error) {
    return (
      <Box sx={{ bgcolor: "background.default", minHeight: "80vh", py: 6 }}>
        <Container maxWidth="md" sx={{ textAlign: "center" }}>
          <Alert
            severity="error"
            sx={{ maxWidth: 520, mx: "auto", mb: 3 }}
            action={
              <Button color="inherit" size="small" onClick={fetchGuide}>
                Tekrar Dene
              </Button>
            }
          >
            {error}
          </Alert>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate("/company/guides")}
          >
            Rehberlere Dön
          </Button>
        </Container>
      </Box>
    );
  }

  if (!guide) return null;

  const fullName = `${guide.firstName || ""} ${guide.lastName || ""}`.trim();
  const memberSince = guide.createdAt
    ? new Date(guide.createdAt).toLocaleDateString("tr-TR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;
  const totalTours = guide.registeredTours?.length ?? 0;

  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "80vh", py: 6 }}>
      <Container maxWidth="md">
        {/* Back button */}
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/company/guides")}
          sx={{ mb: 2 }}
        >
          Rehberlere Dön
        </Button>

        {/* ════════════ PROFILE HEADER CARD ════════════ */}
        <Paper
          elevation={0}
          sx={{
            borderRadius: 4,
            overflow: "hidden",
            border: "1px solid",
            borderColor: "divider",
            mb: 3,
            boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
          }}
        >
          {/* Banner */}
          <Box
            sx={{
              height: { xs: 160, md: 220 },
              background: guide.bannerImageUrl
                ? `url(${getImageSrc(guide.bannerImageUrl)}) center/cover no-repeat`
                : DEFAULT_BANNER,
            }}
          />

          {/* Avatar + Name */}
          <Box sx={{ px: { xs: 3, md: 5 }, pb: 4 }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                alignItems: { xs: "center", sm: "flex-end" },
                gap: 2,
                mt: -6,
              }}
            >
              <Avatar
                src={getImageSrc(guide.profileImageUrl)}
                sx={{
                  width: 110,
                  height: 110,
                  bgcolor: "secondary.main",
                  fontSize: 40,
                  fontWeight: 800,
                  border: "4px solid",
                  borderColor: "background.paper",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.18)",
                }}
              >
                {guide.firstName?.charAt(0)?.toUpperCase()}
              </Avatar>

              <Box
                sx={{
                  flex: 1,
                  textAlign: { xs: "center", sm: "left" },
                  mb: { xs: 0, sm: 1 },
                }}
              >
                <Typography variant="h4" fontWeight={800}>
                  {fullName || "İsimsiz Rehber"}
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    flexWrap: "wrap",
                    justifyContent: { xs: "center", sm: "flex-start" },
                    mt: 0.5,
                  }}
                >
                  <Chip
                    icon={<CardTravelIcon sx={{ fontSize: 16 }} />}
                    label="Rehber"
                    size="small"
                    color="secondary"
                    variant="outlined"
                  />
                  {guide.rating > 0 && (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                      <Rating
                        value={guide.rating}
                        precision={0.1}
                        size="small"
                        readOnly
                      />
                      <Typography variant="body2" color="text.secondary">
                        {guide.rating.toFixed(1)}
                        {guide.reviewCount > 0 && ` (${guide.reviewCount})`}
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Box>
            </Box>
          </Box>
        </Paper>

        {/* ════════════ INFO CARDS ════════════ */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {/* Biography */}
          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, md: 4 },
              borderRadius: 4,
              border: "1px solid",
              borderColor: "divider",
              boxShadow: "0 2px 16px rgba(0,0,0,0.04)",
            }}
          >
            <Typography
              variant="h6"
              fontWeight={700}
              gutterBottom
              sx={{ display: "flex", alignItems: "center", gap: 1 }}
            >
              <CardTravelIcon color="secondary" />
              Hakkında
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
              {guide.biography || "Henüz bir biyografi eklenmemiş."}
            </Typography>
          </Paper>

          {/* Languages & Expertise */}
          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, md: 4 },
              borderRadius: 4,
              border: "1px solid",
              borderColor: "divider",
              boxShadow: "0 2px 16px rgba(0,0,0,0.04)",
            }}
          >
            <Typography variant="h6" fontWeight={700} gutterBottom>
              Uzmanlık Bilgileri
            </Typography>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                gap: 3,
                mt: 2,
              }}
            >
              <InfoRow
                icon={<LanguageIcon color="action" />}
                label="Diller"
                value={
                  Array.isArray(guide.languages) && guide.languages.length > 0
                    ? guide.languages.join(", ")
                    : "—"
                }
              />
              <InfoRow
                icon={<ExploreIcon color="action" />}
                label="Uzman Rotalar"
                value={
                  Array.isArray(guide.expertRoutes) && guide.expertRoutes.length > 0
                    ? guide.expertRoutes.join(", ")
                    : "—"
                }
              />
              <InfoRow
                icon={<WorkHistoryIcon color="action" />}
                label="Deneyim"
                value={
                  guide.experienceYears != null && guide.experienceYears > 0
                    ? `${guide.experienceYears} yıl`
                    : "—"
                }
              />
            </Box>
          </Paper>

          {/* Contact Info + Social Media */}
          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, md: 4 },
              borderRadius: 4,
              border: "1px solid",
              borderColor: "divider",
              boxShadow: "0 2px 16px rgba(0,0,0,0.04)",
            }}
          >
            <Typography variant="h6" fontWeight={700} gutterBottom>
              İletişim Bilgileri
            </Typography>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                gap: 3,
                mt: 2,
              }}
            >
              <InfoRow
                icon={<EmailIcon color="action" />}
                label="E-posta"
                value={guide.email}
              />
              <InfoRow
                icon={<PhoneIcon color="action" />}
                label="Telefon"
                value={guide.phone}
              />
              {memberSince && (
                <InfoRow
                  icon={<CalendarMonthIcon color="action" />}
                  label="Üyelik Tarihi"
                  value={memberSince}
                />
              )}
            </Box>

            {/* Social Media */}
            {(guide.instagram || guide.linkedin) && (
              <>
                <Divider sx={{ my: 3 }} />
                <Typography
                  variant="subtitle1"
                  fontWeight={700}
                  sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}
                >
                  <LinkIcon color="secondary" />
                  Sosyal Medya
                </Typography>
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                    gap: 2,
                  }}
                >
                  <SocialRow
                    iconSrc="https://cdn-icons-png.flaticon.com/24/2111/2111463.png"
                    label="Instagram"
                    value={guide.instagram}
                  />
                  <SocialRow
                    iconSrc="https://cdn-icons-png.flaticon.com/24/3536/3536505.png"
                    label="LinkedIn"
                    value={guide.linkedin}
                  />
                </Box>
              </>
            )}
          </Paper>

          {/* Statistics */}
          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, md: 4 },
              borderRadius: 4,
              border: "1px solid",
              borderColor: "divider",
              boxShadow: "0 2px 16px rgba(0,0,0,0.04)",
            }}
          >
            <Typography variant="h6" fontWeight={700} gutterBottom>
              İstatistikler
            </Typography>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr 1fr", sm: "1fr 1fr 1fr 1fr" },
                gap: 3,
                mt: 2,
              }}
            >
              <StatCard
                icon={<MapIcon sx={{ fontSize: 32, color: "secondary.main" }} />}
                value={totalTours}
                label="Toplam Tur"
              />
              <StatCard
                icon={<StarIcon sx={{ fontSize: 32, color: "secondary.main" }} />}
                value={guide.rating > 0 ? guide.rating.toFixed(1) : "—"}
                label="Puan"
              />
              <StatCard
                icon={<WorkHistoryIcon sx={{ fontSize: 32, color: "secondary.main" }} />}
                value={guide.experienceYears ?? "—"}
                label="Deneyim (Yıl)"
              />
              {memberSince && (
                <StatCard
                  icon={<CalendarMonthIcon sx={{ fontSize: 32, color: "secondary.main" }} />}
                  value={memberSince}
                  label="Üyelik Tarihi"
                  small
                />
              )}
            </Box>
          </Paper>
        </Box>
      </Container>
    </Box>
  );
}

/* ── Helper Components ── */

function InfoRow({ icon, label, value }) {
  return (
    <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
      {icon}
      <Box>
        <Typography variant="caption" color="text.secondary">
          {label}
        </Typography>
        <Typography variant="body1" fontWeight={500}>
          {value || "—"}
        </Typography>
      </Box>
    </Box>
  );
}

function SocialRow({ iconSrc, label, value }) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
      <img src={iconSrc} alt={label} width={20} height={20} style={{ opacity: 0.7 }} />
      <Box>
        <Typography variant="caption" color="text.secondary">
          {label}
        </Typography>
        {value ? (
          <Typography
            variant="body2"
            fontWeight={500}
            component="a"
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              display: "block",
              color: "secondary.main",
              textDecoration: "none",
              "&:hover": { textDecoration: "underline" },
            }}
          >
            {value}
          </Typography>
        ) : (
          <Typography variant="body2" color="text.disabled">
            Henüz eklenmedi
          </Typography>
        )}
      </Box>
    </Box>
  );
}

function StatCard({ icon, value, label, small }) {
  return (
    <Box
      sx={{
        textAlign: "center",
        p: 2,
        borderRadius: 3,
        bgcolor: "background.default",
      }}
    >
      {icon}
      <Typography variant={small ? "body1" : "h4"} fontWeight={800} sx={{ mt: 1 }}>
        {value}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
    </Box>
  );
}
