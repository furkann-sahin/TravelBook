import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

// MUI Components
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Chip,
  InputAdornment,
  CircularProgress,
  Alert,
  Paper,
  IconButton,
  Collapse,
  Rating,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import FilterListIcon from "@mui/icons-material/FilterList";
import ClearIcon from "@mui/icons-material/Clear";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import { tourApi, favoriteApi, getImageUrl } from "../services/api";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import CancelIcon from "@mui/icons-material/Cancel";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useAuth } from "../hooks/useAuth";

export default function ToursPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filtersOpen, setFiltersOpen] = useState(true);
  const [hasSearched, setHasSearched] = useState(false);

  // Filter state
  const [filters, setFilters] = useState({
    title: "",
    location: "",
    minPrice: "",
    maxPrice: "",
    date: "",
  });
  const [appliedFilters, setAppliedFilters] = useState({});
  const [purchaseLoading, setPurchaseLoading] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [selectedTour, setSelectedTour] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [purchasedTours, setPurchasedTours] = useState({});
  const [cancelLoading, setCancelLoading] = useState(null);
  const [cancelConfirmOpen, setCancelConfirmOpen] = useState(false);
  const [cancelTour, setCancelTour] = useState(null);
  const [favoriteTours, setFavoriteTours] = useState({});
  const [favoriteLoading, setFavoriteLoading] = useState(null);

  const fetchTours = useCallback(async (queryFilters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const res = await tourApi.getTours(queryFilters);
      setTours(res.data || []);
    } catch {
      setError("Turlar yüklenirken bir hata oluştu.");
      setTours([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleFilterChange = (field) => (e) => {
    setFilters((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setError(null);

    const activeFilters = {};
    if (filters.title.trim()) activeFilters.title = filters.title.trim();
    if (filters.location.trim())
      activeFilters.location = filters.location.trim();
    if (filters.minPrice) activeFilters.minPrice = filters.minPrice;
    if (filters.maxPrice) activeFilters.maxPrice = filters.maxPrice;
    if (filters.date) activeFilters.date = filters.date;

    setAppliedFilters(activeFilters);
    setHasSearched(true);
    fetchTours(activeFilters);
  };

  const handleClear = () => {
    setFilters({
      title: "",
      location: "",
      minPrice: "",
      maxPrice: "",
      date: "",
    });
    setAppliedFilters({});
    setTours([]);
    setHasSearched(false);
    setError(null);
    setLoading(false);
  };

  const handleOpenConfirm = (tour) => {
    setSelectedTour(tour);
    setConfirmOpen(true);
  };

  const handleCloseConfirm = () => {
    setConfirmOpen(false);
    setSelectedTour(null);
  };

  const handleConfirmPurchase = async () => {
    if (!selectedTour) return;
    const tourId = selectedTour.id;
    setConfirmOpen(false);
    setPurchaseLoading(tourId);
    try {
      const res = await tourApi.purchaseTour(tourId);
      const purchaseId = res?.data?.purchaseId;
      setPurchasedTours((prev) => ({ ...prev, [tourId]: purchaseId }));
      setSnackbar({
        open: true,
        message: "Satın alma başarılı!",
        severity: "success",
      });
    } catch {
      setSnackbar({
        open: true,
        message: "Satın alma sırasında bir hata oluştu.",
        severity: "error",
      });
    } finally {
      setPurchaseLoading(null);
      setSelectedTour(null);
    }
  };

  const handleOpenCancelConfirm = (tour) => {
    setCancelTour(tour);
    setCancelConfirmOpen(true);
  };

  const handleCloseCancelConfirm = () => {
    setCancelConfirmOpen(false);
    setCancelTour(null);
  };

  const handleConfirmCancel = async () => {
    if (!cancelTour) return;
    const tourId = cancelTour.id;
    const purchaseId = purchasedTours[tourId];
    setCancelConfirmOpen(false);
    setCancelLoading(tourId);
    try {
      await tourApi.cancelPurchase(purchaseId);
      setPurchasedTours((prev) => {
        const updated = { ...prev };
        delete updated[tourId];
        return updated;
      });
      setSnackbar({
        open: true,
        message: "Satın alma iptal edildi!",
        severity: "success",
      });
    } catch {
      setSnackbar({
        open: true,
        message: "İptal sırasında bir hata oluştu.",
        severity: "error",
      });
    } finally {
      setCancelLoading(null);
      setCancelTour(null);
    }
  };

  const handleToggleFavorite = async (tour) => {
    if (!user?.id) {
      setSnackbar({
        open: true,
        message: "Favorilere eklemek için giriş yapın.",
        severity: "warning",
      });
      return;
    }
    const tourId = tour.id;
    setFavoriteLoading(tourId);
    if (favoriteTours[tourId]) {
      // Favoriden kaldır
      try {
        await favoriteApi.removeFavorite(user.id, tourId);
        setFavoriteTours((prev) => {
          const u = { ...prev };
          delete u[tourId];
          return u;
        });
        setSnackbar({
          open: true,
          message: "Favorilerden kaldırıldı!",
          severity: "success",
        });
      } catch {
        setSnackbar({
          open: true,
          message: "Favori kaldırılırken bir hata oluştu.",
          severity: "error",
        });
      } finally {
        setFavoriteLoading(null);
      }
    } else {
      // Favoriye ekle
      try {
        await favoriteApi.addFavorite(user.id, tourId);
        setFavoriteTours((prev) => ({ ...prev, [tourId]: true }));
        setSnackbar({
          open: true,
          message: "Favorilere eklendi!",
          severity: "success",
        });
      } catch {
        setSnackbar({
          open: true,
          message: "Favorilere eklenirken bir hata oluştu.",
          severity: "error",
        });
      } finally {
        setFavoriteLoading(null);
      }
    }
  };

  const hasActiveFilters = Object.keys(appliedFilters).length > 0;

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("tr-TR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <Box sx={{ pt: 4, pb: 8, minHeight: "80vh" }}>
      <Container maxWidth="lg">
        {/* Page Header */}
        <Box sx={{ mb: 4, textAlign: "center" }}>
          <Typography variant="h3" fontWeight={800} gutterBottom>
            Turları Keşfet
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ maxWidth: 600, mx: "auto" }}
          >
            Hayalinizdeki tatili bulun. Lokasyon, fiyat aralığı veya tarih ile
            arama yapın.
          </Typography>
        </Box>

        {/* Filter Section */}
        <Paper
          elevation={0}
          sx={{
            mb: 4,
            p: 3,
            borderRadius: 3,
            border: "1px solid",
            borderColor: "divider",
            bgcolor: "background.paper",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: filtersOpen ? 2 : 0,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <FilterListIcon color="secondary" />
              <Typography variant="h6" fontWeight={600}>
                Filtrele
              </Typography>
              {hasActiveFilters && (
                <Chip
                  label={`${Object.keys(appliedFilters).length} filtre aktif`}
                  size="small"
                  color="secondary"
                  sx={{ ml: 1 }}
                />
              )}
            </Box>
            <IconButton
              size="small"
              onClick={() => setFiltersOpen(!filtersOpen)}
            >
              <FilterListIcon
                sx={{
                  transform: filtersOpen ? "rotate(180deg)" : "none",
                  transition: "0.3s",
                }}
              />
            </IconButton>
          </Box>

          <Collapse in={filtersOpen}>
            <Box component="form" onSubmit={handleSearch}>
              <Grid container spacing={2} alignItems="flex-end">
                {/* Title */}
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <TextField
                    fullWidth
                    label="Tur Adı"
                    placeholder="Ör: Kapadokya"
                    value={filters.title}
                    onChange={handleFilterChange("title")}
                    size="small"
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <SearchIcon fontSize="small" color="action" />
                          </InputAdornment>
                        ),
                      },
                    }}
                  />
                </Grid>

                {/* Location */}
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <TextField
                    fullWidth
                    label="Lokasyon"
                    placeholder="Ör: İstanbul"
                    value={filters.location}
                    onChange={handleFilterChange("location")}
                    size="small"
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <LocationOnIcon fontSize="small" color="action" />
                          </InputAdornment>
                        ),
                      },
                    }}
                  />
                </Grid>

                {/* Min Price */}
                <Grid size={{ xs: 6, sm: 3, md: 2 }}>
                  <TextField
                    fullWidth
                    label="Min Fiyat"
                    placeholder="₺0"
                    type="number"
                    value={filters.minPrice}
                    onChange={handleFilterChange("minPrice")}
                    size="small"
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <AttachMoneyIcon fontSize="small" color="action" />
                          </InputAdornment>
                        ),
                        inputProps: { min: 0 },
                      },
                    }}
                  />
                </Grid>

                {/* Max Price */}
                <Grid size={{ xs: 6, sm: 3, md: 2 }}>
                  <TextField
                    fullWidth
                    label="Max Fiyat"
                    placeholder="₺10000"
                    type="number"
                    value={filters.maxPrice}
                    onChange={handleFilterChange("maxPrice")}
                    size="small"
                    slotProps={{
                      input: {
                        inputProps: { min: 0 },
                      },
                    }}
                  />
                </Grid>

                {/* Date */}
                <Grid size={{ xs: 12, sm: 6, md: 2 }}>
                  <TextField
                    fullWidth
                    label="Tarih"
                    type="date"
                    value={filters.date}
                    onChange={handleFilterChange("date")}
                    size="small"
                    slotProps={{
                      inputLabel: { shrink: true },
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <CalendarTodayIcon
                              fontSize="small"
                              color="action"
                            />
                          </InputAdornment>
                        ),
                      },
                    }}
                  />
                </Grid>

                {/* Buttons */}
                <Grid size={{ xs: 12, md: 2 }}>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <Button
                      type="submit"
                      variant="contained"
                      color="secondary"
                      fullWidth
                      startIcon={<SearchIcon />}
                      sx={{ borderRadius: 2, py: 0.9 }}
                    >
                      Ara
                    </Button>
                    {hasActiveFilters && (
                      <IconButton
                        onClick={handleClear}
                        color="error"
                        size="small"
                        sx={{
                          border: "1px solid",
                          borderColor: "error.light",
                          borderRadius: 2,
                        }}
                      >
                        <ClearIcon />
                      </IconButton>
                    )}
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Collapse>
        </Paper>

        {/* Results Info */}
        {!loading && !error && hasSearched && (
          <Box
            sx={{
              mb: 3,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography variant="body2" color="text.secondary">
              {tours.length > 0
                ? `${tours.length} tur bulundu`
                : "Sonuç bulunamadı"}
            </Typography>
            {hasActiveFilters && (
              <Button
                size="small"
                onClick={handleClear}
                startIcon={<ClearIcon />}
              >
                Filtreleri Temizle
              </Button>
            )}
          </Box>
        )}

        {/* Loading */}
        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
            <CircularProgress color="secondary" />
          </Box>
        )}

        {!loading && !hasSearched && !error && (
          <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
            Filtre eklemeden de Ara butonuna basarak tüm turları
            görüntüleyebilirsiniz.
          </Alert>
        )}

        {/* Error */}
        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        {/* Tour Cards */}
        {!loading && !error && hasSearched && (
          <Grid container spacing={3}>
            {tours.map((tour) => (
              <Grid
                size={{ xs: 12, sm: 6, md: 4 }}
                key={tour.id || `${tour.name}-${tour.startDate}`}
              >
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
                    image={
                      getImageUrl(tour.imageUrl) ||
                      "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600"
                    }
                    alt={tour.name}
                    sx={{ objectFit: "cover" }}
                  />
                  <CardContent sx={{ flexGrow: 1, p: 2.5 }}>
                    <Typography
                      variant="h6"
                      fontWeight={700}
                      gutterBottom
                      noWrap
                    >
                      {tour.name}
                    </Typography>

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 0.5,
                        mb: 1,
                      }}
                    >
                      <LocationOnIcon
                        sx={{ fontSize: 18, color: "secondary.main" }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        {tour.location}
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 0.5,
                        mb: 1.5,
                      }}
                    >
                      <CalendarTodayIcon
                        sx={{ fontSize: 16, color: "text.disabled" }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        {formatDate(tour.startDate)} –{" "}
                        {formatDate(tour.endDate)}
                      </Typography>
                    </Box>

                    {tour.rating > 0 && (
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 0.5,
                          mb: 1.5,
                        }}
                      >
                        <Rating
                          value={tour.rating}
                          precision={0.5}
                          size="small"
                          readOnly
                        />
                        <Typography variant="body2" color="text.secondary">
                          ({tour.rating})
                        </Typography>
                      </Box>
                    )}

                    {tour.services?.length > 0 && (
                      <Box
                        sx={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: 0.5,
                          mb: 1.5,
                        }}
                      >
                        {tour.services.map((service) => (
                          <Chip
                            key={service}
                            label={service}
                            size="small"
                            variant="outlined"
                            color="secondary"
                          />
                        ))}
                      </Box>
                    )}

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        mt: "auto",
                      }}
                    >
                      <Typography
                        variant="h5"
                        fontWeight={800}
                        color="secondary.main"
                      >
                        ₺{tour.price?.toLocaleString("tr-TR")}
                      </Typography>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        {tour.companyName && (
                          <Chip
                            label={tour.companyName}
                            size="small"
                            variant="outlined"
                          />
                        )}
                        <Button
                          size="small"
                          variant="outlined"
                          color="secondary"
                          onClick={() => navigate(`/tours/${tour.id}`)}
                          disabled={!tour.id}
                        >
                          Detay
                        </Button>
                      </Box>
                    </Box>

                    <Button
                      variant={
                        favoriteTours[tour.id] ? "contained" : "outlined"
                      }
                      color="error"
                      fullWidth
                      startIcon={
                        favoriteTours[tour.id] ? (
                          <FavoriteIcon />
                        ) : (
                          <FavoriteBorderIcon />
                        )
                      }
                      onClick={() => handleToggleFavorite(tour)}
                      disabled={favoriteLoading === tour.id}
                      sx={{ mt: 2, borderRadius: 2, py: 1 }}
                    >
                      {favoriteLoading === tour.id
                        ? "İşleniyor..."
                        : favoriteTours[tour.id]
                          ? "Favorilerde"
                          : "Favorilere Ekle"}
                    </Button>

                    <Button
                      variant="contained"
                      color="secondary"
                      fullWidth
                      startIcon={<ShoppingCartIcon />}
                      onClick={() => handleOpenConfirm(tour)}
                      disabled={
                        purchaseLoading === tour.id || !!purchasedTours[tour.id]
                      }
                      sx={{ mt: 1, borderRadius: 2, py: 1 }}
                    >
                      {purchaseLoading === tour.id
                        ? "İşleniyor..."
                        : purchasedTours[tour.id]
                          ? "Satın Alındı"
                          : "Satın Al"}
                    </Button>

                    {purchasedTours[tour.id] && (
                      <Button
                        variant="outlined"
                        color="error"
                        fullWidth
                        startIcon={<CancelIcon />}
                        onClick={() => handleOpenCancelConfirm(tour)}
                        disabled={cancelLoading === tour.id}
                        sx={{ mt: 1, borderRadius: 2, py: 1 }}
                      >
                        {cancelLoading === tour.id
                          ? "İptal ediliyor..."
                          : "İptal Et"}
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}

            {/* Empty State */}
            {tours.length === 0 && (
              <Grid size={12}>
                <Box sx={{ textAlign: "center", py: 8 }}>
                  <SearchIcon
                    sx={{ fontSize: 64, color: "text.disabled", mb: 2 }}
                  />
                  <Typography variant="h5" fontWeight={600} gutterBottom>
                    Tur bulunamadı
                  </Typography>
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{ mb: 3 }}
                  >
                    Filtrelerinizi değiştirerek tekrar deneyin.
                  </Typography>
                  {hasActiveFilters && (
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={handleClear}
                      startIcon={<ClearIcon />}
                    >
                      Tüm Filtreleri Temizle
                    </Button>
                  )}
                </Box>
              </Grid>
            )}
          </Grid>
        )}
      </Container>

      {/* Purchase Confirm Dialog */}
      <Dialog
        open={confirmOpen}
        onClose={handleCloseConfirm}
        maxWidth="xs"
        fullWidth
        slotProps={{ paper: { sx: { borderRadius: 3 } } }}
      >
        <DialogTitle sx={{ fontWeight: 700, pb: 1 }}>
          Satın Alma Onayı
        </DialogTitle>
        <Divider />
        {selectedTour && (
          <DialogContent sx={{ pt: 2.5 }}>
            <Typography variant="body1" gutterBottom>
              Bu turu satın almak istediğinizden emin misiniz?
            </Typography>
            <Box sx={{ mt: 2, p: 2, bgcolor: "grey.50", borderRadius: 2 }}>
              <Typography variant="subtitle1" fontWeight={700}>
                {selectedTour.name}
              </Typography>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 1 }}
              >
                <LocationOnIcon
                  sx={{ fontSize: 16, color: "secondary.main" }}
                />
                <Typography variant="body2" color="text.secondary">
                  {selectedTour.location}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                  mt: 0.5,
                }}
              >
                <CalendarTodayIcon
                  sx={{ fontSize: 16, color: "text.disabled" }}
                />
                <Typography variant="body2" color="text.secondary">
                  {formatDate(selectedTour.startDate)} –{" "}
                  {formatDate(selectedTour.endDate)}
                </Typography>
              </Box>
              <Typography
                variant="h5"
                fontWeight={800}
                color="secondary.main"
                sx={{ mt: 1.5 }}
              >
                ₺{selectedTour.price?.toLocaleString("tr-TR")}
              </Typography>
              {selectedTour.companyName && (
                <Chip
                  label={selectedTour.companyName}
                  size="small"
                  variant="outlined"
                  sx={{ mt: 1 }}
                />
              )}
            </Box>
          </DialogContent>
        )}
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button
            onClick={handleCloseConfirm}
            color="inherit"
            sx={{ borderRadius: 2 }}
          >
            Vazgeç
          </Button>
          <Button
            onClick={handleConfirmPurchase}
            variant="contained"
            color="secondary"
            startIcon={<ShoppingCartIcon />}
            sx={{ borderRadius: 2 }}
          >
            Satın Al
          </Button>
        </DialogActions>
      </Dialog>

      {/* Cancel Confirm Dialog */}
      <Dialog
        open={cancelConfirmOpen}
        onClose={handleCloseCancelConfirm}
        maxWidth="xs"
        fullWidth
        slotProps={{ paper: { sx: { borderRadius: 3 } } }}
      >
        <DialogTitle sx={{ fontWeight: 700, pb: 1, color: "error.main" }}>
          Satın Alma İptali
        </DialogTitle>
        <Divider />
        {cancelTour && (
          <DialogContent sx={{ pt: 2.5 }}>
            <Typography variant="body1" gutterBottom>
              Bu tur satın alımını iptal etmek istediğinizden emin misiniz?
            </Typography>
            <Box sx={{ mt: 2, p: 2, bgcolor: "grey.50", borderRadius: 2 }}>
              <Typography variant="subtitle1" fontWeight={700}>
                {cancelTour.name}
              </Typography>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 1 }}
              >
                <LocationOnIcon
                  sx={{ fontSize: 16, color: "secondary.main" }}
                />
                <Typography variant="body2" color="text.secondary">
                  {cancelTour.location}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                  mt: 0.5,
                }}
              >
                <CalendarTodayIcon
                  sx={{ fontSize: 16, color: "text.disabled" }}
                />
                <Typography variant="body2" color="text.secondary">
                  {formatDate(cancelTour.startDate)} –{" "}
                  {formatDate(cancelTour.endDate)}
                </Typography>
              </Box>
              <Typography
                variant="h5"
                fontWeight={800}
                color="secondary.main"
                sx={{ mt: 1.5 }}
              >
                ₺{cancelTour.price?.toLocaleString("tr-TR")}
              </Typography>
            </Box>
          </DialogContent>
        )}
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button
            onClick={handleCloseCancelConfirm}
            color="inherit"
            sx={{ borderRadius: 2 }}
          >
            Vazgeç
          </Button>
          <Button
            onClick={handleConfirmCancel}
            variant="contained"
            color="error"
            startIcon={<CancelIcon />}
            sx={{ borderRadius: 2 }}
          >
            İptal Et
          </Button>
        </DialogActions>
      </Dialog>

      {/* Purchase Snackbar */}
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
