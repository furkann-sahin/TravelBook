import { useState, useEffect, useCallback } from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  Chip,
  CircularProgress,
  Alert,
  Rating,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import WorkIcon from "@mui/icons-material/Work";
import TranslateIcon from "@mui/icons-material/Translate";
import { guideApi, getImageUrl } from "../services/api";

export default function GuideList() {
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchGuides = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await guideApi.getAllGuides();
      setGuides(res.data || []);
    } catch {
      setError("Rehberler yüklenirken bir hata oluştu.");
      setGuides([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGuides();
  }, [fetchGuides]);

  return (
    <Box sx={{ pt: 4, pb: 8, minHeight: "80vh" }}>
      <Container maxWidth="lg">
        {/* Page Header */}
        <Box sx={{ mb: 4, textAlign: "center" }}>
          <Typography variant="h3" fontWeight={800} gutterBottom>
            Tur Rehberleri
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, mx: "auto" }}>
            Deneyimli rehberlerimizi tanıyın ve turlarınız için en uygun rehberi seçin.
          </Typography>
        </Box>

        {/* Loading */}
        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
            <CircularProgress color="secondary" />
          </Box>
        )}

        {/* Error */}
        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        {/* Guide Cards */}
        {!loading && !error && (
          <Grid container spacing={3}>
            {guides.map((guide) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={guide.id}>
                <Card
                  elevation={0}
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    borderRadius: 3,
                    border: "1px solid",
                    borderColor: "divider",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: "0 12px 24px rgba(0,0,0,0.1)",
                    },
                  }}
                >
                  <CardContent sx={{ flexGrow: 1, p: 3 }}>
                    {/* Avatar & Name */}
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                      <Avatar
                        src={getImageUrl(guide.profileImage) || undefined}
                        sx={{ width: 56, height: 56, bgcolor: "secondary.main" }}
                      >
                        <PersonIcon fontSize="large" />
                      </Avatar>
                      <Box>
                        <Typography variant="h6" fontWeight={700}>
                          {guide.name}
                        </Typography>
                        {guide.rating > 0 && (
                          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                            <Rating value={guide.rating} precision={0.5} size="small" readOnly />
                            <Typography variant="body2" color="text.secondary">
                              ({guide.rating})
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    </Box>

                    {/* Bio */}
                    {guide.bio && (
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {guide.bio}
                      </Typography>
                    )}

                    {/* Experience */}
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 1 }}>
                      <WorkIcon sx={{ fontSize: 18, color: "secondary.main" }} />
                      <Typography variant="body2" color="text.secondary">
                        {guide.experience} yıl deneyim
                      </Typography>
                    </Box>

                    {/* Email */}
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 1 }}>
                      <EmailIcon sx={{ fontSize: 18, color: "text.disabled" }} />
                      <Typography variant="body2" color="text.secondary">
                        {guide.email}
                      </Typography>
                    </Box>

                    {/* Phone */}
                    {guide.phone && (
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 1.5 }}>
                        <PhoneIcon sx={{ fontSize: 18, color: "text.disabled" }} />
                        <Typography variant="body2" color="text.secondary">
                          {guide.phone}
                        </Typography>
                      </Box>
                    )}

                    {/* Languages */}
                    {guide.languages && guide.languages.length > 0 && (
                      <Box sx={{ mt: "auto" }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 1 }}>
                          <TranslateIcon sx={{ fontSize: 18, color: "secondary.main" }} />
                          <Typography variant="body2" fontWeight={600}>
                            Diller
                          </Typography>
                        </Box>
                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                          {guide.languages.map((lang) => (
                            <Chip key={lang} label={lang} size="small" variant="outlined" />
                          ))}
                        </Box>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}

            {/* Empty State */}
            {guides.length === 0 && (
              <Grid size={12}>
                <Box sx={{ textAlign: "center", py: 8 }}>
                  <PersonIcon sx={{ fontSize: 64, color: "text.disabled", mb: 2 }} />
                  <Typography variant="h5" fontWeight={600} gutterBottom>
                    Henüz rehber bulunamadı
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Sistemde kayıtlı tur rehberi bulunmamaktadır.
                  </Typography>
                </Box>
              </Grid>
            )}
          </Grid>
        )}
      </Container>
    </Box>
  );
}
