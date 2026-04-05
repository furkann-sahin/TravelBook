import { useState, useEffect, useCallback } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import CancelIcon from "@mui/icons-material/Cancel";
import { tourApi, purchaseApi } from "../services/api";

export default function UserTours() {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
  const [filters, setFilters] = useState({
    location: "",
    minPrice: "",
    maxPrice: "",
    date: "",
  });

  // Tur verilerini API'den yükle
  const fetchTours = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await tourApi.getTours({});
      setTours(res.data || []);
    } catch {
      setError("Turlar yüklenirken bir hata oluştu.");
      setTours([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTours();
  }, [fetchTours]);

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
      const res = await purchaseApi.purchaseTour(tourId);
      const purchaseId = res?.data?._id;
      setPurchasedTours((prev) => ({ ...prev, [tourId]: purchaseId }));
      setSnackbar({
        open: true,
        message: "Satın alma başarılı!",
        severity: "success",
      });
    } catch {
      setSnackbar({
        open: true,
        message: "Satın alma sırasında hata oluştu.",
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
      await purchaseApi.cancelPurchase(purchaseId);
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
        message: "İptal sırasında hata oluştu.",
        severity: "error",
      });
    } finally {
      setCancelLoading(null);
      setCancelTour(null);
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("tr-TR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // Filtreleme işlemi (frontend)
  const filteredTours = tours.filter((tour) => {
    return (
      (!filters.location ||
        tour.location.toLowerCase().includes(filters.location.toLowerCase())) &&
      (!filters.minPrice || tour.price >= Number(filters.minPrice)) &&
      (!filters.maxPrice || tour.price <= Number(filters.maxPrice)) &&
      (!filters.date || tour.date === filters.date)
    );
  });

  return (
    <Box sx={{ pt: 4, pb: 8, minHeight: "80vh" }}>
      <Container maxWidth="lg">
        <Box sx={{ mb: 4, textAlign: "center" }}>
          <Typography variant="h3" fontWeight={800} gutterBottom>
            Turlar
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ maxWidth: 550, mx: "auto" }}
          >
            Mevcut turları inceleyin ve dilediğiniz turu satın alın.
          </Typography>
        </Box>

        {/* Filtreleme alanı */}
        <Box sx={{ mb: 3, display: "flex", gap: 2, flexWrap: "wrap" }}>
          <input
            placeholder="Konum"
            value={filters.location}
            onChange={(e) =>
              setFilters({ ...filters, location: e.target.value })
            }
          />
          <input
            type="number"
            placeholder="Min Fiyat"
            value={filters.minPrice}
            onChange={(e) =>
              setFilters({ ...filters, minPrice: e.target.value })
            }
          />
          <input
            type="number"
            placeholder="Max Fiyat"
            value={filters.maxPrice}
            onChange={(e) =>
              setFilters({ ...filters, maxPrice: e.target.value })
            }
          />
          <input
            type="date"
            value={filters.date}
            onChange={(e) => setFilters({ ...filters, date: e.target.value })}
          />
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
            <CircularProgress color="secondary" />
          </Box>
        ) : !error && (
          <Grid container spacing={3}>
            {filteredTours.length === 0 ? (
              <Typography variant="body1" sx={{ m: 2 }}>
                Tur bulunamadı.
              </Typography>
            ) : (
              filteredTours.map((tour) => (
                <Grid item xs={12} sm={6} md={4} key={tour.id}>
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
                    <CardContent
                      sx={{
                        flexGrow: 1,
                        p: 2.5,
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <Typography variant="h6" fontWeight={700} gutterBottom>
                        {tour.title}
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
                          mb: 2,
                        }}
                      >
                        <CalendarTodayIcon
                          sx={{ fontSize: 16, color: "text.disabled" }}
                        />
                        <Typography variant="body2" color="text.secondary">
                          {formatDate(tour.date)}
                        </Typography>
                      </Box>

                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          mb: 2,
                        }}
                      >
                        <Typography
                          variant="h5"
                          fontWeight={800}
                          color="secondary.main"
                        >
                          ₺{tour.price.toLocaleString("tr-TR")}
                        </Typography>
                        <Chip
                          label={tour.location}
                          size="small"
                          variant="outlined"
                        />
                      </Box>

                      <Button
                        variant="contained"
                        color="secondary"
                        fullWidth
                        startIcon={<ShoppingCartIcon />}
                        onClick={() => handleOpenConfirm(tour)}
                        disabled={purchaseLoading === tour.id || !!purchasedTours[tour.id]}
                        sx={{ mt: "auto", borderRadius: 2, py: 1 }}
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
                          {cancelLoading === tour.id ? "İptal ediliyor..." : "İptal Et"}
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              ))
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
                {selectedTour.title}
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
                  {formatDate(selectedTour.date)}
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
                {cancelTour.title}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 1 }}>
                <LocationOnIcon sx={{ fontSize: 16, color: "secondary.main" }} />
                <Typography variant="body2" color="text.secondary">
                  {cancelTour.location}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 0.5 }}>
                <CalendarTodayIcon sx={{ fontSize: 16, color: "text.disabled" }} />
                <Typography variant="body2" color="text.secondary">
                  {formatDate(cancelTour.date)}
                </Typography>
              </Box>
              <Typography variant="h5" fontWeight={800} color="secondary.main" sx={{ mt: 1.5 }}>
                ₺{cancelTour.price?.toLocaleString("tr-TR")}
              </Typography>
            </Box>
          </DialogContent>
        )}
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={handleCloseCancelConfirm} color="inherit" sx={{ borderRadius: 2 }}>
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
