import { useState, useEffect, useCallback, useRef } from "react";
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
  IconButton,
  Tooltip,
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
import RateReviewIcon from "@mui/icons-material/RateReview";
import GroupsIcon from "@mui/icons-material/Groups";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import LinkIcon from "@mui/icons-material/Link";
import Snackbar from "@mui/material/Snackbar";
import CircularProgress from "@mui/material/CircularProgress";

import { useAuth } from "../hooks/useAuth";
import { companyApi, companyTourApi } from "../services/api";

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

  // Stats
  const [stats, setStats] = useState({ totalTours: 0, avgRating: 0, totalReviews: 0, totalGuides: 0 });

  // Image upload refs
  const fileInputRef = useRef(null);
  const bannerInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [uploadingBanner, setUploadingBanner] = useState(false);

  const getImageSrc = (url) => {
    if (!url) return undefined;
    if (url.startsWith("http") || url.startsWith("data:")) return url;
    const base = (import.meta.env.VITE_API_URL || "").replace(/\/api\/?$/, "");
    return `${base}${url}`;
  };

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

  const fetchStats = useCallback(async () => {
    if (!user?.id) return;
    try {
      const [toursRes, guidesRes] = await Promise.all([
        companyTourApi.listTours(user.id),
        companyTourApi.listGuides(user.id),
      ]);
      const tours = toursRes.data ?? [];
      const guides = guidesRes.data ?? [];
      const rated = tours.filter((t) => t.rating > 0);
      setStats({
        totalTours: tours.length,
        avgRating: rated.length ? rated.reduce((s, t) => s + t.rating, 0) / rated.length : 0,
        totalReviews: tours.reduce((s, t) => s + (t.reviewCount ?? 0), 0),
        totalGuides: guides.length,
      });
    } catch {
      /* stats are non-critical */
    }
  }, [user?.id]);

  useEffect(() => {
    fetchProfile();
    fetchStats();
  }, [fetchProfile, fetchStats]);

  const handleEdit = () => {
    setEditing(true);
    setSaveError(null);
    setFormData({
      name: company.name || "",
      phone: company.phone || "",
      address: company.address || "",
      description: company.description || "",
      instagram: company.instagram || "",
      linkedin: company.linkedin || "",
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

  // Profile image upload
  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploading(true);
      const res = await companyApi.uploadProfileImage(user.id, file);
      setCompany((prev) => ({
        ...prev,
        profileImageUrl: res.data?.profileImageUrl || res.profileImageUrl,
      }));
      setSnackbar({ open: true, message: "Profil resmi güncellendi" });
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.message || "Resim yüklenirken hata oluştu",
      });
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // Banner image upload
  const handleBannerUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploadingBanner(true);
      const res = await companyApi.uploadBannerImage(user.id, file);
      setCompany((prev) => ({
        ...prev,
        bannerImageUrl: res.data?.bannerImageUrl || res.bannerImageUrl,
      }));
      setSnackbar({ open: true, message: "Kapak fotoğrafı güncellendi" });
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.message || "Kapak fotoğrafı yüklenirken hata oluştu",
      });
    } finally {
      setUploadingBanner(false);
      if (bannerInputRef.current) bannerInputRef.current.value = "";
    }
  };

  // Loading state
  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 6 }}>
        <Paper sx={{ borderRadius: 4, overflow: "hidden" }}>
          <Skeleton variant="rectangular" height={200} />
          <Box sx={{ p: 4, display: "flex", gap: 3, alignItems: "center" }}>
            <Skeleton variant="circular" width={96} height={96} />
            <Box sx={{ flex: 1 }}>
              <Skeleton variant="text" width="60%" height={40} />
              <Skeleton variant="text" width="40%" />
            </Box>
          </Box>
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} variant="text" sx={{ mx: 4, mb: 1 }} />
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

  const bannerSrc = getImageSrc(company.bannerImageUrl);

  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "80vh", py: 6 }}>
      <Container maxWidth="md">
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
          {/* ── Banner / Cover Photo ── */}
          <Box
            sx={{
              height: { xs: 160, md: 220 },
              background: bannerSrc
                ? `url(${bannerSrc}) center/cover no-repeat`
                : "linear-gradient(135deg, #2D3436 0%, #636e72 40%, #D35400 100%)",
              position: "relative",
            }}
          >
            <Tooltip title="Kapak fotoğrafı yükle" arrow>
              <IconButton
                onClick={() => bannerInputRef.current?.click()}
                disabled={uploadingBanner}
                sx={{
                  position: "absolute",
                  bottom: 12,
                  right: 12,
                  bgcolor: "rgba(0,0,0,0.5)",
                  color: "#fff",
                  backdropFilter: "blur(4px)",
                  "&:hover": { bgcolor: "rgba(0,0,0,0.7)" },
                }}
              >
                {uploadingBanner ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  <AddPhotoAlternateIcon />
                )}
              </IconButton>
            </Tooltip>
            <input
              ref={bannerInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              hidden
              onChange={handleBannerUpload}
            />
          </Box>

          {/* ── Avatar + Name ── */}
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
              {/* Avatar with camera button */}
              <Box sx={{ position: "relative", display: "inline-flex" }}>
                <Avatar
                  src={getImageSrc(company.profileImageUrl)}
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
                  {company.name?.charAt(0)?.toUpperCase()}
                </Avatar>
                <IconButton
                  size="small"
                  disabled={uploading}
                  onClick={() => fileInputRef.current?.click()}
                  sx={{
                    position: "absolute",
                    bottom: 2,
                    right: 2,
                    bgcolor: "secondary.main",
                    color: "#fff",
                    width: 32,
                    height: 32,
                    border: "2px solid",
                    borderColor: "background.paper",
                    "&:hover": { bgcolor: "secondary.dark" },
                  }}
                >
                  {uploading ? (
                    <CircularProgress size={16} color="inherit" />
                  ) : (
                    <CameraAltIcon sx={{ fontSize: 16 }} />
                  )}
                </IconButton>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  hidden
                  onChange={handleImageUpload}
                />
              </Box>

              {/* Name + chips */}
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
                    flexWrap: "wrap",
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

        {/* ════════════ INFO CARDS ════════════ */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {/* ── Description ── */}
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
                {company.description ||
                  "Henüz bir açıklama eklenmedi. Düzenle butonuna tıklayarak firmanızı tanıtabilirsiniz."}
              </Typography>
            )}
          </Paper>

          {/* ── Contact Info + Social Media ── */}
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

            {/* Social Media */}
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
              {editing ? (
                <>
                  <TextField
                    value={formData.instagram || ""}
                    onChange={handleFormChange("instagram")}
                    size="small"
                    fullWidth
                    label="Instagram"
                    placeholder="https://instagram.com/firmaadi"
                  />
                  <TextField
                    value={formData.linkedin || ""}
                    onChange={handleFormChange("linkedin")}
                    size="small"
                    fullWidth
                    label="LinkedIn"
                    placeholder="https://linkedin.com/company/firmaadi"
                  />
                </>
              ) : (
                <>
                  <SocialRow
                    iconSrc="https://cdn-icons-png.flaticon.com/24/2111/2111463.png"
                    label="Instagram"
                    value={company.instagram}
                  />
                  <SocialRow
                    iconSrc="https://cdn-icons-png.flaticon.com/24/3536/3536505.png"
                    label="LinkedIn"
                    value={company.linkedin}
                  />
                </>
              )}
            </Box>
          </Paper>

          {/* ── Statistics ── */}
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
                icon={
                  <MapIcon sx={{ fontSize: 32, color: "secondary.main" }} />
                }
                value={stats.totalTours}
                label="Toplam Tur"
              />
              <StatCard
                icon={
                  <StarIcon sx={{ fontSize: 32, color: "secondary.main" }} />
                }
                value={stats.avgRating > 0 ? stats.avgRating.toFixed(1) : "0.0"}
                label="Ortalama Puan"
              />
              <StatCard
                icon={
                  <RateReviewIcon
                    sx={{ fontSize: 32, color: "secondary.main" }}
                  />
                }
                value={stats.totalReviews}
                label="Toplam Değerlendirme"
              />
              <StatCard
                icon={
                  <GroupsIcon
                    sx={{ fontSize: 32, color: "secondary.main" }}
                  />
                }
                value={stats.totalGuides}
                label="Kayıtlı Rehber"
              />
            </Box>
          </Paper>

          {/* ── Danger Zone ── */}
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

function SocialRow({ iconSrc, label, value }) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
      <Box
        component="img"
        src={iconSrc}
        alt={label}
        sx={{ width: 22, height: 22, opacity: 0.7 }}
      />
      <Box>
        <Typography variant="caption" color="text.secondary">
          {label}
        </Typography>
        {value ? (
          <Typography
            variant="body2"
            component="a"
            href={value.startsWith("http") ? value : `https://${value}`}
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
            Belirtilmedi
          </Typography>
        )}
      </Box>
    </Box>
  );
}
