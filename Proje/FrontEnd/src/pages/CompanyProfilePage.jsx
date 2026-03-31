import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

// MUI Components
import {
  Container,
  Paper,
  Typography,
  Box,
  Avatar,
  Divider,
  Chip,
  Rating,
  Skeleton,
  Alert,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
} from "@mui/material";
import DirectionsBusIcon from "@mui/icons-material/DirectionsBus";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import StarIcon from "@mui/icons-material/Star";
import MapIcon from "@mui/icons-material/Map";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import BusinessIcon from "@mui/icons-material/Business";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import Snackbar from "@mui/material/Snackbar";
import CircularProgress from "@mui/material/CircularProgress";

import { useAuth } from "../hooks/useAuth";
import { companyApi } from "../services/api";

export default function CompanyProfilePage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Edit mode state
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "" });

  // Delete dialog state
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  const fetchProfile = useCallback(async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      setError(null);
      const res = await companyApi.getProfile(user.id);
      setCompany(res.data);
    } catch (err) {
      setError(err.message || "Profil bilgileri yüklenirken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleEdit = () => {
    setEditing(true);
    setSaveError(null);
    setFormData({
      name: company.name || "",
      phone: company.phone || "",
      address: company.address || "",
      description: company.description || "",
    });
  };

  const handleCancelEdit = () => {
    setEditing(false);
    setFormData({});
    setSaveError(null);
  };

  const handleFormChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      setSaveError(null);
      const res = await companyApi.updateProfile(user.id, formData);
      setCompany(res.data);
      setEditing(false);
      setSnackbar({ open: true, message: "Profil başarıyla güncellendi" });
    } catch (err) {
      setSaveError(err.message || "Profil güncellenirken bir hata oluştu.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== company?.name) return;
    try {
      setDeleting(true);
      setDeleteError(null);
      await companyApi.deleteAccount(user.id);
      logout();
      navigate("/", { replace: true });
    } catch (err) {
      setDeleteError(
        err.message ||
          "Hesap silinirken bir hata oluştu. Lütfen tekrar deneyin.",
      );
    } finally {
      setDeleting(false);
    }
  };

  // Guard: only company users
  if (!user || user.role !== "company") {
    return (
      <Container maxWidth="md" sx={{ py: 10, textAlign: "center" }}>
        <Alert severity="warning" sx={{ maxWidth: 480, mx: "auto" }}>
          Bu sayfaya yalnızca tur firması hesapları erişebilir.
        </Alert>
      </Container>
    );
  }

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 6 }}>
        <Paper sx={{ p: 4, borderRadius: 4 }}>
          <Box sx={{ display: "flex", gap: 3, alignItems: "center", mb: 4 }}>
            <Skeleton variant="circular" width={80} height={80} />
            <Box sx={{ flex: 1 }}>
              <Skeleton variant="text" width="60%" height={40} />
              <Skeleton variant="text" width="40%" />
            </Box>
          </Box>
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} variant="text" sx={{ mb: 1 }} />
          ))}
        </Paper>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 10, textAlign: "center" }}>
        <Alert
          severity="error"
          sx={{ maxWidth: 520, mx: "auto", mb: 3 }}
          action={
            <Button color="inherit" size="small" onClick={fetchProfile}>
              Tekrar Dene
            </Button>
          }
        >
          {error}
        </Alert>
      </Container>
    );
  }

  if (!company) return null;

  const memberSince = new Date(company.createdAt).toLocaleDateString("tr-TR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "80vh", py: 6 }}>
      <Container maxWidth="md">
        {/* Profile Header Card */}
        <Paper
          elevation={0}
          sx={{
            borderRadius: 4,
            overflow: "hidden",
            border: "1px solid",
            borderColor: "divider",
            mb: 3,
          }}
        >
          {/* Gradient Banner */}
          <Box
            sx={{
              height: 140,
              background:
                "linear-gradient(135deg, #2D3436 0%, #636e72 60%, #D35400 100%)",
              position: "relative",
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
                mt: -4,
              }}
            >
              <Avatar
                sx={{
                  width: 96,
                  height: 96,
                  bgcolor: "secondary.main",
                  fontSize: 36,
                  fontWeight: 800,
                  border: "4px solid",
                  borderColor: "background.paper",
                  boxShadow: "0 4px 14px rgba(0,0,0,0.15)",
                }}
              >
                {company.name?.charAt(0)?.toUpperCase()}
              </Avatar>

              <Box
                sx={{
                  flex: 1,
                  textAlign: { xs: "center", sm: "left" },
                  mb: { xs: 0, sm: 1 },
                }}
              >
                {editing ? (
                  <TextField
                    value={formData.name}
                    onChange={handleFormChange("name")}
                    variant="outlined"
                    size="small"
                    fullWidth
                    label="Firma Adı"
                    sx={{ maxWidth: 360 }}
                  />
                ) : (
                  <Typography variant="h4" fontWeight={800}>
                    {company.name}
                  </Typography>
                )}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    justifyContent: { xs: "center", sm: "flex-start" },
                    mt: 0.5,
                  }}
                >
                  <Chip
                    icon={<BusinessIcon sx={{ fontSize: 16 }} />}
                    label="Tur Firması"
                    size="small"
                    color="secondary"
                    variant="outlined"
                  />
                  {company.rating > 0 && (
                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                    >
                      <Rating
                        value={company.rating}
                        precision={0.1}
                        size="small"
                        readOnly
                      />
                      <Typography variant="body2" color="text.secondary">
                        {company.rating.toFixed(1)}
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Box>

              {/* Edit / Save / Cancel buttons */}
              <Box sx={{ display: "flex", gap: 1, mt: { xs: 1, sm: 0 } }}>
                {editing ? (
                  <>
                    <Button
                      variant="contained"
                      color="secondary"
                      startIcon={
                        saving ? (
                          <CircularProgress size={18} color="inherit" />
                        ) : (
                          <SaveIcon />
                        )
                      }
                      onClick={handleSaveProfile}
                      disabled={saving}
                    >
                      {saving ? "Kaydediliyor…" : "Kaydet"}
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<CloseIcon />}
                      onClick={handleCancelEdit}
                      disabled={saving}
                    >
                      İptal
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="outlined"
                    color="secondary"
                    startIcon={<EditIcon />}
                    onClick={handleEdit}
                  >
                    Düzenle
                  </Button>
                )}
              </Box>
            </Box>
          </Box>
        </Paper>

        {/* Save error alert */}
        {saveError && (
          <Alert
            severity="error"
            sx={{ mb: 3 }}
            onClose={() => setSaveError(null)}
          >
            {saveError}
          </Alert>
        )}

        {/* Info Cards */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {/* Description */}
          {(company.description || editing) && (
            <Paper
              elevation={0}
              sx={{
                p: { xs: 3, md: 4 },
                borderRadius: 4,
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <Typography
                variant="h6"
                fontWeight={700}
                gutterBottom
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
              >
                <DirectionsBusIcon color="secondary" />
                Hakkımızda
              </Typography>
              {editing ? (
                <TextField
                  value={formData.description}
                  onChange={handleFormChange("description")}
                  multiline
                  minRows={3}
                  fullWidth
                  label="Açıklama"
                />
              ) : (
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ lineHeight: 1.8 }}
                >
                  {company.description}
                </Typography>
              )}
            </Paper>
          )}

          {/* Contact & Stats */}
          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, md: 4 },
              borderRadius: 4,
              border: "1px solid",
              borderColor: "divider",
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
                value={company.email}
              />
              {editing ? (
                <Box
                  sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}
                >
                  <PhoneIcon color="action" sx={{ mt: 1 }} />
                  <TextField
                    value={formData.phone}
                    onChange={handleFormChange("phone")}
                    size="small"
                    fullWidth
                    label="Telefon"
                  />
                </Box>
              ) : (
                <InfoRow
                  icon={<PhoneIcon color="action" />}
                  label="Telefon"
                  value={company.phone}
                />
              )}
              {editing ? (
                <Box
                  sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}
                >
                  <LocationOnIcon color="action" sx={{ mt: 1 }} />
                  <TextField
                    value={formData.address}
                    onChange={handleFormChange("address")}
                    size="small"
                    fullWidth
                    label="Adres"
                  />
                </Box>
              ) : (
                <InfoRow
                  icon={<LocationOnIcon color="action" />}
                  label="Adres"
                  value={company.address}
                />
              )}
              <InfoRow
                icon={<CalendarMonthIcon color="action" />}
                label="Üyelik Tarihi"
                value={memberSince}
              />
            </Box>
          </Paper>

          {/* Statistics */}
          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, md: 4 },
              borderRadius: 4,
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <Typography variant="h6" fontWeight={700} gutterBottom>
              İstatistikler
            </Typography>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr 1fr" },
                gap: 3,
                mt: 2,
              }}
            >
              <StatCard
                icon={
                  <MapIcon sx={{ fontSize: 32, color: "secondary.main" }} />
                }
                value={company.tourCount ?? 0}
                label="Toplam Tur"
              />
              <StatCard
                icon={
                  <StarIcon sx={{ fontSize: 32, color: "secondary.main" }} />
                }
                value={company.rating ? company.rating.toFixed(1) : "—"}
                label="Ortalama Puan"
              />
              <StatCard
                icon={
                  <BusinessIcon
                    sx={{ fontSize: 32, color: "secondary.main" }}
                  />
                }
                value={company.reviews?.length ?? "—"}
                label="Değerlendirme"
              />
            </Box>
          </Paper>

          {/* Danger Zone */}
          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, md: 4 },
              borderRadius: 4,
              border: "1px solid",
              borderColor: "error.light",
              bgcolor: "error.50",
            }}
          >
            <Typography
              variant="h6"
              fontWeight={700}
              color="error.main"
              gutterBottom
            >
              Tehlikeli Bölge
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Hesabınızı silerseniz tüm verileriniz kalıcı olarak kaldırılır. Bu
              işlem geri alınamaz.
            </Typography>
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteForeverIcon />}
              onClick={() => setDeleteOpen(true)}
            >
              Hesabı Sil
            </Button>
          </Paper>
        </Box>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteOpen}
          onClose={() => {
            if (!deleting) {
              setDeleteOpen(false);
              setDeleteConfirmText("");
              setDeleteError(null);
            }
          }}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle sx={{ fontWeight: 700, color: "error.main" }}>
            Hesabı Kalıcı Olarak Sil
          </DialogTitle>
          <DialogContent>
            <DialogContentText sx={{ mb: 2 }}>
              Bu işlem geri alınamaz. Firmanıza ait tüm turlar, yorumlar ve
              veriler kalıcı olarak silinecektir.
            </DialogContentText>
            <DialogContentText sx={{ mb: 2 }}>
              Onaylamak için firma adınızı yazın:{" "}
              <Typography
                component="span"
                fontWeight={700}
                color="text.primary"
              >
                {company.name}
              </Typography>
            </DialogContentText>

            {deleteError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {deleteError}
              </Alert>
            )}

            <TextField
              fullWidth
              size="small"
              placeholder={company.name}
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
              autoComplete="off"
            />
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button
              onClick={() => {
                setDeleteOpen(false);
                setDeleteConfirmText("");
                setDeleteError(null);
              }}
              disabled={deleting}
            >
              İptal
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={handleDeleteAccount}
              disabled={deleteConfirmText !== company.name || deleting}
              startIcon={<DeleteForeverIcon />}
            >
              {deleting ? "Siliniyor…" : "Hesabı Sil"}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Success Snackbar */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={() => setSnackbar({ open: false, message: "" })}
          message={snackbar.message}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        />
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

function StatCard({ icon, value, label }) {
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
      <Typography variant="h4" fontWeight={800} sx={{ mt: 1 }}>
        {value}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
    </Box>
  );
}
