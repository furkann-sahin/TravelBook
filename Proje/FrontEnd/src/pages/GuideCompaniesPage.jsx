import { useState, useEffect, useCallback } from "react";
import {
    Container,
    Typography,
    Box,
    Paper,
    Button,
    Skeleton,
    Alert,
    Chip,
    Rating,
    Snackbar,
} from "@mui/material";
import BusinessIcon from "@mui/icons-material/Business";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Link as RouterLink } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { guideApi } from "../services/api";

export default function GuideCompaniesPage() {
    const { user } = useAuth();

    const [companies, setCompanies] = useState([]);
    const [myCompanyIds, setMyCompanyIds] = useState(new Set());
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: "" });

    const fetchData = useCallback(async () => {
        if (!user?.id) return;
        try {
            setLoading(true);
            setError(null);
            const [allRes, myRes] = await Promise.all([
                guideApi.listCompanies(),
                guideApi.listMyCompanies(user.id),
            ]);
            setCompanies(allRes?.data ?? []);
            const ids = new Set((myRes ?? []).map((c) => c._id || c.id));
            setMyCompanyIds(ids);
        } catch (err) {
            setError(err.message || "Veriler yüklenirken bir hata oluştu.");
        } finally {
            setLoading(false);
        }
    }, [user?.id]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleApply = async (companyId) => {
        try {
            await guideApi.applyToCompany(user.id, companyId);
            setMyCompanyIds((prev) => new Set([...prev, companyId]));
            setSnackbar({ open: true, message: "Firmaya başarıyla kayıt oldunuz" });
        } catch (err) {
            setSnackbar({
                open: true,
                message: err.message || "Kayıt olurken hata oluştu",
            });
        }
    };

    const handleRemove = async (companyId) => {
        try {
            await guideApi.removeFromCompany(user.id, companyId);
            setMyCompanyIds((prev) => {
                const next = new Set(prev);
                next.delete(companyId);
                return next;
            });
            setSnackbar({ open: true, message: "Firma kaydınız silindi" });
        } catch (err) {
            setSnackbar({
                open: true,
                message: err.message || "Kayıt silinirken hata oluştu",
            });
        }
    };

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
                            <Paper key={i} sx={{ p: 3, borderRadius: 4 }}>
                                <Skeleton variant="text" width="60%" height={32} />
                                <Skeleton variant="text" width="80%" />
                                <Skeleton variant="text" width="50%" />
                            </Paper>
                        ))}
                    </Box>
                </Container>
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ bgcolor: "background.default", minHeight: "80vh", py: 6 }}>
                <Container maxWidth="md" sx={{ textAlign: "center" }}>
                    <Alert
                        severity="error"
                        sx={{ maxWidth: 520, mx: "auto", mb: 3 }}
                        action={
                            <Button color="inherit" size="small" onClick={fetchData}>
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
                {/* Header */}
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
                            <BusinessIcon color="secondary" fontSize="large" />
                            Tur Firmaları
                        </Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
                            Çalışmak istediğiniz tur firmasına kayıt olun.
                        </Typography>
                    </Box>
                    <Button
                        component={RouterLink}
                        to="/guide"
                        startIcon={<ArrowBackIcon />}
                        variant="outlined"
                        color="secondary"
                    >
                        Panele Dön
                    </Button>
                </Box>

                {companies.length === 0 && (
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
                        <BusinessIcon sx={{ fontSize: 64, color: "text.disabled", mb: 2 }} />
                        <Typography variant="h6" color="text.secondary">
                            Henüz kayıtlı tur firması yok
                        </Typography>
                    </Paper>
                )}

                {companies.length > 0 && (
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
                        {companies.map((company) => {
                            const cId = company._id || company.id;
                            const isRegistered = myCompanyIds.has(cId);
                            return (
                                <Paper
                                    key={cId}
                                    elevation={0}
                                    sx={{
                                        p: 3,
                                        borderRadius: 4,
                                        border: "1px solid",
                                        borderColor: isRegistered ? "success.light" : "divider",
                                        transition: "all 0.2s ease",
                                        "&:hover": {
                                            borderColor: isRegistered
                                                ? "success.main"
                                                : "secondary.light",
                                            boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
                                        },
                                    }}
                                >
                                    <Box
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 1,
                                            mb: 1.5,
                                        }}
                                    >
                                        <BusinessIcon sx={{ color: "secondary.main", fontSize: 28 }} />
                                        <Typography variant="h6" fontWeight={700} noWrap>
                                            {company.name}
                                        </Typography>
                                    </Box>

                                    {company.description && (
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                            sx={{
                                                mb: 1.5,
                                                display: "-webkit-box",
                                                WebkitLineClamp: 2,
                                                WebkitBoxOrient: "vertical",
                                                overflow: "hidden",
                                            }}
                                        >
                                            {company.description}
                                        </Typography>
                                    )}

                                    {company.address && (
                                        <Box
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 0.5,
                                                mb: 0.5,
                                            }}
                                        >
                                            <LocationOnIcon sx={{ fontSize: 16, color: "text.secondary" }} />
                                            <Typography variant="body2" color="text.secondary" noWrap>
                                                {company.address}
                                            </Typography>
                                        </Box>
                                    )}

                                    {company.phone && (
                                        <Box
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 0.5,
                                                mb: 1,
                                            }}
                                        >
                                            <PhoneIcon sx={{ fontSize: 16, color: "text.secondary" }} />
                                            <Typography variant="body2" color="text.secondary">
                                                {company.phone}
                                            </Typography>
                                        </Box>
                                    )}

                                    {company.rating > 0 && (
                                        <Box
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 0.5,
                                                mb: 1.5,
                                            }}
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

                                    {isRegistered ? (
                                        <Box
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "space-between",
                                            }}
                                        >
                                            <Chip
                                                icon={<CheckCircleIcon />}
                                                label="Kayıtlı"
                                                color="success"
                                                size="small"
                                                variant="outlined"
                                            />
                                            <Button
                                                size="small"
                                                color="error"
                                                sx={{ textTransform: "none", fontWeight: 600 }}
                                                onClick={() => handleRemove(cId)}
                                            >
                                                Kaydı Sil
                                            </Button>
                                        </Box>
                                    ) : (
                                        <Button
                                            variant="contained"
                                            color="secondary"
                                            size="small"
                                            fullWidth
                                            startIcon={<AddCircleOutlineIcon />}
                                            sx={{ textTransform: "none", fontWeight: 600 }}
                                            onClick={() => handleApply(cId)}
                                        >
                                            Kayıt Ol
                                        </Button>
                                    )}
                                </Paper>
                            );
                        })}
                    </Box>
                )}

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
