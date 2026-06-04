import { useState, useEffect, useCallback } from "react";
import { Link as RouterLink } from "react-router-dom";

// MUI components
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
  Card,
  CardContent,
  CardMedia,
  Divider,
} from "@mui/material";
import MapIcon from "@mui/icons-material/Map";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import ImageNotSupportedIcon from "@mui/icons-material/ImageNotSupported";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import BusinessIcon from "@mui/icons-material/Business";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PhoneIcon from "@mui/icons-material/Phone";

import { useAuth } from "../hooks/useAuth";
import { guideApi, getImageUrl } from "../services/api";

export default function GuideToursPage() {
  const { user } = useAuth();
  const [myCompanies, setMyCompanies] = useState([]);
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
  if (!user?.id) return;
  try {
  setLoading(true);
  setError(null);
  const [companiesRes, toursRes] = await Promise.all([
  guideApi.listMyCompanies(user.id),
  guideApi.listTours(user.id),
  ]);
  setMyCompanies(companiesRes?.data ?? companiesRes ?? []);
  setTours(toursRes?.data ?? toursRes ?? []);
  } catch (err) {
  setError(err.message || "Veriler yüklenirken bir hata oluştu.");
  } finally {
  setLoading(false);
  }
  }, [user?.id]);

  useEffect(() => {
  fetchData();
  }, [fetchData]);

  const handleRemoveTour = async (tourId) => {
  if (!user?.id) return;
  try {
  await guideApi.removeTour(user.id, tourId);
  setTours((prev) => prev.filter((t) => (t._id || t.id) !== tourId));
  } catch (err) {
  setError(err.message || "Tur kaydı silinirken bir hata oluştu.");
  }
  };

  const formatDate = (dateStr) => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("tr-TR", {
  day: "numeric",
  month: "short",
  year: "numeric",
  });
  };

  const formatPrice = (price) => {
  if (price == null) return "—";
  return new Intl.NumberFormat("tr-TR", {
  style: "currency",
  currency: "TRY",
  minimumFractionDigits: 0,
  }).format(price);
  };

  // Loading skeleton
  if (loading) {
  return (
  <Box sx={{ bgcolor: "background.default", minHeight: "80vh", py: 6 }}>
  <Container maxWidth="lg">
  <Skeleton variant="text" width={300} height={48} sx={{ mb: 1 }} />
  <Skeleton variant="text" width={400} height={24} sx={{ mb: 4 }} />
  <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 3, mb: 4 }}>
  {[...Array(2)].map((_, i) => (
  <Paper key={i} sx={{ p: 3, borderRadius: 4 }}>
  <Skeleton variant="text" width="60%" height={32} />
  <Skeleton variant="text" width="80%" />
  </Paper>
  ))}
  </Box>
  <Skeleton variant="text" width={200} height={40} sx={{ mb: 2 }} />
  <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "1fr 1fr 1fr" }, gap: 3 }}>
  {[...Array(3)].map((_, i) => (
  <Paper key={i} sx={{ borderRadius: 4, overflow: "hidden" }}>
  <Skeleton variant="rectangular" height={180} />
  <Box sx={{ p: 2.5 }}>
  <Skeleton variant="text" width="70%" height={28} />
  <Skeleton variant="text" width="50%" />
  </Box>
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
  <Button color="inherit" size="small" onClick={fetchData}>
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
  <CheckCircleIcon color="secondary" />
  Turlarım & Firmalarım
  </Typography>
  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
  Kayıtlı olduğunuz firmalar ve size atanan turlar
  </Typography>
  </Box>
  <Button
  component={RouterLink}
  to="/guide"
  startIcon={<ArrowBackIcon />}
  variant="outlined"
  color="secondary"
  >
  Panele Dön
  </Button>
  </Box>

  {/* Registered Companies Section */}
  <Typography
  variant="h5"
  fontWeight={700}
  sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}
  >
  <BusinessIcon color="secondary" />
  Firmalar
  </Typography>

  {myCompanies.length === 0 ? (
  <Paper
  elevation={0}
  sx={{
  p: 5,
  borderRadius: 4,
  border: "1px solid",
  borderColor: "divider",
  textAlign: "center",
  mb: 5,
  }}
  >
  <BusinessIcon sx={{ fontSize: 56, color: "text.disabled", mb: 2 }} />
  <Typography variant="h6" color="text.secondary" gutterBottom>
  Henüz bir firmaya kayıt olmadınız
  </Typography>
  <Button
  component={RouterLink}
  to="/guide/companies"
  variant="contained"
  color="secondary"
  sx={{ mt: 1 }}
  >
  Tur Firmalarına Göz At
  </Button>
  </Paper>
  ) : (
  <Box
  sx={{
  display: "grid",
  gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "1fr 1fr 1fr" },
  gap: 3,
  mb: 5,
  }}
  >
  {myCompanies.map((company) => {
  const cId = company._id || company.id;
  return (
  <Paper
  key={cId}
  elevation={0}
  sx={{
  p: 3,
  borderRadius: 4,
  border: "1px solid",
  borderColor: "success.light",
  transition: "all 0.2s ease",
  "&:hover": {
  borderColor: "success.main",
  boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
  },
  }}
  >
  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
  <BusinessIcon sx={{ color: "secondary.main", fontSize: 28 }} />
  <Typography variant="h6" fontWeight={700} noWrap>
  {company.name}
  </Typography>
  </Box>
  {company.description && (
  <Typography
  variant="body2"
  color="text.secondary"
  sx={{
  mb: 1,
  display: "-webkit-box",
  WebkitLineClamp: 2,
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
  }}
  >
  {company.description}
  </Typography>
  )}
  {company.phone && (
  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 0.5 }}>
  <PhoneIcon sx={{ fontSize: 16, color: "text.secondary" }} />
  <Typography variant="body2" color="text.secondary">
  {company.phone}
  </Typography>
  </Box>
  )}
  {company.address && (
  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
  <LocationOnIcon sx={{ fontSize: 16, color: "text.secondary" }} />
  <Typography variant="body2" color="text.secondary" noWrap>
  {company.address}
  </Typography>
  </Box>
  )}
  <Chip
  icon={<CheckCircleIcon />}
  label="Kayıtlı"
  color="success"
  size="small"
  variant="outlined"
  sx={{ mt: 1.5 }}
  />
  </Paper>
  );
  })}
  </Box>
  )}

  <Divider sx={{ mb: 4 }} />

  {/* Tours Section */}
  <Typography
  variant="h5"
  fontWeight={700}
  sx={{ mb: 1, display: "flex", alignItems: "center", gap: 1 }}
  >
  <MapIcon color="secondary" />
  Turlarım
  </Typography>
  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
  {tours.length > 0
  ? `Firmalar tarafından size atanan ${tours.length} tur listeleniyor`
  : "Henüz size atanmış tur bulunmuyor"}
  </Typography>

  {tours.length === 0 && (
  <Paper
  elevation={0}
  sx={{
  p: 5,
  borderRadius: 4,
  border: "1px solid",
  borderColor: "divider",
  textAlign: "center",
  }}
  >
  <MapIcon sx={{ fontSize: 56, color: "text.disabled", mb: 2 }} />
  <Typography variant="h6" color="text.secondary">
  Henüz atanmış turunuz yok
  </Typography>
  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
  Kayıtlı olduğunuz firmalar sizi turlarına ekledikçe burada görüntülenecektir.
  </Typography>
  </Paper>
  )}

  {tours.length > 0 && (
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
  {tours.map((tour) => (
  <TourCard
  key={tour._id || tour.id}
  tour={tour}
  formatDate={formatDate}
  formatPrice={formatPrice}
  onRemove={handleRemoveTour}
  />
  ))}
  </Box>
  )}
  </Container>
  </Box>
  );
}

