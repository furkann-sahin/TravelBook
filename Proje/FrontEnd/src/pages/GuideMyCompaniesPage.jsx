import { useState, useEffect, useCallback } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  Paper,
  Skeleton,
  Alert,
  Button,
  Chip,
  Snackbar,
} from "@mui/material";
import BusinessIcon from "@mui/icons-material/Business";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";

import { useAuth } from "../hooks/useAuth";
import { guideApi } from "../services/api";

export default function GuideMyCompaniesPage() {
  const { user } = useAuth();
  const [myCompanies, setMyCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "" });

  const fetchData = useCallback(async () => {
  if (!user?.id) return;
  try {
  setLoading(true);
  setError(null);
  const res = await guideApi.listMyCompanies(user.id);
  setMyCompanies(res?.data ?? res ?? []);
  } catch (err) {
  setError(err.message || "Veriler yüklenirken bir hata oluştu.");
  } finally {
  setLoading(false);
  }
  }, [user?.id]);

  useEffect(() => {
  fetchData();
  }, [fetchData]);

  const handleRemove = async (companyId) => {
  try {
  await guideApi.removeFromCompany(user.id, companyId);
  setMyCompanies((prev) => prev.filter((c) => (c._id || c.id) !== companyId));
  setSnackbar({ open: true, message: "Firma kaydınız silindi" });
  } catch (err) {
  setSnackbar({ open: true, message: err.message || "Kayıt silinirken hata oluştu" });
  }
  };

  if (loading) {
  return (
  <Box sx={{ bgcolor: "background.default", minHeight: "80vh", py: 6 }}>
  <Container maxWidth="lg">
  <Skeleton variant="text" width={300} height={48} sx={{ mb: 1 }} />
  <Skeleton variant="text" width={400} height={24} sx={{ mb: 4 }} />
  <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "1fr 1fr 1fr" }, gap: 3 }}>
  {[...Array(3)].map((_, i) => (
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
  {/* Page header */}
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
  <CheckCircleIcon color="secondary" />
  Kayıtlı Tur Firmalarım
  </Typography>
  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
  Kayıtlı olduğunuz tur firmalarını görüntüleyin ve yönetin
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

  {myCompanies.length === 0 ? (
  <Paper
  elevation={0}
  sx={{
  p: 5,
  borderRadius: 4,
  border: "1px solid",
  borderColor: "divider",
  textAlign: "center",
  }}
  >
  <BusinessIcon sx={{ fontSize: 56, color: "text.disabled", mb: 2 }} />
  <Typography variant="h6" color="text.secondary" gutterBottom>
  Henüz bir firmaya kayıt olmadınız
  </Typography>
  <Button
  component={RouterLink}
  to="/guide/companies"
  variant="contained"
  color="secondary"
  sx={{ mt: 1 }}
  >
  Tur Firmalarına Göz At
  </Button>
  </Paper>
  ) : (
  <Box
  sx={{
  display: "grid",
  gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "1fr 1fr 1fr" },
  gap: 3,
  }}
  >
  {myCompanies.map((company) => {
  const cId = company._id || company.id;
  return (
  <Paper
  key={cId}
  elevation={0}
  sx={{
  p: 3,
  borderRadius: 4,
  border: "1px solid",
  borderColor: "success.light",
  transition: "all 0.2s ease",
  "&:hover": {
  borderColor: "success.main",
  boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
  },
  }}
  >
  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
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
  mb: 1,
  display: "-webkit-box",
  WebkitLineClamp: 2,
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
  }}
  >
  {company.description}
  </Typography>
  )}
  {company.phone && (
  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 0.5 }}>
  <PhoneIcon sx={{ fontSize: 16, color: "text.secondary" }} />
  <Typography variant="body2" color="text.secondary">
  {company.phone}
  </Typography>
  </Box>
  )}
  {company.address && (
  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
  <LocationOnIcon sx={{ fontSize: 16, color: "text.secondary" }} />
  <Typography variant="body2" color="text.secondary" noWrap>
  {company.address}
  </Typography>
  </Box>
  )}
  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mt: 1.5 }}>
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
  startIcon={<RemoveCircleOutlineIcon />}
  sx={{ textTransform: "none", fontWeight: 600 }}
  onClick={() => handleRemove(cId)}
  >
  Kaydı Sil
  </Button>
  </Box>
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
