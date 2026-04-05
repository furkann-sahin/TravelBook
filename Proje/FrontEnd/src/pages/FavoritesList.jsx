import { useState, useEffect, useCallback } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Chip,
  CircularProgress,
  Alert,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Rating,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import FavoriteIcon from "@mui/icons-material/Favorite";
import DeleteIcon from "@mui/icons-material/Delete";
import { favoriteApi, getImageUrl } from "../services/api";
import { useAuth } from "../hooks/useAuth";

export default function FavoritesList() {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [removeLoading, setRemoveLoading] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedTour, setSelectedTour] = useState(null);

  const fetchFavorites = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    setError(null);
    try {
      const res = await favoriteApi.getFavorites(user.id);
      setFavorites(res.data || []);
    } catch {
      setError("Favoriler yüklenirken bir hata oluştu.");
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  const handleOpenConfirm = (tour) => {
    setSelectedTour(tour);
    setConfirmOpen(true);
  };

  const handleCloseConfirm = () => {
    setConfirmOpen(false);
    setSelectedTour(null);
  };

  const handleConfirmRemove = async () => {
    if (!selectedTour) return;
    const tourId = selectedTour.id;
    setConfirmOpen(false);
    setRemoveLoading(tourId);
    try {
      await favoriteApi.removeFavorite(user.id, tourId);
      setFavorites((prev) => prev.filter((t) => t.id !== tourId));
      setSnackbar({ open: true, message: "Tur favorilerden kaldırıldı!", severity: "success" });
    } catch {
      setSnackbar({ open: true, message: "Favori kaldırılırken bir hata oluştu.", severity: "error" });
    } finally {
      setRemoveLoading(null);
      setSelectedTour(null);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("tr-TR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  if (!user) {
    return (
      <Box sx={{ pt: 4, pb: 8, minHeight: "80vh" }}>
        <Container maxWidth="lg">
          <Alert severity="warning" sx={{ borderRadius: 2 }}>
            Favorilerinizi görmek için lütfen giriş yapın.
          </Alert>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ pt: 4, pb: 8, minHeight: "80vh" }}>
      <Container maxWidth="lg">
        {/* Page Header */}
        <Box sx={{ mb: 4, textAlign: "center" }}>
          <Typography variant="h3" fontWeight={800} gutterBottom>
            Favori Turlarım
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, mx: "auto" }}>
            Beğendiğiniz turları burada görüntüleyebilir ve yönetebilirsiniz.
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

        {/* Favorites Cards */}
        {!loading && !error && (
          <Grid container spacing={3}>
            {favorites.map((tour) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={tour.id}>
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
                  <CardMedia
                    component="img"
                    height="200"
                    image={getImageUrl(tour.imageUrl) || "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600"}
                    alt={tour.name}
                    sx={{ objectFit: "cover" }}
                  />
                  <CardContent sx={{ flexGrow: 1, p: 2.5 }}>
                    <Typography variant="h6" fontWeight={700} gutterBottom noWrap>
                      {tour.name}
                    </Typography>

                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 1 }}>
                      <LocationOnIcon sx={{ fontSize: 18, color: "secondary.main" }} />
                      <Typography variant="body2" color="text.secondary">
                        {tour.location}
                      </Typography>
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 1.5 }}>
                      <CalendarTodayIcon sx={{ fontSize: 16, color: "text.disabled" }} />
                      <Typography variant="body2" color="text.secondary">
                        {formatDate(tour.startDate)} – {formatDate(tour.endDate)}
                      </Typography>
                    </Box>

                    {tour.rating > 0 && (
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 1.5 }}>
                        <Rating value={tour.rating} precision={0.5} size="small" readOnly />
                        <Typography variant="body2" color="text.secondary">
                          ({tour.rating})
                        </Typography>
                      </Box>
                    )}

                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mt: "auto" }}>
                      <Typography variant="h5" fontWeight={800} color="secondary.main">
                        ₺{tour.price?.toLocaleString("tr-TR")}
                      </Typography>
                      {tour.companyName && (
                        <Chip label={tour.companyName} size="small" variant="outlined" />
                      )}
                    </Box>

                    <Button
                      variant="outlined"
                      color="error"
                      fullWidth
                      startIcon={<DeleteIcon />}
                      onClick={() => handleOpenConfirm(tour)}
                      disabled={removeLoading === tour.id}
                      sx={{ mt: 2, borderRadius: 2, py: 1 }}
                    >
                      {removeLoading === tour.id ? "Kaldırılıyor..." : "Favorilerden Kaldır"}
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}

            {/* Empty State */}
            {favorites.length === 0 && (
              <Grid size={12}>
                <Box sx={{ textAlign: "center", py: 8 }}>
                  <FavoriteIcon sx={{ fontSize: 64, color: "text.disabled", mb: 2 }} />
                  <Typography variant="h5" fontWeight={600} gutterBottom>
                    Henüz favori turunuz yok
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Turlar sayfasından beğendiğiniz turları favorilere ekleyebilirsiniz.
                  </Typography>
                </Box>
              </Grid>
            )}
          </Grid>
        )}
      </Container>

      {/* Remove Confirm Dialog */}
      <Dialog
        open={confirmOpen}
        onClose={handleCloseConfirm}
        maxWidth="xs"
        fullWidth
        slotProps={{ paper: { sx: { borderRadius: 3 } } }}
      >
        <DialogTitle sx={{ fontWeight: 700, pb: 1, color: "error.main" }}>
          Favori Kaldırma
        </DialogTitle>
        <Divider />
        {selectedTour && (
          <DialogContent sx={{ pt: 2.5 }}>
            <Typography variant="body1" gutterBottom>
              Bu turu favorilerden kaldırmak istediğinizden emin misiniz?
            </Typography>
            <Box sx={{ mt: 2, p: 2, bgcolor: "grey.50", borderRadius: 2 }}>
              <Typography variant="subtitle1" fontWeight={700}>
                {selectedTour.name}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 1 }}>
                <LocationOnIcon sx={{ fontSize: 16, color: "secondary.main" }} />
                <Typography variant="body2" color="text.secondary">
                  {selectedTour.location}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 0.5 }}>
                <CalendarTodayIcon sx={{ fontSize: 16, color: "text.disabled" }} />
                <Typography variant="body2" color="text.secondary">
                  {formatDate(selectedTour.startDate)} – {formatDate(selectedTour.endDate)}
                </Typography>
              </Box>
              <Typography variant="h5" fontWeight={800} color="secondary.main" sx={{ mt: 1.5 }}>
                ₺{selectedTour.price?.toLocaleString("tr-TR")}
              </Typography>
            </Box>
          </DialogContent>
        )}
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={handleCloseConfirm} color="inherit" sx={{ borderRadius: 2 }}>
            Vazgeç
          </Button>
          <Button
            onClick={handleConfirmRemove}
            variant="contained"
            color="error"
            startIcon={<DeleteIcon />}
            sx={{ borderRadius: 2 }}
          >
            Kaldır
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: "100%", borderRadius: 2 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