/* ── Tour Card Component ── */

function TourCard({ tour, formatDate, formatPrice, onRemove }) {
  const isPast = tour.endDate && new Date(tour.endDate) < new Date();
  const tourId = tour._id || tour.id;

  return (
  <Card
  elevation={0}
  sx={{
  borderRadius: 4,
  border: "1px solid",
  borderColor: "divider",
  display: "flex",
  flexDirection: "column",
  opacity: isPast ? 0.7 : 1,
  transition: "all 0.2s ease",
  "&:hover": {
  borderColor: "secondary.light",
  boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
  },
  }}
  >
  {/* Image */}
  {tour.images?.[0] ? (
  <CardMedia
  component="img"
  height={180}
  image={getImageUrl(tour.images[0])}
  alt={tour.name}
  sx={{ objectFit: "cover" }}
  />
  ) : (
  <Box
  sx={{
  height: 180,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  bgcolor: "grey.100",
  }}
  >
  <ImageNotSupportedIcon sx={{ fontSize: 48, color: "grey.400" }} />
  </Box>
  )}

  <CardContent sx={{ flexGrow: 1, p: 2.5 }}>
  {/* Status chip */}
  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
  <Typography variant="h6" fontWeight={700} noWrap sx={{ flex: 1, mr: 1 }}>
  {tour.name}
  </Typography>
  {isPast && (
  <Chip label="Tamamlandı" size="small" color="default" variant="outlined" />
  )}
  </Box>

  {/* Location */}
  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 1 }}>
  <LocationOnIcon sx={{ fontSize: 18, color: "text.secondary" }} />
  <Typography variant="body2" color="text.secondary" noWrap>
  {tour.location}
  </Typography>
  </Box>

  {/* Date range */}
  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 1 }}>
  <CalendarMonthIcon sx={{ fontSize: 18, color: "text.secondary" }} />
  <Typography variant="body2" color="text.secondary">
  {formatDate(tour.startDate)} – {formatDate(tour.endDate)}
  </Typography>
  </Box>

  {/* Rating */}
  {tour.rating > 0 && (
  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 1.5 }}>
  <Rating value={tour.rating} precision={0.1} size="small" readOnly />
  <Typography variant="body2" color="text.secondary">
  {tour.rating.toFixed(1)}
  </Typography>
  </Box>
  )}

  {/* Price & Actions */}
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
  <Typography variant="h6" fontWeight={800} color="secondary.main">
  {formatPrice(tour.price)}
  </Typography>
  <Button
  size="small"
  color="error"
  startIcon={<RemoveCircleOutlineIcon />}
  sx={{ textTransform: "none", fontWeight: 600 }}
  onClick={() => onRemove(tourId)}
  >
  Kaydı Sil
  </Button>
  </Box>
  </CardContent>
  </Card>
  );
}
