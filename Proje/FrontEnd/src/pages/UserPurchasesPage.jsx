import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  CircularProgress,
  Container,
  Paper,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { useAuth } from "../hooks/useAuth";
import { userApi } from "../services/api";

export default function UserPurchasesPage() {
  const navigate = useNavigate();
  const { userId } = useParams();
  const [searchParams] = useSearchParams();
  const { user, isAuthenticated } = useAuth();

  const initialStatus = searchParams.get("status") === "past" ? "past" : "future";
  const [status, setStatus] = useState(initialStatus);
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const effectiveUserId = useMemo(() => userId || user?.id, [userId, user?.id]);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "user") {
      navigate("/login", { replace: true });
      return;
    }

    if (effectiveUserId && user?.id && effectiveUserId !== user.id) {
      navigate(`/users/${user.id}/purchases`, { replace: true });
      return;
    }

    const fetchPurchases = async () => {
      if (!effectiveUserId) return;
      setLoading(true);
      setError("");

      try {
        const res = await userApi.getPurchases(effectiveUserId, status);
        setPurchases(res.data || []);
      } catch (err) {
        setError(err.message || "Seyahatler yüklenemedi.");
      } finally {
        setLoading(false);
      }
    };

    fetchPurchases();
  }, [effectiveUserId, isAuthenticated, navigate, status, user?.id, user?.role]);

  const formatDate = (value) =>
    new Date(value).toLocaleDateString("tr-TR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  return (
    <Box sx={{ py: 5 }}>
      <Container maxWidth="md">
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2.5, md: 3 },
            borderRadius: 3,
            border: "1px solid",
            borderColor: "divider",
            mb: 3,
          }}
        >
          <Typography variant="h4" fontWeight={800} sx={{ mb: 1 }}>
            Seyahatlerim
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 2 }}>
            Geçmiş ve gelecek satın aldığınız turları görüntüleyebilirsiniz.
          </Typography>

          <ToggleButtonGroup
            exclusive
            value={status}
            onChange={(_, nextStatus) => {
              if (nextStatus) setStatus(nextStatus);
            }}
            color="secondary"
            size="small"
          >
            <ToggleButton value="future">Gelecek Turlar</ToggleButton>
            <ToggleButton value="past">Geçmiş Turlar</ToggleButton>
          </ToggleButtonGroup>
        </Paper>

        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
            <CircularProgress color="secondary" />
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {!loading && !error && purchases.length === 0 && (
          <Alert severity="info">Bu kategori için kayıtlı seyahat bulunamadı.</Alert>
        )}

        <Stack spacing={2.5}>
          {!loading &&
            !error &&
            purchases.map((purchase) => (
              <Card
                key={purchase.id}
                elevation={0}
                sx={{
                  borderRadius: 3,
                  border: "1px solid",
                  borderColor: "divider",
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                }}
              >
                <CardMedia
                  component="img"
                  image={
                    purchase.tour?.imageUrl ||
                    "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=900"
                  }
                  alt={purchase.tour?.title}
                  sx={{ width: { xs: "100%", sm: 220 }, height: { xs: 180, sm: "auto" } }}
                />
                <CardContent sx={{ flex: 1 }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={2}>
                    <Box>
                      <Typography variant="h6" fontWeight={700} gutterBottom>
                        {purchase.tour?.title}
                      </Typography>
                      <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1 }}>
                        <LocationOnIcon sx={{ fontSize: 18, color: "secondary.main" }} />
                        <Typography variant="body2" color="text.secondary">
                          {purchase.tour?.location}
                        </Typography>
                      </Stack>
                      <Stack direction="row" spacing={1.5} alignItems="center">
                        <CalendarTodayIcon sx={{ fontSize: 16, color: "text.disabled" }} />
                        <Typography variant="body2" color="text.secondary">
                          Tur Tarihi: {formatDate(purchase.tour?.date)}
                        </Typography>
                      </Stack>
                    </Box>
                    <Chip
                      label={purchase.status === "past" ? "Geçmiş" : "Gelecek"}
                      color={purchase.status === "past" ? "default" : "secondary"}
                      size="small"
                    />
                  </Stack>

                  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 2.5 }}>
                    <Typography variant="h6" color="secondary.main" fontWeight={800}>
                      ₺{purchase.tour?.price?.toLocaleString("tr-TR")}
                    </Typography>
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={() => navigate(`/tours/${purchase.tour?.id}`)}
                    >
                      Tur Detayı
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            ))}
        </Stack>
      </Container>
    </Box>
  );
}
