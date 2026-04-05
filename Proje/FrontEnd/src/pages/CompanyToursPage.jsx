import { useState, useEffect, useCallback } from "react";

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
} from "@mui/material";
import MapIcon from "@mui/icons-material/Map";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import GroupIcon from "@mui/icons-material/Group";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import ImageNotSupportedIcon from "@mui/icons-material/ImageNotSupported";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AddIcon from "@mui/icons-material/Add";

import { Link as RouterLink } from "react-router-dom";

import { useAuth } from "../hooks/useAuth";
import { companyTourApi, getImageUrl } from "../services/api";

export default function CompanyToursPage() {
  const { user } = useAuth();
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTours = useCallback(async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      setError(null);
      const res = await companyTourApi.listTours(user.id);
      setTours(res.data ?? []);
    } catch (err) {
      setError(err.message || "Turlar yüklenirken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchTours();
  }, [fetchTours]);

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
              <Paper key={i} sx={{ borderRadius: 4, overflow: "hidden" }}>
                <Skeleton variant="rectangular" height={180} />
                <Box sx={{ p: 2.5 }}>
                  <Skeleton variant="text" width="70%" height={28} />
                  <Skeleton variant="text" width="50%" />
                  <Skeleton variant="text" width="40%" />
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
              <Button color="inherit" size="small" onClick={fetchTours}>
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
              <MapIcon color="secondary" />
              Turlarım
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {tours.length > 0
                ? `Toplam ${tours.length} tur listeleniyor`
                : "Henüz tur eklenmemiş"}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              component={RouterLink}
              to="/company/tours/create"
              startIcon={<AddIcon />}
              variant="contained"
              color="secondary"
            >
              Yeni Tur
            </Button>
            <Button
              component={RouterLink}
              to="/company"
              startIcon={<ArrowBackIcon />}
              variant="outlined"
              color="primary"
            >
              Panele Dön
            </Button>
          </Box>
        </Box>

        {/* Empty state */}
        {tours.length === 0 && (
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
            <MapIcon sx={{ fontSize: 64, color: "text.disabled", mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Henüz hiç turunuz yok
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Turlar oluşturulduktan sonra burada listelenecektir.
            </Typography>
            <Button
              component={RouterLink}
              to="/company/tours/create"
              startIcon={<AddIcon />}
              variant="contained"
              color="secondary"
              sx={{ mt: 2 }}
            >
              İlk Turunu Oluştur
            </Button>
          </Paper>
        )}

        {/* Tour cards grid */}
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
                key={tour.id}
                tour={tour}
                formatDate={formatDate}
                formatPrice={formatPrice}
              />
            ))}
          </Box>
        )}
      </Container>
    </Box>
  );
}

/* ── Tour Card Component ── */

function TourCard({ tour, formatDate, formatPrice }) {
  const isPast = tour.endDate && new Date(tour.endDate) < new Date();

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
      {tour.imageUrl ? (
        <CardMedia
          component="img"
          height={180}
          image={getImageUrl(tour.imageUrl)}
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

        {tour.services?.length > 0 && (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mb: 1.5 }}>
            {tour.services.map((service) => (
              <Chip key={service} label={service} size="small" variant="outlined" color="secondary" />
            ))}
          </Box>
        )}

        {/* Price & Action */}
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
            startIcon={<VisibilityIcon />}
            sx={{ color: "text.secondary", textTransform: "none", fontWeight: 600 }}
          >
            Detaylar
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}
