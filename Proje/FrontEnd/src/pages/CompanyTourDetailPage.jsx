import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";

import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  Chip,
  Rating,
  Grid,
  Skeleton,
  Alert,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  InputAdornment,
  IconButton,
  Divider,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import GroupIcon from "@mui/icons-material/Group";
import PlaceIcon from "@mui/icons-material/Place";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import MiscellaneousServicesIcon from "@mui/icons-material/MiscellaneousServices";
import PersonIcon from "@mui/icons-material/Person";
import ImageNotSupportedIcon from "@mui/icons-material/ImageNotSupported";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";

import { useAuth } from "../hooks/useAuth";
import { companyTourApi, getImageUrl } from "../services/api";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=80";

function formatDate(dateStr) {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "—";
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  return `${day}/${month}/${d.getFullYear()}`;
}

function toInputDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "";
  return d.toISOString().split("T")[0];
}

function formatPrice(price) {
  if (price == null) return "—";
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    minimumFractionDigits: 0,
  }).format(price);
}

export default function CompanyTourDetailPage() {
  const { tourId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Edit modal
  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [editServices, setEditServices] = useState([]);
  const [editServiceInput, setEditServiceInput] = useState("");
  const [editDestinations, setEditDestinations] = useState([]);
  const [editDestinationInput, setEditDestinationInput] = useState("");
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState("");

  // Delete dialog
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Snackbar
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const fetchTour = useCallback(async () => {
    if (!user?.id || !tourId) return;
    try {
      setLoading(true);
      setError(null);
      const res = await companyTourApi.getTourDetail(user.id, tourId);
      setTour(res.data);
    } catch (err) {
      setError(err.message || "Tur detayı yüklenirken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  }, [user?.id, tourId]);

  useEffect(() => {
    fetchTour();
  }, [fetchTour]);

  // ── Edit Modal Handlers ──

  const openEditModal = () => {
    if (!tour) return;
    setEditForm({
      name: tour.name || "",
      description: tour.description || "",
      price: tour.price ?? "",
      startDate: toInputDate(tour.startDate),
      endDate: toInputDate(tour.endDate),
      totalCapacity: tour.totalCapacity ?? "",
      departureLocation: tour.departureLocation || "",
      arrivalLocation: tour.arrivalLocation || "",
    });
    setEditServices(tour.services ? [...tour.services] : []);
    setEditDestinations(tour.places ? [...tour.places] : []);
    setEditServiceInput("");
    setEditDestinationInput("");
    setEditError("");
    setEditOpen(true);
  };

  const updateEditField = (field, value) => {
    setEditForm((prev) => ({ ...prev, [field]: value }));
  };

  const addEditService = () => {
    const trimmed = editServiceInput.trim();
    if (!trimmed || editServices.includes(trimmed)) {
      setEditServiceInput("");
      return;
    }
    setEditServices((prev) => [...prev, trimmed]);
    setEditServiceInput("");
  };

  const removeEditService = (service) => {
    setEditServices((prev) => prev.filter((s) => s !== service));
  };

  const addEditDestination = () => {
    const trimmed = editDestinationInput.trim();
    if (!trimmed || editDestinations.includes(trimmed)) {
      setEditDestinationInput("");
      return;
    }
    setEditDestinations((prev) => [...prev, trimmed]);
    setEditDestinationInput("");
  };

  const removeEditDestination = (dest) => {
    setEditDestinations((prev) => prev.filter((d) => d !== dest));
  };

  const validateEdit = () => {
    if (!editForm.name.trim()) return "Tur adı zorunludur.";
    if (!editForm.description.trim()) return "Açıklama zorunludur.";
    if (!editForm.departureLocation.trim()) return "Kalkış yeri zorunludur.";
    if (!editForm.arrivalLocation.trim()) return "Varış yeri zorunludur.";
    const price = Number(editForm.price);
    if (!editForm.price || isNaN(price) || price < 0) return "Geçerli bir fiyat giriniz.";
    if (!editForm.startDate) return "Başlangıç tarihi zorunludur.";
    if (!editForm.endDate) return "Bitiş tarihi zorunludur.";
    if (new Date(editForm.endDate) <= new Date(editForm.startDate))
      return "Bitiş tarihi başlangıç tarihinden sonra olmalıdır.";
    const capacity = Number(editForm.totalCapacity);
    if (!editForm.totalCapacity || !Number.isInteger(capacity) || capacity < 1)
      return "Kapasite en az 1 olmalıdır.";
    return null;
  };

  const handleEditSubmit = async () => {
    setEditError("");
    const validationError = validateEdit();
    if (validationError) {
      setEditError(validationError);
      return;
    }

    setEditLoading(true);
    try {
      const body = {
        name: editForm.name.trim(),
        description: editForm.description.trim(),
        location: `${editForm.departureLocation.trim()} → ${editForm.arrivalLocation.trim()}`,
        price: Number(editForm.price),
        startDate: editForm.startDate,
        endDate: editForm.endDate,
        totalCapacity: Number(editForm.totalCapacity),
        departureLocation: editForm.departureLocation.trim(),
        arrivalLocation: editForm.arrivalLocation.trim(),
        places: editDestinations,
        services: editServices,
      };

      await companyTourApi.updateTour(user.id, tourId, body);
      setEditOpen(false);
      setSnackbar({ open: true, message: "Tur başarıyla güncellendi", severity: "success" });
      fetchTour();
    } catch (err) {
      setEditError(err.message || "Tur güncellenirken bir hata oluştu.");
    } finally {
      setEditLoading(false);
    }
  };

  // ── Delete Handlers ──

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await companyTourApi.deleteTour(user.id, tourId);
      setDeleteOpen(false);
      setSnackbar({ open: true, message: "Tur başarıyla silindi", severity: "success" });
      setTimeout(() => navigate("/company/tours"), 600);
    } catch (err) {
      setDeleteOpen(false);
      setSnackbar({ open: true, message: err.message || "Tur silinirken bir hata oluştu.", severity: "error" });
    } finally {
      setDeleteLoading(false);
    }
  };

  // ── Loading State ──

  if (loading) {
    return (
      <Box sx={{ bgcolor: "background.default", minHeight: "80vh", py: 6 }}>
        <Container maxWidth="lg">
          <Skeleton variant="rounded" height={320} sx={{ borderRadius: 4, mb: 3 }} />
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 8 }}>
              <Skeleton variant="rounded" height={200} sx={{ borderRadius: 3 }} />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Skeleton variant="rounded" height={200} sx={{ borderRadius: 3 }} />
            </Grid>
          </Grid>
        </Container>
      </Box>
    );
  }

  // ── Error State ──

  if (error) {
    return (
      <Box sx={{ bgcolor: "background.default", minHeight: "80vh", py: 6 }}>
        <Container maxWidth="md" sx={{ textAlign: "center" }}>
          <Alert
            severity="error"
            sx={{ maxWidth: 520, mx: "auto", mb: 3 }}
            action={
              <Button color="inherit" size="small" onClick={fetchTour}>
                Tekrar Dene
              </Button>
            }
          >
            {error}
          </Alert>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate("/company/tours")}
          >
            Turlarıma Dön
          </Button>
        </Container>
      </Box>
    );
  }

  if (!tour) return null;

  const imageUrl = tour.images?.length > 0 ? getImageUrl(tour.images[0]) : FALLBACK_IMAGE;
  const routeLabel =
    tour.departureLocation && tour.arrivalLocation
      ? `${tour.departureLocation} → ${tour.arrivalLocation}`
      : tour.location || "—";
  const remaining = tour.totalCapacity != null && tour.filledCapacity != null
    ? tour.totalCapacity - tour.filledCapacity
    : null;

  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "80vh", pb: 6 }}>
      {/* Hero Image */}
      <Box
        sx={{
          position: "relative",
          height: { xs: 240, md: 340 },
          overflow: "hidden",
        }}
      >
        <Box
          component="img"
          src={imageUrl}
          alt={tour.name}
          onError={(e) => { e.target.src = FALLBACK_IMAGE; }}
          sx={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%)",
          }}
        />
        <Container
          maxWidth="lg"
          sx={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            pb: 3,
            px: 3,
          }}
        >
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate("/company/tours")}
            sx={{ color: "#fff", mb: 1 }}
          >
            Turlarıma Dön
          </Button>
          <Typography variant="h3" fontWeight={800} color="#fff">
            {tour.name}
          </Typography>
          {tour.rating > 0 && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}>
              <Rating value={tour.rating} precision={0.1} size="small" readOnly sx={{ "& .MuiRating-iconFilled": { color: "#FFD700" } }} />
              <Typography color="#fff" variant="body2">
                {tour.rating.toFixed(1)} ({tour.reviewCount || 0} değerlendirme)
              </Typography>
            </Box>
          )}
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ mt: -4, position: "relative", zIndex: 1 }}>
        {/* Action Buttons */}
        <Box sx={{ display: "flex", gap: 1.5, mb: 3, justifyContent: "flex-end" }}>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<EditIcon />}
            onClick={openEditModal}
          >
            Düzenle
          </Button>
          <Button
            variant="outlined"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={() => setDeleteOpen(true)}
          >
            Sil
          </Button>
        </Box>

        <Grid container spacing={3}>
          {/* Left Column – Details */}
          <Grid size={{ xs: 12, md: 8 }}>
            {/* Key Info Bar */}
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 3,
                border: "1px solid",
                borderColor: "divider",
                mb: 3,
                display: "flex",
                flexWrap: "wrap",
                gap: 3,
              }}
            >
              <InfoItem
                icon={<ArrowRightAltIcon color="secondary" />}
                label="Güzergah"
                value={routeLabel}
              />
              <InfoItem
                icon={<CalendarMonthIcon color="secondary" />}
                label="Tarih"
                value={`${formatDate(tour.startDate)} – ${formatDate(tour.endDate)}`}
              />
              <InfoItem
                icon={<AttachMoneyIcon color="secondary" />}
                label="Fiyat"
                value={formatPrice(tour.price)}
              />
              <InfoItem
                icon={<GroupIcon color="secondary" />}
                label="Kapasite"
                value={`${tour.filledCapacity || 0} / ${tour.totalCapacity || "—"}`}
              />
              {remaining != null && (
                <InfoItem
                  icon={<GroupIcon sx={{ color: remaining > 0 ? "success.main" : "error.main" }} />}
                  label="Kalan Kontenjan"
                  value={remaining > 0 ? `${remaining} kişi` : "Dolu"}
                />
              )}
            </Paper>

            {/* Description */}
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 3,
                border: "1px solid",
                borderColor: "divider",
                mb: 3,
              }}
            >
              <Typography variant="h6" fontWeight={700} gutterBottom>
                Açıklama
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ whiteSpace: "pre-line" }}>
                {tour.description || "Açıklama eklenmemiş."}
              </Typography>
            </Paper>

            {/* Destinations & Services */}
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 3,
                border: "1px solid",
                borderColor: "divider",
                mb: 3,
              }}
            >
              {tour.places?.length > 0 && (
                <Box sx={{ mb: tour.services?.length > 0 ? 3 : 0 }}>
                  <Typography
                    variant="subtitle1"
                    fontWeight={700}
                    sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}
                  >
                    <PlaceIcon color="secondary" />
                    Gezilecek Yerler
                  </Typography>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                    {tour.places.map((place) => (
                      <Chip key={place} label={place} variant="outlined" color="secondary" />
                    ))}
                  </Box>
                </Box>
              )}

              {tour.services?.length > 0 && (
                <Box>
                  <Typography
                    variant="subtitle1"
                    fontWeight={700}
                    sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}
                  >
                    <MiscellaneousServicesIcon color="secondary" />
                    Dahil Hizmetler
                  </Typography>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                    {tour.services.map((service) => (
                      <Chip key={service} label={service} variant="outlined" color="primary" />
                    ))}
                  </Box>
                </Box>
              )}

              {(!tour.places || tour.places.length === 0) && (!tour.services || tour.services.length === 0) && (
                <Typography variant="body2" color="text.secondary">
                  Gezilecek yer veya hizmet bilgisi eklenmemiş.
                </Typography>
              )}
            </Paper>
          </Grid>

          {/* Right Column – Sidebar */}
          <Grid size={{ xs: 12, md: 4 }}>
            {/* Price Card */}
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 3,
                border: "1px solid",
                borderColor: "divider",
                mb: 3,
                position: { md: "sticky" },
                top: { md: 90 },
              }}
            >
              <Typography variant="h4" fontWeight={800} color="secondary.main" gutterBottom>
                {formatPrice(tour.price)}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                kişi başı
              </Typography>
              <Divider sx={{ my: 2 }} />

              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                <SidebarRow label="Güzergah" value={routeLabel} />
                <SidebarRow label="Başlangıç" value={formatDate(tour.startDate)} />
                <SidebarRow label="Bitiş" value={formatDate(tour.endDate)} />
                <SidebarRow label="Toplam Kapasite" value={tour.totalCapacity || "—"} />
                <SidebarRow label="Dolu" value={tour.filledCapacity || 0} />
                {remaining != null && (
                  <SidebarRow
                    label="Kalan"
                    value={remaining > 0 ? remaining : "Dolu"}
                    color={remaining > 0 ? "success.main" : "error.main"}
                  />
                )}
              </Box>

              {/* Guide Info */}
              {tour.guide && (
                <>
                  <Divider sx={{ my: 2 }} />
                  <Typography
                    variant="subtitle2"
                    fontWeight={700}
                    sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
                  >
                    <PersonIcon color="secondary" />
                    Atanan Rehber
                  </Typography>
                  <Typography variant="body2">
                    {tour.guide.firstName} {tour.guide.lastName}
                  </Typography>
                  {tour.guide.email && (
                    <Typography variant="caption" color="text.secondary">
                      {tour.guide.email}
                    </Typography>
                  )}
                </>
              )}

              <Divider sx={{ my: 2 }} />

              <Box sx={{ display: "flex", gap: 1 }}>
                <Button
                  fullWidth
                  variant="contained"
                  color="secondary"
                  startIcon={<EditIcon />}
                  onClick={openEditModal}
                >
                  Düzenle
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={() => setDeleteOpen(true)}
                >
                  Sil
                </Button>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* ── Edit Modal ── */}
      <Dialog
        open={editOpen}
        onClose={() => !editLoading && setEditOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Typography variant="h6" fontWeight={700}>
            Turu Düzenle
          </Typography>
          <IconButton onClick={() => !editLoading && setEditOpen(false)} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {editError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {editError}
            </Alert>
          )}

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5, pt: 1 }}>
            <TextField
              label="Tur Adı"
              required
              fullWidth
              value={editForm.name || ""}
              onChange={(e) => updateEditField("name", e.target.value)}
            />

            <TextField
              label="Açıklama"
              required
              fullWidth
              multiline
              minRows={3}
              value={editForm.description || ""}
              onChange={(e) => updateEditField("description", e.target.value)}
            />

            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Kalkış Yeri"
                  required
                  fullWidth
                  value={editForm.departureLocation || ""}
                  onChange={(e) => updateEditField("departureLocation", e.target.value)}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Varış Yeri"
                  required
                  fullWidth
                  value={editForm.arrivalLocation || ""}
                  onChange={(e) => updateEditField("arrivalLocation", e.target.value)}
                />
              </Grid>
            </Grid>

            {/* Destinations */}
            <Box>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                Gezilecek Yerler
              </Typography>
              <Box sx={{ display: "flex", gap: 1, mb: 1 }}>
                <TextField
                  size="small"
                  fullWidth
                  value={editDestinationInput}
                  onChange={(e) => setEditDestinationInput(e.target.value)}
                  placeholder="Örn: Göreme"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addEditDestination();
                    }
                  }}
                />
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={addEditDestination}
                  sx={{ minWidth: 44, px: 1 }}
                >
                  <AddIcon />
                </Button>
              </Box>
              {editDestinations.length > 0 && (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  {editDestinations.map((dest) => (
                    <Chip
                      key={dest}
                      label={dest}
                      color="secondary"
                      onDelete={() => removeEditDestination(dest)}
                    />
                  ))}
                </Box>
              )}
            </Box>

            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Fiyat"
                  required
                  fullWidth
                  type="number"
                  value={editForm.price ?? ""}
                  onChange={(e) => updateEditField("price", e.target.value)}
                  slotProps={{
                    input: {
                      startAdornment: <InputAdornment position="start">₺</InputAdornment>,
                    },
                    htmlInput: { min: 0, step: "0.01" },
                  }}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Kapasite"
                  required
                  fullWidth
                  type="number"
                  value={editForm.totalCapacity ?? ""}
                  onChange={(e) => updateEditField("totalCapacity", e.target.value)}
                  slotProps={{ htmlInput: { min: 1, step: 1 } }}
                />
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Başlangıç Tarihi"
                  required
                  fullWidth
                  type="date"
                  value={editForm.startDate || ""}
                  onChange={(e) => updateEditField("startDate", e.target.value)}
                  slotProps={{ inputLabel: { shrink: true } }}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Bitiş Tarihi"
                  required
                  fullWidth
                  type="date"
                  value={editForm.endDate || ""}
                  onChange={(e) => updateEditField("endDate", e.target.value)}
                  slotProps={{ inputLabel: { shrink: true } }}
                />
              </Grid>
            </Grid>

            {/* Services */}
            <Box>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                Dahil Hizmetler
              </Typography>
              <Box sx={{ display: "flex", gap: 1, mb: 1 }}>
                <TextField
                  size="small"
                  fullWidth
                  value={editServiceInput}
                  onChange={(e) => setEditServiceInput(e.target.value)}
                  placeholder="Örn: Kahvaltı"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addEditService();
                    }
                  }}
                />
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={addEditService}
                  sx={{ minWidth: 44, px: 1 }}
                >
                  <AddIcon />
                </Button>
              </Box>
              {editServices.length > 0 && (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  {editServices.map((service) => (
                    <Chip
                      key={service}
                      label={service}
                      color="secondary"
                      onDelete={() => removeEditService(service)}
                    />
                  ))}
                </Box>
              )}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={() => setEditOpen(false)} disabled={editLoading}>
            İptal
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleEditSubmit}
            disabled={editLoading}
            startIcon={editLoading ? null : <EditIcon />}
          >
            {editLoading ? "Güncelleniyor…" : "Güncelle"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── Delete Confirmation Dialog ── */}
      <Dialog
        open={deleteOpen}
        onClose={() => !deleteLoading && setDeleteOpen(false)}
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle fontWeight={700}>Turu Sil</DialogTitle>
        <DialogContent>
          <Typography>
            <strong>{tour.name}</strong> turunu silmek istediğinize emin misiniz? Bu işlem geri alınamaz.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={() => setDeleteOpen(false)} disabled={deleteLoading}>
            İptal
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleDelete}
            disabled={deleteLoading}
            startIcon={deleteLoading ? null : <DeleteIcon />}
          >
            {deleteLoading ? "Siliniyor…" : "Evet, Sil"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── Snackbar ── */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

/* ── Helper Components ── */

function InfoItem({ icon, label, value }) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, minWidth: 160 }}>
      {icon}
      <Box>
        <Typography variant="caption" color="text.secondary">
          {label}
        </Typography>
        <Typography variant="body2" fontWeight={600}>
          {value}
        </Typography>
      </Box>
    </Box>
  );
}

function SidebarRow({ label, value, color }) {
  return (
    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body2" fontWeight={600} color={color || "text.primary"}>
        {value}
      </Typography>
    </Box>
  );
}
