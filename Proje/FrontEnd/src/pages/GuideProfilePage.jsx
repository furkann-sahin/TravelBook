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
} from "@mui/material";
import CardTravelIcon from "@mui/icons-material/CardTravel";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import StarIcon from "@mui/icons-material/Star";
import MapIcon from "@mui/icons-material/Map";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import LanguageIcon from "@mui/icons-material/Language";
import ExploreIcon from "@mui/icons-material/Explore";
import WorkHistoryIcon from "@mui/icons-material/WorkHistory";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import Snackbar from "@mui/material/Snackbar";
import CircularProgress from "@mui/material/CircularProgress";

import { useAuth } from "../hooks/useAuth";
import { guideApi } from "../services/api";

export default function GuideProfilePage() {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const [guide, setGuide] = useState(null);
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

    // Image upload
    const fileInputRef = useRef(null);
    const [uploading, setUploading] = useState(false);

    const fetchProfile = useCallback(async () => {
        if (!user?.id) return;
        try {
            setLoading(true);
            setError(null);
            const res = await guideApi.getDetail(user.id);
            setGuide(res.data);
        } catch (err) {
            setError(err.message || "Profil bilgileri yüklenirken bir hata oluştu.");
        } finally {
            setLoading(false);
        }
    }, [user?.id]);

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    const fullName = guide
        ? `${guide.firstName || ""} ${guide.lastName || ""}`.trim()
        : "";

    const handleEdit = () => {
        setEditing(true);
        setSaveError(null);
        setFormData({
            firstName: guide.firstName || "",
            lastName: guide.lastName || "",
            phone: guide.phone || "",
            biography: guide.biography || "",
            languages: Array.isArray(guide.languages)
                ? guide.languages.join(", ")
                : guide.languages || "",
            expertRoutes: Array.isArray(guide.expertRoutes)
                ? guide.expertRoutes.join(", ")
                : guide.expertRoutes || "",
            experienceYears: guide.experienceYears ?? "",
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
            const payload = {
                ...formData,
                languages: formData.languages
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean),
                expertRoutes: formData.expertRoutes
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean),
                experienceYears: formData.experienceYears
                    ? Number(formData.experienceYears)
                    : undefined,
            };
            const res = await guideApi.updateProfile(user.id, payload);
            setGuide(res.data);
            setEditing(false);
            setSnackbar({ open: true, message: "Profil başarıyla güncellendi" });
        } catch (err) {
            setSaveError(err.message || "Profil güncellenirken bir hata oluştu.");
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteAccount = async () => {
        if (deleteConfirmText !== fullName) return;
        try {
            setDeleting(true);
            setDeleteError(null);
            await guideApi.deleteAccount(user.id);
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

    const handleImageUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        try {
            setUploading(true);
            const res = await guideApi.uploadProfileImage(user.id, file);
            setGuide((prev) => ({ ...prev, profileImageUrl: res.data?.profileImageUrl || res.profileImageUrl }));
            setSnackbar({ open: true, message: "Profil resmi güncellendi" });
        } catch (err) {
            setSnackbar({ open: true, message: err.message || "Resim yüklenirken hata oluştu" });
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    // Loading state
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

    if (!guide) return null;

    const memberSince = new Date(guide.createdAt).toLocaleDateString("tr-TR", {
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
                            <Box sx={{ position: "relative", display: "inline-flex" }}>
                                <Avatar
                                    src={
                                        guide.profileImageUrl
                                            ? guide.profileImageUrl.startsWith("http")
                                                ? guide.profileImageUrl
                                                : `${import.meta.env.VITE_API_URL?.replace("/api", "") || "http://localhost:3000"}${guide.profileImageUrl}`
                                            : undefined
                                    }
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
                                    {guide.firstName?.charAt(0)?.toUpperCase()}
                                </Avatar>
                                <IconButton
                                    size="small"
                                    disabled={uploading}
                                    onClick={() => fileInputRef.current?.click()}
                                    sx={{
                                        position: "absolute",
                                        bottom: 0,
                                        right: 0,
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

                            <Box
                                sx={{
                                    flex: 1,
                                    textAlign: { xs: "center", sm: "left" },
                                    mb: { xs: 0, sm: 1 },
                                }}
                            >
                                {editing ? (
                                    <Box sx={{ display: "flex", gap: 1, maxWidth: 400 }}>
                                        <TextField
                                            value={formData.firstName}
                                            onChange={handleFormChange("firstName")}
                                            variant="outlined"
                                            size="small"
                                            label="Ad"
                                        />
                                        <TextField
                                            value={formData.lastName}
                                            onChange={handleFormChange("lastName")}
                                            variant="outlined"
                                            size="small"
                                            label="Soyad"
                                        />
                                    </Box>
                                ) : (
                                    <Typography variant="h4" fontWeight={800}>
                                        {fullName}
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
                                        icon={<CardTravelIcon sx={{ fontSize: 16 }} />}
                                        label="Rehber"
                                        size="small"
                                        color="secondary"
                                        variant="outlined"
                                    />
                                    {guide.rating > 0 && (
                                        <Box
                                            sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                                        >
                                            <Rating
                                                value={guide.rating}
                                                precision={0.1}
                                                size="small"
                                                readOnly
                                            />
                                            <Typography variant="body2" color="text.secondary">
                                                {guide.rating.toFixed(1)}
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
                    {/* Biography */}
                    {(guide.biography || editing) && (
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
                                <CardTravelIcon color="secondary" />
                                Hakkımda
                            </Typography>
                            {editing ? (
                                <TextField
                                    value={formData.biography}
                                    onChange={handleFormChange("biography")}
                                    multiline
                                    minRows={3}
                                    fullWidth
                                    label="Biyografi"
                                />
                            ) : (
                                <Typography
                                    variant="body1"
                                    color="text.secondary"
                                    sx={{ lineHeight: 1.8 }}
                                >
                                    {guide.biography}
                                </Typography>
                            )}
                        </Paper>
                    )}

                    {/* Languages & Expertise */}
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
                            Uzmanlık Bilgileri
                        </Typography>

                        <Box
                            sx={{
                                display: "grid",
                                gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                                gap: 3,
                                mt: 2,
                            }}
                        >
                            {editing ? (
                                <Box
                                    sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}
                                >
                                    <LanguageIcon color="action" sx={{ mt: 1 }} />
                                    <TextField
                                        value={formData.languages}
                                        onChange={handleFormChange("languages")}
                                        size="small"
                                        fullWidth
                                        label="Diller (virgülle ayırın)"
                                    />
                                </Box>
                            ) : (
                                <InfoRow
                                    icon={<LanguageIcon color="action" />}
                                    label="Diller"
                                    value={
                                        Array.isArray(guide.languages) && guide.languages.length > 0
                                            ? guide.languages.join(", ")
                                            : "—"
                                    }
                                />
                            )}
                            {editing ? (
                                <Box
                                    sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}
                                >
                                    <ExploreIcon color="action" sx={{ mt: 1 }} />
                                    <TextField
                                        value={formData.expertRoutes}
                                        onChange={handleFormChange("expertRoutes")}
                                        size="small"
                                        fullWidth
                                        label="Uzman Rotalar (virgülle ayırın)"
                                    />
                                </Box>
                            ) : (
                                <InfoRow
                                    icon={<ExploreIcon color="action" />}
                                    label="Uzman Rotalar"
                                    value={
                                        Array.isArray(guide.expertRoutes) &&
                                            guide.expertRoutes.length > 0
                                            ? guide.expertRoutes.join(", ")
                                            : "—"
                                    }
                                />
                            )}
                            {editing ? (
                                <Box
                                    sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}
                                >
                                    <WorkHistoryIcon color="action" sx={{ mt: 1 }} />
                                    <TextField
                                        value={formData.experienceYears}
                                        onChange={handleFormChange("experienceYears")}
                                        size="small"
                                        fullWidth
                                        label="Deneyim (yıl)"
                                        type="number"
                                    />
                                </Box>
                            ) : (
                                <InfoRow
                                    icon={<WorkHistoryIcon color="action" />}
                                    label="Deneyim"
                                    value={
                                        guide.experienceYears != null
                                            ? `${guide.experienceYears} yıl`
                                            : "—"
                                    }
                                />
                            )}
                        </Box>
                    </Paper>

                    {/* Contact Info */}
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
                                value={guide.email}
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
                                    value={guide.phone}
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
                                value={guide.registeredTours?.length ?? 0}
                                label="Kayıtlı Tur"
                            />
                            <StatCard
                                icon={
                                    <StarIcon sx={{ fontSize: 32, color: "secondary.main" }} />
                                }
                                value={guide.rating ? guide.rating.toFixed(1) : "—"}
                                label="Ortalama Puan"
                            />
                            <StatCard
                                icon={
                                    <WorkHistoryIcon
                                        sx={{ fontSize: 32, color: "secondary.main" }}
                                    />
                                }
                                value={guide.experienceYears ?? "—"}
                                label="Deneyim (Yıl)"
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
                            Bu işlem geri alınamaz. Rehber hesabınıza ait tüm veriler kalıcı
                            olarak silinecektir.
                        </DialogContentText>
                        <DialogContentText sx={{ mb: 2 }}>
                            Onaylamak için adınızı ve soyadınızı yazın:{" "}
                            <Typography
                                component="span"
                                fontWeight={700}
                                color="text.primary"
                            >
                                {fullName}
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
                            placeholder={fullName}
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
                            disabled={deleteConfirmText !== fullName || deleting}
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
