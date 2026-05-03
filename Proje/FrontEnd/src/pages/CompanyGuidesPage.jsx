import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

import {
  Container,
  Typography,
  Box,
  Paper,
  Skeleton,
  Alert,
  Button,
  Chip,
  Rating,
  Avatar,
  Card,
  CardContent,
  CardActionArea,
} from "@mui/material";
import GroupsIcon from "@mui/icons-material/Groups";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LanguageIcon from "@mui/icons-material/Language";
import ExploreIcon from "@mui/icons-material/Explore";
import WorkHistoryIcon from "@mui/icons-material/WorkHistory";
import VisibilityIcon from "@mui/icons-material/Visibility";

import { useAuth } from "../hooks/useAuth";
import { companyTourApi, getImageUrl } from "../services/api";

export default function CompanyGuidesPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchGuides = useCallback(async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      setError(null);
      const res = await companyTourApi.listGuides(user.id);
      setGuides(res.data ?? []);
    } catch (err) {
      setError(err.message || "Rehberler yüklenirken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchGuides();
  }, [fetchGuides]);

  // Loading skeleton
  if (loading) {
    return (
      <Box sx={{ bgcolor: "background.default", minHeight: "80vh", py: 6 }}>
        <Container maxWidth="lg">
          <Skeleton variant="text" width={240} height={48} sx={{ mb: 1 }} />
          <Skeleton variant="text" width={360} height={24} sx={{ mb: 4 }} />
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "1fr 1fr 1fr" },
              gap: 3,
            }}
          >
            {[...Array(6)].map((_, i) => (
              <Paper key={i} sx={{ borderRadius: 4, overflow: "hidden", p: 3 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                  <Skeleton variant="circular" width={64} height={64} />
                  <Box sx={{ flex: 1 }}>
                    <Skeleton variant="text" width="70%" height={28} />
                    <Skeleton variant="text" width="50%" />
                  </Box>
                </Box>
                <Skeleton variant="text" />
                <Skeleton variant="text" width="60%" />
              </Paper>
            ))}
          </Box>
        </Container>
      </Box>
    );
  }

  // Error state
  if (error) {
    return (
      <Box sx={{ bgcolor: "background.default", minHeight: "80vh", py: 6 }}>
        <Container maxWidth="md" sx={{ textAlign: "center" }}>
          <Alert
            severity="error"
            sx={{ maxWidth: 520, mx: "auto", mb: 3 }}
            action={
              <Button color="inherit" size="small" onClick={fetchGuides}>
                Tekrar Dene
              </Button>
            }
          >
            {error}
          </Alert>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "80vh", py: 6 }}>
      <Container maxWidth="lg">
        {/* Page header */}
        <Box
          sx={{
            display: "flex",
            alignItems: { xs: "flex-start", sm: "center" },
            justifyContent: "space-between",
            flexDirection: { xs: "column", sm: "row" },
            gap: 2,
            mb: 4,
          }}
        >
          <Box>
            <Typography
              variant="h4"
              fontWeight={800}
              sx={{ display: "flex", alignItems: "center", gap: 1 }}
            >
              <GroupsIcon color="secondary" />
              Rehberlerim
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {guides.length > 0
                ? `Firmanıza bağlı ${guides.length} rehber listeleniyor`
                : "Henüz kayıtlı rehber bulunmuyor"}
            </Typography>
          </Box>
          <Button
            onClick={() => navigate("/company/dashboard")}
            startIcon={<ArrowBackIcon />}
            variant="outlined"
            color="primary"
          >
            Panele Dön
          </Button>
        </Box>

        {/* Empty state */}
        {guides.length === 0 && (
          <Paper
            elevation={0}
            sx={{
              p: 6,
              borderRadius: 4,
              border: "1px solid",
              borderColor: "divider",
              textAlign: "center",
            }}
          >
            <GroupsIcon sx={{ fontSize: 64, color: "text.disabled", mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Henüz kayıtlı rehberiniz yok
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Rehberler firmanıza başvurduğunda burada listelenecektir.
            </Typography>
          </Paper>
        )}

        {/* Guides grid */}
        {guides.length > 0 && (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "1fr 1fr",
                md: "1fr 1fr 1fr",
              },
              gap: 3,
            }}
          >
            {guides.map((guide) => (
              <GuideCard
                key={guide.id}
                guide={guide}
                onDetail={() => navigate(`/company/guides/${guide.id}`)}
              />
            ))}
          </Box>
        )}
      </Container>
    </Box>
  );
}

/* ── Guide Card Component ── */

function GuideCard({ guide, onDetail }) {
  const fullName = `${guide.firstName || ""} ${guide.lastName || ""}`.trim();
  const profileSrc = guide.profileImageUrl
    ? guide.profileImageUrl.startsWith("http")
      ? guide.profileImageUrl
      : getImageUrl(guide.profileImageUrl)
    : null;

  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 4,
        border: "1px solid",
        borderColor: "divider",
        transition: "all 0.25s ease",
        "&:hover": {
          borderColor: "secondary.light",
          boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
          transform: "translateY(-2px)",
        },
      }}
    >
      <CardActionArea onClick={onDetail} sx={{ height: "100%" }}>
        <CardContent sx={{ p: 3, display: "flex", flexDirection: "column", height: "100%" }}>
          {/* Avatar + Name */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
            <Avatar
              src={profileSrc}
              sx={{
                width: 64,
                height: 64,
                bgcolor: "secondary.main",
                fontSize: 24,
                fontWeight: 800,
              }}
            >
              {guide.firstName?.charAt(0)?.toUpperCase()}
            </Avatar>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="h6" fontWeight={700} noWrap>
                {fullName || "İsimsiz Rehber"}
              </Typography>
              {guide.rating > 0 && (
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <Rating value={guide.rating} precision={0.1} size="small" readOnly />
                  <Typography variant="body2" color="text.secondary">
                    {guide.rating.toFixed(1)}
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>

          {/* Languages */}
          {guide.languages?.length > 0 && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 1 }}>
              <LanguageIcon sx={{ fontSize: 18, color: "text.secondary" }} />
              <Typography variant="body2" color="text.secondary" noWrap>
                {guide.languages.join(", ")}
              </Typography>
            </Box>
          )}

          {/* Expert Routes */}
          {guide.expertRoutes?.length > 0 && (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mb: 1.5 }}>
              {guide.expertRoutes.slice(0, 3).map((route) => (
                <Chip
                  key={route}
                  icon={<ExploreIcon sx={{ fontSize: 14 }} />}
                  label={route}
                  size="small"
                  variant="outlined"
                  color="secondary"
                />
              ))}
              {guide.expertRoutes.length > 3 && (
                <Chip
                  label={`+${guide.expertRoutes.length - 3}`}
                  size="small"
                  variant="outlined"
                />
              )}
            </Box>
          )}

          {/* Footer */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mt: "auto",
              pt: 1.5,
              borderTop: "1px solid",
              borderColor: "divider",
            }}
          >
            {guide.experienceYears > 0 ? (
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <WorkHistoryIcon sx={{ fontSize: 16, color: "text.secondary" }} />
                <Typography variant="caption" color="text.secondary">
                  {guide.experienceYears} yıl deneyim
                </Typography>
              </Box>
            ) : (
              <Box />
            )}
            <Button
              size="small"
              startIcon={<VisibilityIcon />}
              sx={{ color: "text.secondary", textTransform: "none", fontWeight: 600 }}
            >
              Detaylar
            </Button>
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
