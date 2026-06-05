import { useState, useEffect, useCallback, useRef, useMemo } from "react";
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
    Switch,
    LinearProgress,
    Tooltip,
    Menu,
    MenuItem,
    ListItemIcon,
    ListItemText,
} from "@mui/material";
import CardTravelIcon from "@mui/icons-material/CardTravel";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import StarIcon from "@mui/icons-material/Star";
import BusinessIcon from "@mui/icons-material/Business";
import MapIcon from "@mui/icons-material/Map";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import LanguageIcon from "@mui/icons-material/Language";
import ExploreIcon from "@mui/icons-material/Explore";
import WorkHistoryIcon from "@mui/icons-material/WorkHistory";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import CollectionsIcon from "@mui/icons-material/Collections";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import LinkIcon from "@mui/icons-material/Link";
import Snackbar from "@mui/material/Snackbar";
import CircularProgress from "@mui/material/CircularProgress";

import { useAuth } from "../hooks/useAuth";
import { guideApi } from "../services/api";

export default function GuideProfilePage() {
    const navigate = useNavigate();
    const { user, logout, updateUser } = useAuth();

    const [guide, setGuide] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [stats, setStats] = useState({
        totalTours: 0,
        totalCompanies: 0,
        experienceYears: 0,
        rating: 0,
    });

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

    // NEW — Banner (cover) image
    const bannerInputRef = useRef(null);
    const [uploadingBanner, setUploadingBanner] = useState(false);
    const [uploadingGallery, setUploadingGallery] = useState(false);

    // NEW — Availability status
    const [available, setAvailable] = useState(true);

    // NEW — Gallery
    const galleryInputRef = useRef(null);
    const galleryImages = guide?.galleryImageUrls ?? [];

    const fetchProfile = useCallback(async () => {
        if (!user?.id) return;
        try {
            setLoading(true);
            setError(null);
            const [profileResult, companiesResult, toursResult] = await Promise.allSettled([
                guideApi.getDetail(user.id),
                guideApi.listMyCompanies(user.id),
                guideApi.listTours(user.id),
            ]);

            if (profileResult.status === "rejected") {
                throw profileResult.reason;
            }

            const profile = profileResult.value?.data ?? profileResult.value ?? {};
            const companies =
                companiesResult.status === "fulfilled"
                    ? companiesResult.value?.data ?? companiesResult.value ?? []
                    : [];
            const tours =
                toursResult.status === "fulfilled"
                    ? toursResult.value?.data ?? toursResult.value ?? []
                    : [];

            setGuide(profile);
            updateUser({
                name: `${profile.firstName || ""} ${profile.lastName || ""}`.trim() || user?.name,
                profileImageUrl: profile.profileImageUrl || null,
            });
            setStats({
                totalTours: Array.isArray(tours) ? tours.length : 0,
                totalCompanies: Array.isArray(companies) ? companies.length : 0,
                experienceYears: profile?.experienceYears ?? 0,
                rating: profile?.rating ?? 0,
            });
        } catch (err) {
            setError(err.message || "Profil bilgileri yüklenirken bir hata oluştu.");
        } finally {
            setLoading(false);
        }
    }, [updateUser, user?.id, user?.name]);

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    const fullName = guide
        ? `${guide.firstName || ""} ${guide.lastName || ""}`.trim()
        : "";

    // Profile completion percentage
    const profileCompletion = useMemo(() => {
        if (!guide) return 0;
        const fields = [
            guide.firstName,
            guide.lastName,
            guide.email,
            guide.phone,
            guide.biography,
            guide.profileImageUrl,
            Array.isArray(guide.languages) && guide.languages.length > 0,
            Array.isArray(guide.expertRoutes) && guide.expertRoutes.length > 0,
            guide.experienceYears > 0,
            Array.isArray(guide.galleryImageUrls) && guide.galleryImageUrls.length > 0,
        ];
        const filled = fields.filter(Boolean).length;
        return Math.round((filled / fields.length) * 100);
    }, [guide]);

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
            instagram: guide.instagram || "",
            linkedin: guide.linkedin || "",
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
            setGuide(res.data ?? res);
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
            const profileImageUrl = res.data?.profileImageUrl || res.profileImageUrl || null;
            setGuide((prev) => ({ ...prev, profileImageUrl }));
            updateUser({ profileImageUrl });
            setSnackbar({ open: true, message: "Profil resmi güncellendi" });
        } catch (err) {
            setSnackbar({ open: true, message: err.message || "Resim yüklenirken hata oluştu" });
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    const handleBannerUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        try {
            setUploadingBanner(true);
            const res = await guideApi.uploadBannerImage(user.id, file);
            setGuide((prev) => ({
                ...prev,
                bannerImageUrl: res.data?.bannerImageUrl || res.bannerImageUrl,
            }));
            setSnackbar({ open: true, message: "Kapak fotoğrafı güncellendi" });
        } catch (err) {
            setSnackbar({ open: true, message: err.message || "Kapak fotoğrafı yüklenirken hata oluştu" });
        } finally {
            setUploadingBanner(false);
            if (bannerInputRef.current) bannerInputRef.current.value = "";
        }
    };

    const handleGalleryAdd = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        try {
            setUploadingGallery(true);
            const res = await guideApi.uploadGalleryImage(user.id, file);
            setGuide((prev) => ({
                ...prev,
                galleryImageUrls: res.data?.galleryImageUrls || prev.galleryImageUrls || [],
            }));
            setSnackbar({ open: true, message: "Fotoğraf galeriye eklendi" });
        } catch (err) {
            setSnackbar({ open: true, message: err.message || "Galeri fotoğrafı yüklenirken hata oluştu" });
        } finally {
            setUploadingGallery(false);
            if (galleryInputRef.current) galleryInputRef.current.value = "";
        }
    };

    const handleGalleryRemove = async (imageUrl) => {
        try {
            const res = await guideApi.removeGalleryImage(user.id, imageUrl);
            setGuide((prev) => ({
                ...prev,
                galleryImageUrls: res.data?.galleryImageUrls || [],
            }));
            setSnackbar({ open: true, message: "Fotoğraf galeriden kaldırıldı" });
        } catch (err) {
            setSnackbar({ open: true, message: err.message || "Galeri fotoğrafı silinirken hata oluştu" });
        }
    };

    const getImageSrc = (url) => {
        if (!url) return undefined;
        if (url.startsWith("http") || url.startsWith("data:")) return url;
        const base = (import.meta.env.VITE_API_URL || "").replace(/\/api\/?$/, "");
        return `${base}${url}`;
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

    if (!guide) return null;

    const memberSince = new Date(guide.createdAt).toLocaleDateString("tr-TR", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    const bannerImageSrc = getImageSrc(guide.bannerImageUrl);

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
                            background: bannerImageSrc
                                ? `url(${bannerImageSrc}) center/cover no-repeat`
                                : "linear-gradient(135deg, #2D3436 0%, #636e72 40%, #D35400 100%)",
                            position: "relative",
                        }}
                    >
                        <Tooltip title="Uzman rotalarınızı yansıtan bir fotoğraf yükleyin" arrow>
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

                    {/* ── Avatar + Name + Status ── */}
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
                            {/* Avatar */}
                            <Box sx={{ position: "relative", display: "inline-flex" }}>
                                <Avatar
                                    src={getImageSrc(guide.profileImageUrl)}
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
                                    {guide.firstName?.charAt(0)?.toUpperCase()}
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
                                        flexWrap: "wrap",
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
                                    {/* Availability Status */}
                                    <Chip
                                        icon={
                                            <FiberManualRecordIcon
                                                sx={{
                                                    fontSize: 12,
                                                    color: available ? "#4caf50" : "#f44336",
                                                }}
                                            />
                                        }
                                        label={available ? "Müsait" : "Turda / Meşgul"}
                                        size="small"
                                        variant="outlined"
                                        sx={{
                                            borderColor: available ? "#4caf50" : "#f44336",
                                            cursor: "pointer",
                                        }}
                                        onClick={() => setAvailable((p) => !p)}
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

                {/* ════════════ PROFILE COMPLETION BAR ════════════ */}
                <Paper
                    elevation={0}
                    sx={{
                        p: { xs: 2.5, md: 3 },
                        borderRadius: 4,
                        border: "1px solid",
                        borderColor: "divider",
                        mb: 3,
                        boxShadow: "0 2px 16px rgba(0,0,0,0.04)",
                    }}
                >
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
                        <Typography variant="subtitle2" fontWeight={700}>
                            Profil Tamamlanma Oranı
                        </Typography>
                        <Typography variant="subtitle2" fontWeight={800} color="secondary.main">
                            %{profileCompletion}
                        </Typography>
                    </Box>
                    <LinearProgress
                        variant="determinate"
                        value={profileCompletion}
                        sx={{
                            height: 10,
                            borderRadius: 5,
                            bgcolor: "grey.100",
                            "& .MuiLinearProgress-bar": {
                                borderRadius: 5,
                                background: profileCompletion === 100
                                    ? "linear-gradient(90deg, #4caf50, #81c784)"
                                    : "linear-gradient(90deg, #D35400, #F39C12)",
                            },
                        }}
                    />
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 0.75, display: "block" }}>
                        {profileCompletion < 100
                            ? `Profiliniz %${profileCompletion} tamamlandı. Eksik alanları doldurarak ve galeri ekleyerek %100 yapabilirsiniz!`
                            : "Tebrikler! Profiliniz %100 tamamlandı."}
                    </Typography>
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

                    {/* ── Biography ── */}
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
                                {guide.biography || "Henüz bir biyografi eklenmedi. Düzenle butonuna tıklayarak kendinizi tanıtabilirsiniz."}
                            </Typography>
                        )}
                    </Paper>

                    {/* ── Languages & Expertise ── */}
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
                                        value={formData.experienceYears ?? ""}
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

                        {/* Social Media */}
                        <Divider sx={{ my: 3 }} />
                        <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
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
                                        placeholder="https://instagram.com/kullaniciadi"
                                    />
                                    <TextField
                                        value={formData.linkedin || ""}
                                        onChange={handleFormChange("linkedin")}
                                        size="small"
                                        fullWidth
                                        label="LinkedIn"
                                        placeholder="https://linkedin.com/in/kullaniciadi"
                                    />
                                </>
                            ) : (
                                <>
                                    <SocialRow
                                        iconSrc="https://cdn-icons-png.flaticon.com/24/2111/2111463.png"
                                        label="Instagram"
                                        value={guide.instagram}
                                    />
                                    <SocialRow
                                        iconSrc="https://cdn-icons-png.flaticon.com/24/3536/3536505.png"
                                        label="LinkedIn"
                                        value={guide.linkedin}
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
                                icon={<MapIcon sx={{ fontSize: 32, color: "secondary.main" }} />}
                                value={stats.totalTours}
                                label="Toplam Tur"
                            />
                            <StatCard
                                icon={<BusinessIcon sx={{ fontSize: 32, color: "secondary.main" }} />}
                                value={stats.totalCompanies}
                                label="Kayıtlı Firma"
                            />
                            <StatCard
                                icon={<WorkHistoryIcon sx={{ fontSize: 32, color: "secondary.main" }} />}
                                value={stats.experienceYears}
                                label="Deneyim (Yıl)"
                            />
                            <StatCard
                                icon={<StarIcon sx={{ fontSize: 32, color: "secondary.main" }} />}
                                value={stats.rating > 0 ? Number(stats.rating).toFixed(1) : "0.0"}
                                label="Ortalama Puan"
                            />
                        </Box>
                    </Paper>

                    {/* ════════════ GALLERY / PORTFOLIO ════════════ */}
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
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
                            <Typography variant="h6" fontWeight={700} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <CollectionsIcon color="secondary" />
                                Öne Çıkan Kareler
                            </Typography>
                            <Tooltip title="Galeri fotoğrafı ekle">
                                <IconButton
                                    color="secondary"
                                    onClick={() => galleryInputRef.current?.click()}
                                    disabled={uploadingGallery}
                                >
                                    {uploadingGallery ? (
                                        <CircularProgress size={20} color="inherit" />
                                    ) : (
                                        <AddPhotoAlternateIcon />
                                    )}
                                </IconButton>
                            </Tooltip>
                            <input
                                ref={galleryInputRef}
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                hidden
                                onChange={handleGalleryAdd}
                            />
                        </Box>

                        {galleryImages.length === 0 ? (
                            <Box
                                sx={{
                                    py: 6,
                                    textAlign: "center",
                                    border: "2px dashed",
                                    borderColor: "divider",
                                    borderRadius: 3,
                                    cursor: "pointer",
                                }}
                                onClick={() => galleryInputRef.current?.click()}
                            >
                                <AddPhotoAlternateIcon sx={{ fontSize: 48, color: "text.disabled", mb: 1 }} />
                                <Typography variant="body2" color="text.secondary">
                                    Turlarınızdan fotoğraflar ekleyin
                                </Typography>
                            </Box>
                        ) : (
                            <Box
                                sx={{
                                    display: "grid",
                                    gridTemplateColumns: {
                                        xs: "1fr 1fr",
                                        sm: "1fr 1fr 1fr",
                                        md: "1fr 1fr 1fr 1fr",
                                    },
                                    gap: 2,
                                }}
                            >
                                {galleryImages.map((img, idx) => (
                                    <Box
                                        key={img}
                                        sx={{
                                            position: "relative",
                                            paddingTop: "75%",
                                            borderRadius: 3,
                                            overflow: "hidden",
                                            "&:hover .gallery-overlay": { opacity: 1 },
                                        }}
                                    >
                                        <Box
                                            component="img"
                                            src={getImageSrc(img)}
                                            alt={`Galeri ${idx + 1}`}
                                            sx={{
                                                position: "absolute",
                                                top: 0,
                                                left: 0,
                                                width: "100%",
                                                height: "100%",
                                                objectFit: "cover",
                                            }}
                                        />
                                        <Box
                                            className="gallery-overlay"
                                            sx={{
                                                position: "absolute",
                                                top: 0,
                                                left: 0,
                                                right: 0,
                                                bottom: 0,
                                                bgcolor: "rgba(0,0,0,0.45)",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                opacity: 0,
                                                transition: "opacity 0.2s",
                                            }}
                                        >
                                            <IconButton
                                                size="small"
                                                onClick={() => handleGalleryRemove(img)}
                                                sx={{ color: "#fff", bgcolor: "rgba(244,67,54,0.8)", "&:hover": { bgcolor: "error.main" } }}
                                            >
                                                <CloseIcon sx={{ fontSize: 18 }} />
                                            </IconButton>
                                        </Box>
                                    </Box>
                                ))}
                                {/* Add more button */}
                                <Box
                                    sx={{
                                        paddingTop: "75%",
                                        position: "relative",
                                        borderRadius: 3,
                                        border: "2px dashed",
                                        borderColor: "divider",
                                        cursor: "pointer",
                                        transition: "border-color 0.2s",
                                        "&:hover": { borderColor: "secondary.main" },
                                    }}
                                    onClick={() => galleryInputRef.current?.click()}
                                >
                                    <Box
                                        sx={{
                                            position: "absolute",
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            bottom: 0,
                                            display: "flex",
                                            flexDirection: "column",
                                            alignItems: "center",
                                            justifyContent: "center",
                                        }}
                                    >
                                        <AddPhotoAlternateIcon sx={{ fontSize: 32, color: "text.disabled" }} />
                                        <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                                            Ekle
                                        </Typography>
                                    </Box>
                                </Box>
                            </Box>
                        )}
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

function SocialRow({ iconSrc, label, value }) {
    return (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <img src={iconSrc} alt={label} width={20} height={20} style={{ opacity: 0.7 }} />
            <Box>
                <Typography variant="caption" color="text.secondary">
                    {label}
                </Typography>
                {value ? (
                    <Typography
                        variant="body2"
                        fontWeight={500}
                        component="a"
                        href={value}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{ display: "block", color: "secondary.main", textDecoration: "none", "&:hover": { textDecoration: "underline" } }}
                    >
                        {value}
                    </Typography>
                ) : (
                    <Typography variant="body2" color="text.disabled">
                        Henüz eklenmedi
                    </Typography>
                )}
            </Box>
        </Box>
    );
}

function StatCard({ icon, value, label, small }) {
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
            <Typography variant={small ? "body1" : "h4"} fontWeight={800} sx={{ mt: 1 }}>
                {value}
            </Typography>
            <Typography variant="body2" color="text.secondary">
                {label}
            </Typography>
        </Box>
    );
}
