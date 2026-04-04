import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

// Material-UI components and icons
import {
    Container,
    Box,
    Typography,
    Paper,
    Button,
    TextField,
    Card,
    CardContent,
    Avatar,
    Chip,
    Divider,
    List,
    ListItem,
    ListItemText,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    DialogContentText,
    Alert,
    CircularProgress,
    Tabs,
    Tab,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import BusinessIcon from "@mui/icons-material/Business";
import MapIcon from "@mui/icons-material/Map";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import LogoutIcon from "@mui/icons-material/Logout";
import DirectionsBusIcon from "@mui/icons-material/DirectionsBus";

import { useAuth } from "../hooks/useAuth";
import { guideApi } from "../services/api";

export default function GuideDashboard() {
    const navigate = useNavigate();
    const { user, logout, isAuthenticated } = useAuth();

    const [tabIndex, setTabIndex] = useState(0);

    // Profile state
    const [profile, setProfile] = useState(null);
    const [editing, setEditing] = useState(false);
    const [editForm, setEditForm] = useState({});
    const [deleteOpen, setDeleteOpen] = useState(false);

    // Companies state
    const [companies, setCompanies] = useState([]);

    // Tours state
    const [tours, setTours] = useState([]);
    const [tourId, setTourId] = useState("");

    // Common state
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const guideId = user?.id;

    // Redirect if not authenticated
    useEffect(() => {
        if (!isAuthenticated || user?.role !== "guide") {
            navigate("/login");
        }
    }, [isAuthenticated, user, navigate]);

    // Fetch profile
    const fetchProfile = useCallback(async () => {
        if (!guideId) return;
        try {
            setLoading(true);
            const data = await guideApi.getDetail(guideId);
            setProfile(data);
        } catch (err) {
            setError(err.message || "Profil yüklenemedi");
        } finally {
            setLoading(false);
        }
    }, [guideId]);

    // Fetch companies
    const fetchCompanies = useCallback(async () => {
        try {
            setLoading(true);
            const data = await guideApi.listCompanies();
            setCompanies(Array.isArray(data) ? data : []);
        } catch (err) {
            setError(err.message || "Firmalar yüklenemedi");
        } finally {
            setLoading(false);
        }
    }, []);

    // Fetch tours
    const fetchTours = useCallback(async () => {
        if (!guideId) return;
        try {
            setLoading(true);
            const data = await guideApi.listTours(guideId);
            setTours(Array.isArray(data) ? data : []);
        } catch (err) {
            setError(err.message || "Turlar yüklenemedi");
        } finally {
            setLoading(false);
        }
    }, [guideId]);

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    useEffect(() => {
        if (tabIndex === 1) fetchCompanies();
        if (tabIndex === 2) fetchTours();
    }, [tabIndex, fetchCompanies, fetchTours]);

    // Clear messages on tab change
    useEffect(() => {
        setError("");
        setSuccess("");
    }, [tabIndex]);

    // Profile edit handlers
    const handleEdit = () => {
        setEditing(true);
        setEditForm({
            firstName: profile?.firstName || "",
            lastName: profile?.lastName || "",
            phone: profile?.phone || "",
            biography: profile?.biography || "",
            languages: (profile?.languages || []).join(", "),
            expertRoutes: (profile?.expertRoutes || []).join(", "),
        });
    };

    const handleUpdate = async () => {
        try {
            setLoading(true);
            setError("");
            const data = {
                ...editForm,
                languages: editForm.languages
                    .split(",")
                    .map((l) => l.trim())
                    .filter(Boolean),
                expertRoutes: editForm.expertRoutes
                    .split(",")
                    .map((r) => r.trim())
                    .filter(Boolean),
            };
            await guideApi.updateProfile(guideId, data);
            setSuccess("Profil başarıyla güncellendi");
            setEditing(false);
            fetchProfile();
        } catch (err) {
            setError(err.message || "Güncelleme başarısız");
        } finally {
            setLoading(false);
        }
    };

    // Delete account
    const handleDelete = async () => {
        try {
            await guideApi.deleteAccount(guideId);
            logout();
            navigate("/");
        } catch (err) {
            setError(err.message || "Hesap silinemedi");
        }
        setDeleteOpen(false);
    };

    // Tour operations
    const handleAssignTour = async () => {
        if (!tourId.trim()) return;
        try {
            setError("");
            await guideApi.assignTour(guideId, tourId.trim());
            setSuccess("Tura başarıyla kayıt olundu");
            setTourId("");
            fetchTours();
        } catch (err) {
            setError(err.message || "Tura kayıt başarısız");
        }
    };

    const handleRemoveTour = async (tid) => {
        try {
            setError("");
            await guideApi.removeTour(guideId, tid);
            setSuccess("Turdan başarıyla çıkıldı");
            fetchTours();
        } catch (err) {
            setError(err.message || "Turdan çıkış başarısız");
        }
    };

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    // ─── Profile Tab ──────────────────────────────────────────────
    const renderProfileTab = () => (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {!editing ? (
                <Card elevation={2} sx={{ borderRadius: 3 }}>
                    <CardContent sx={{ p: 4 }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
                            <Avatar
                                sx={{
                                    width: 64,
                                    height: 64,
                                    bgcolor: "secondary.main",
                                    fontSize: 28,
                                }}
                            >
                                {profile?.firstName?.charAt(0)?.toUpperCase() || (
                                    <PersonIcon />
                                )}
                            </Avatar>
                            <Box>
                                <Typography variant="h5" fontWeight={700}>
                                    {profile?.firstName} {profile?.lastName}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {profile?.email}
                                </Typography>
                            </Box>
                        </Box>

                        <Divider sx={{ mb: 2 }} />

                        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                            {profile?.phone && (
                                <Typography variant="body1">
                                    <strong>Telefon:</strong> {profile.phone}
                                </Typography>
                            )}
                            {profile?.biography && (
                                <Typography variant="body1">
                                    <strong>Biyografi:</strong> {profile.biography}
                                </Typography>
                            )}
                            {profile?.experienceYears > 0 && (
                                <Typography variant="body1">
                                    <strong>Deneyim:</strong> {profile.experienceYears} yıl
                                </Typography>
                            )}
                            {profile?.rating > 0 && (
                                <Typography variant="body1">
                                    <strong>Puan:</strong> {profile.rating} / 5 (
                                    {profile.reviewCount} değerlendirme)
                                </Typography>
                            )}
                            {profile?.languages?.length > 0 && (
                                <Box>
                                    <Typography variant="body1" fontWeight={600} sx={{ mb: 0.5 }}>
                                        Diller:
                                    </Typography>
                                    <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                                        {profile.languages.map((lang) => (
                                            <Chip key={lang} label={lang} size="small" />
                                        ))}
                                    </Box>
                                </Box>
                            )}
                            {profile?.expertRoutes?.length > 0 && (
                                <Box>
                                    <Typography variant="body1" fontWeight={600} sx={{ mb: 0.5 }}>
                                        Uzman Rotalar:
                                    </Typography>
                                    <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                                        {profile.expertRoutes.map((route) => (
                                            <Chip
                                                key={route}
                                                label={route}
                                                size="small"
                                                color="secondary"
                                                variant="outlined"
                                            />
                                        ))}
                                    </Box>
                                </Box>
                            )}
                        </Box>

                        <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
                            <Button
                                variant="contained"
                                startIcon={<EditIcon />}
                                onClick={handleEdit}
                            >
                                Profili Düzenle
                            </Button>
                            <Button
                                variant="outlined"
                                color="error"
                                startIcon={<DeleteIcon />}
                                onClick={() => setDeleteOpen(true)}
                            >
                                Hesabı Sil
                            </Button>
                        </Box>
                    </CardContent>
                </Card>
            ) : (
                <Card elevation={2} sx={{ borderRadius: 3 }}>
                    <CardContent sx={{ p: 4 }}>
                        <Typography variant="h6" fontWeight={700} sx={{ mb: 3 }}>
                            Profili Düzenle
                        </Typography>
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
                            <TextField
                                label="Ad"
                                fullWidth
                                value={editForm.firstName}
                                onChange={(e) =>
                                    setEditForm({ ...editForm, firstName: e.target.value })
                                }
                            />
                            <TextField
                                label="Soyad"
                                fullWidth
                                value={editForm.lastName}
                                onChange={(e) =>
                                    setEditForm({ ...editForm, lastName: e.target.value })
                                }
                            />
                            <TextField
                                label="Telefon"
                                type="tel"
                                fullWidth
                                value={editForm.phone}
                                onChange={(e) =>
                                    setEditForm({ ...editForm, phone: e.target.value })
                                }
                            />
                            <TextField
                                label="Biyografi"
                                fullWidth
                                multiline
                                minRows={3}
                                value={editForm.biography}
                                onChange={(e) =>
                                    setEditForm({ ...editForm, biography: e.target.value })
                                }
                            />
                            <TextField
                                label="Diller"
                                fullWidth
                                value={editForm.languages}
                                onChange={(e) =>
                                    setEditForm({ ...editForm, languages: e.target.value })
                                }
                                helperText="Virgülle ayırarak yazın"
                            />
                            <TextField
                                label="Uzman Rotalar"
                                fullWidth
                                value={editForm.expertRoutes}
                                onChange={(e) =>
                                    setEditForm({ ...editForm, expertRoutes: e.target.value })
                                }
                                helperText="Virgülle ayırarak yazın"
                            />
                            <Box sx={{ display: "flex", gap: 2 }}>
                                <Button variant="contained" onClick={handleUpdate} disabled={loading}>
                                    {loading ? "Kaydediliyor…" : "Kaydet"}
                                </Button>
                                <Button
                                    variant="outlined"
                                    onClick={() => setEditing(false)}
                                >
                                    İptal
                                </Button>
                            </Box>
                        </Box>
                    </CardContent>
                </Card>
            )}

            {/* Delete Account Dialog */}
            <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)}>
                <DialogTitle>Hesabı Sil</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Hesabınızı silmek istediğinizden emin misiniz? Bu işlem geri
                        alınamaz ve tüm verileriniz kalıcı olarak kaldırılır.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteOpen(false)}>İptal</Button>
                    <Button onClick={handleDelete} color="error" variant="contained">
                        Hesabı Sil
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );

    // ─── Companies Tab ────────────────────────────────────────────
    const renderCompaniesTab = () => (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {companies.length === 0 && !loading && (
                <Typography color="text.secondary" textAlign="center" sx={{ py: 4 }}>
                    Henüz kayıtlı tur firması bulunmuyor.
                </Typography>
            )}
            {companies.map((company) => (
                <Card key={company._id} elevation={2} sx={{ borderRadius: 3 }}>
                    <CardContent sx={{ p: 3 }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
                            <Avatar sx={{ bgcolor: "primary.main" }}>
                                <BusinessIcon />
                            </Avatar>
                            <Box>
                                <Typography variant="h6" fontWeight={700}>
                                    {company.name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {company.email}
                                </Typography>
                            </Box>
                        </Box>
                        {company.phone && (
                            <Typography variant="body2" sx={{ mt: 1 }}>
                                <strong>Telefon:</strong> {company.phone}
                            </Typography>
                        )}
                        {company.address && (
                            <Typography variant="body2">
                                <strong>Adres:</strong> {company.address}
                            </Typography>
                        )}
                        {company.description && (
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                {company.description}
                            </Typography>
                        )}
                        {company.rating > 0 && (
                            <Chip
                                label={`⭐ ${company.rating} / 5`}
                                size="small"
                                sx={{ mt: 1 }}
                            />
                        )}
                    </CardContent>
                </Card>
            ))}
        </Box>
    );

    // ─── Tours Tab ────────────────────────────────────────────────
    const renderToursTab = () => (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {/* Add Tour */}
            <Card elevation={2} sx={{ borderRadius: 3 }}>
                <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
                        Tura Kayıt Ol
                    </Typography>
                    <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
                        <TextField
                            label="Tur ID"
                            fullWidth
                            value={tourId}
                            onChange={(e) => setTourId(e.target.value)}
                            placeholder="Katılmak istediğiniz turun ID'sini girin"
                            size="small"
                        />
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={handleAssignTour}
                            sx={{ whiteSpace: "nowrap", minWidth: 140 }}
                        >
                            Kayıt Ol
                        </Button>
                    </Box>
                </CardContent>
            </Card>

            {/* Tour List */}
            <Card elevation={2} sx={{ borderRadius: 3 }}>
                <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
                        Kayıtlı Turlarım
                    </Typography>
                    {tours.length === 0 && !loading ? (
                        <Typography color="text.secondary" textAlign="center" sx={{ py: 3 }}>
                            Henüz kayıtlı turunuz bulunmuyor.
                        </Typography>
                    ) : (
                        <List disablePadding>
                            {tours.map((tour, index) => (
                                <Box key={tour._id || index}>
                                    {index > 0 && <Divider />}
                                    <ListItem
                                        secondaryAction={
                                            <IconButton
                                                edge="end"
                                                color="error"
                                                onClick={() => handleRemoveTour(tour._id)}
                                                title="Turdan çık"
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        }
                                    >
                                        <ListItemText
                                            primary={tour.name || tour.title || `Tur ${tour._id}`}
                                            secondary={tour.description || tour._id}
                                        />
                                    </ListItem>
                                </Box>
                            ))}
                        </List>
                    )}
                </CardContent>
            </Card>
        </Box>
    );

    if (!isAuthenticated || user?.role !== "guide") return null;

    return (
        <Box
            sx={{
                minHeight: "100vh",
                bgcolor: "background.default",
            }}
        >
            {/* Header */}
            <Box
                sx={{
                    background:
                        "linear-gradient(135deg, #2D3436 0%, #636e72 50%, #2D3436 100%)",
                    color: "#fff",
                    py: 4,
                }}
            >
                <Container maxWidth="md">
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                        }}
                    >
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                            <DirectionsBusIcon sx={{ fontSize: 36 }} />
                            <Box>
                                <Typography variant="h4" fontWeight={800}>
                                    TravelBook
                                </Typography>
                                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                                    Rehber Paneli
                                </Typography>
                            </Box>
                        </Box>
                        <Button
                            variant="outlined"
                            startIcon={<LogoutIcon />}
                            onClick={handleLogout}
                            sx={{
                                color: "#fff",
                                borderColor: "rgba(255,255,255,0.4)",
                                "&:hover": { borderColor: "#fff", bgcolor: "rgba(255,255,255,0.1)" },
                            }}
                        >
                            Çıkış Yap
                        </Button>
                    </Box>
                </Container>
            </Box>

            {/* Content */}
            <Container maxWidth="md" sx={{ mt: -2 }}>
                <Paper elevation={4} sx={{ borderRadius: 4, overflow: "hidden" }}>
                    <Tabs
                        value={tabIndex}
                        onChange={(_, v) => setTabIndex(v)}
                        variant="fullWidth"
                        sx={{
                            bgcolor: "grey.50",
                            "& .MuiTab-root": {
                                minHeight: 56,
                                textTransform: "none",
                                fontWeight: 600,
                            },
                            "& .Mui-selected": { color: "primary.main" },
                        }}
                    >
                        <Tab icon={<PersonIcon />} label="Profilim" iconPosition="start" />
                        <Tab
                            icon={<BusinessIcon />}
                            label="Tur Firmaları"
                            iconPosition="start"
                        />
                        <Tab icon={<MapIcon />} label="Turlarım" iconPosition="start" />
                    </Tabs>

                    <Box sx={{ p: { xs: 2, sm: 4 } }}>
                        {loading && (
                            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                                <CircularProgress />
                            </Box>
                        )}

                        {error && (
                            <Alert
                                severity="error"
                                onClose={() => setError("")}
                                sx={{ mb: 3 }}
                            >
                                {error}
                            </Alert>
                        )}

                        {success && (
                            <Alert
                                severity="success"
                                onClose={() => setSuccess("")}
                                sx={{ mb: 3 }}
                            >
                                {success}
                            </Alert>
                        )}

                        {!loading && tabIndex === 0 && profile && renderProfileTab()}
                        {!loading && tabIndex === 1 && renderCompaniesTab()}
                        {!loading && tabIndex === 2 && renderToursTab()}
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
}
