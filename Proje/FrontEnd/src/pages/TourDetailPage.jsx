import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Divider,
  Grid,
  Paper,
  Stack,
  TextField,
  Typography,
  Alert,
  Rating,
  IconButton,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PlaceIcon from "@mui/icons-material/Place";
import MiscellaneousServicesIcon from "@mui/icons-material/MiscellaneousServices";
import BusinessIcon from "@mui/icons-material/Business";
import PersonIcon from "@mui/icons-material/Person";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { tourApi, reviewApi, getImageUrl } from "../services/api";
import { useAuth } from "../hooks/useAuth";
import { formatDate } from "../components/TourCard";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1200";

export default function TourDetailPage() {
  const navigate = useNavigate();
  const { tourId } = useParams();
  const { isAuthenticated, user } = useAuth();

  const [tour, setTour] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reviewError, setReviewError] = useState("");
  const [reviewSuccess, setReviewSuccess] = useState("");
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewForm, setReviewForm] = useState({ comment: "", rating: 0 });
  const [editingReviewId, setEditingReviewId] = useState(null);

  useEffect(() => {
    const fetchTour = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await tourApi.getTourDetail(tourId);
        setTour(res.data);
        setReviews(res.data?.reviews || []);
      } catch (err) {
        setError(err.message || "Tur detayları yüklenemedi.");
      } finally {
        setLoading(false);
      }
    };

    fetchTour();
  }, [tourId]);

  const resetReviewMessages = () => {
    setReviewError("");
    setReviewSuccess("");
  };

  const startEditReview = (review) => {
    setEditingReviewId(review.id);
    setReviewForm({ comment: review.comment, rating: review.rating });
    resetReviewMessages();
  };

  const cancelEditReview = () => {
    setEditingReviewId(null);
    setReviewForm({ comment: "", rating: 0 });
    resetReviewMessages();
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    resetReviewMessages();

    if (!isAuthenticated) {
      setReviewError("Yorum yapmak için giriş yapmalısınız.");
      return;
    }

    if (!reviewForm.comment.trim() || reviewForm.rating < 1) {
      setReviewError("Yorum metni ve en az 1 puan zorunludur.");
      return;
    }

    setReviewLoading(true);
    try {
      if (editingReviewId) {
        const res = await reviewApi.updateReview(editingReviewId, {
          comment: reviewForm.comment,
          rating: reviewForm.rating,
        });

        setReviews((prev) =>
          prev.map((review) =>
            review.id === editingReviewId ? res.data : review,
          ),
        );
        setReviewSuccess("Yorum başarıyla güncellendi.");
      } else {
        const res = await reviewApi.createReview(tourId, {
          comment: reviewForm.comment,
          rating: reviewForm.rating,
        });

        setReviews((prev) => [res.data, ...prev]);
        setReviewSuccess("Yorum başarıyla eklendi.");
      }

      setEditingReviewId(null);
      setReviewForm({ comment: "", rating: 0 });
    } catch (err) {
      setReviewError(err.message || "Yorum işlemi başarısız oldu.");
    } finally {
      setReviewLoading(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm("Bu yorumu silmek istediğinize emin misiniz?")) return;

    resetReviewMessages();
    setReviewLoading(true);
    try {
      await reviewApi.deleteReview(reviewId);
      setReviews((prev) => prev.filter((review) => review.id !== reviewId));
      if (editingReviewId === reviewId) {
        cancelEditReview();
      }
      setReviewSuccess("Yorum başarıyla silindi.");
    } catch (err) {
      setReviewError(err.message || "Yorum silinemedi.");
    } finally {
      setReviewLoading(false);
    }
  };

  /* ── Loading ── */
  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, display: "flex", justifyContent: "center" }}>
        <CircularProgress color="secondary" />
      </Container>
    );
  }

  /* ── Error ── */
  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
          {error}
        </Alert>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate("/user/tours")}>
          Turlara Dön
        </Button>
      </Container>
    );
  }

  if (!tour) return null;

  const routeLabel =
    tour.departureLocation && tour.arrivalLocation
      ? `${tour.departureLocation} → ${tour.arrivalLocation}`
      : tour.location || "—";

  const heroImage =
    tour.images?.length > 0 ? getImageUrl(tour.images[0]) : FALLBACK_IMAGE;

  return (
    <Box sx={{ pb: 8, bgcolor: "background.default" }}>
      {/* ── Hero Image ── */}
      <Box
        sx={{
          position: "relative",
          height: { xs: 260, md: 400 },
          overflow: "hidden",
        }}
      >
        <Box
          component="img"
          src={heroImage}
          alt={tour.title}
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
            background: "linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 60%)",
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
            px: { xs: 2, md: 3 },
          }}
        >
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate("/user/tours")}
            sx={{ color: "#fff", mb: 1 }}
          >
            Turlara Dön
          </Button>
          <Typography
            variant="h3"
            fontWeight={800}
            color="#fff"
            sx={{ fontSize: { xs: "1.75rem", md: "2.5rem" } }}
          >
            {tour.title}
          </Typography>
        </Container>
      </Box>

      {/* ── Content ── */}
      <Container maxWidth="lg" sx={{ mt: -4, position: "relative", zIndex: 1 }}>
        <Grid container spacing={3}>
          {/* Left — Info cards */}
          <Grid size={{ xs: 12, md: 8 }}>
            {/* Quick info bar */}
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
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <ArrowRightAltIcon color="secondary" />
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Güzergâh
                      </Typography>
                      <Typography variant="body2" fontWeight={600}>
                        {routeLabel}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid size={{ xs: 6, sm: 4 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <CalendarTodayIcon color="secondary" />
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Tarih
                      </Typography>
                      <Typography variant="body2" fontWeight={600}>
                        {formatDate(tour.startDate || tour.date)}
                        {tour.endDate && ` – ${formatDate(tour.endDate)}`}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                {tour.duration && (
                  <Grid size={{ xs: 6, sm: 4 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <AccessTimeIcon color="secondary" />
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Süre
                        </Typography>
                        <Typography variant="body2" fontWeight={600}>
                          {tour.duration}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                )}
                {tour.companyName && (
                  <Grid size={{ xs: 6, sm: 4 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <BusinessIcon color="secondary" />
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Tur Firması
                        </Typography>
                        <Typography variant="body2" fontWeight={600}>
                          {tour.companyName}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                )}
                {tour.guideName && (
                  <Grid size={{ xs: 6, sm: 4 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <PersonIcon color="secondary" />
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Rehber
                        </Typography>
                        <Typography variant="body2" fontWeight={600}>
                          {tour.guideName}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                )}
              </Grid>
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
              <Typography variant="h6" fontWeight={700} sx={{ mb: 1.5 }}>
                Tur Açıklaması
              </Typography>
              <Typography color="text.secondary" sx={{ whiteSpace: "pre-line" }}>
                {tour.description || "Açıklama bulunamadı."}
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
              {/* Destinations */}
              <Box sx={{ mb: tour.services?.length > 0 || tour.included?.length > 0 ? 3 : 0 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
                  <PlaceIcon color="secondary" />
                  <Typography variant="h6" fontWeight={700}>
                    Gezilecek Yerler
                  </Typography>
                </Box>
                {tour.places?.length > 0 ? (
                  <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                    {tour.places.map((place) => (
                      <Chip key={place} label={place} color="secondary" variant="outlined" />
                    ))}
                  </Stack>
                ) : (
                  <Typography color="text.secondary" variant="body2">
                    Gezilecek yer bilgisi bulunamadı.
                  </Typography>
                )}
              </Box>

              {/* Services */}
              {(tour.services?.length > 0 || tour.included?.length > 0) && (
                <Box>
                  <Divider sx={{ my: 2 }} />
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
                    <MiscellaneousServicesIcon color="secondary" />
                    <Typography variant="h6" fontWeight={700}>
                      Dahil Olanlar
                    </Typography>
                  </Box>
                  <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                    {[...(tour.services || []), ...(tour.included || [])].map((item) => (
                      <Chip key={item} label={item} variant="outlined" />
                    ))}
                  </Stack>
                </Box>
              )}
            </Paper>

            {/* Reviews */}
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 3,
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
                Yorumlar
              </Typography>

              {reviewError && (
                <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
                  {reviewError}
                </Alert>
              )}
              {reviewSuccess && (
                <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }}>
                  {reviewSuccess}
                </Alert>
              )}

              {/* Review form */}
              <Box
                component="form"
                onSubmit={handleSubmitReview}
                sx={{
                  mb: 3,
                  p: 2.5,
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 2,
                  bgcolor: "grey.50",
                }}
              >
                <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>
                  {editingReviewId ? "Yorumunu Güncelle" : "Yorum Ekle"}
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  minRows={3}
                  label="Yorumunuz"
                  value={reviewForm.comment}
                  onChange={(e) =>
                    setReviewForm((prev) => ({ ...prev, comment: e.target.value }))
                  }
                  sx={{ mb: 1.5 }}
                />
                <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
                  <Rating
                    value={reviewForm.rating}
                    precision={1}
                    onChange={(_, nextValue) =>
                      setReviewForm((prev) => ({ ...prev, rating: nextValue || 0 }))
                    }
                  />
                  <Box sx={{ display: "flex", gap: 1 }}>
                    {editingReviewId && (
                      <Button variant="outlined" onClick={cancelEditReview} disabled={reviewLoading}>
                        İptal
                      </Button>
                    )}
                    <Button type="submit" variant="contained" color="secondary" disabled={reviewLoading}>
                      {editingReviewId ? "Güncelle" : "Yorum Yap"}
                    </Button>
                  </Box>
                </Stack>
              </Box>

              <Stack spacing={1.5}>
                {reviews.length === 0 && (
                  <Typography color="text.secondary">Henüz yorum bulunmuyor.</Typography>
                )}

                {reviews.map((review) => {
                  const isOwnReview = user?.id && review.userId === user.id;

                  return (
                    <Paper key={review.id} variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.5 }}>
                        <Typography variant="subtitle2" fontWeight={700}>
                          {review.userName || "Kullanıcı"}
                        </Typography>
                        <Stack direction="row" alignItems="center" spacing={0.5}>
                          <Rating value={review.rating} precision={1} size="small" readOnly />
                          {isOwnReview && (
                            <>
                              <IconButton size="small" onClick={() => startEditReview(review)}>
                                <EditIcon fontSize="small" />
                              </IconButton>
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => handleDeleteReview(review.id)}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </>
                          )}
                        </Stack>
                      </Stack>
                      <Typography variant="body2" color="text.secondary">
                        {review.comment}
                      </Typography>
                    </Paper>
                  );
                })}
              </Stack>
            </Paper>
          </Grid>

          {/* Right — Price sidebar */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 3,
                border: "1px solid",
                borderColor: "divider",
                position: "sticky",
                top: 90,
              }}
            >
              <Typography variant="h4" fontWeight={800} color="secondary.main" gutterBottom>
                ₺{tour.price?.toLocaleString("tr-TR")}
              </Typography>

              <Divider sx={{ my: 2 }} />

              <Stack spacing={1.5}>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="body2" color="text.secondary">
                    Güzergâh
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {routeLabel}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="body2" color="text.secondary">
                    Tarih
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {formatDate(tour.startDate || tour.date)}
                  </Typography>
                </Box>
                {tour.duration && (
                  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography variant="body2" color="text.secondary">
                      Süre
                    </Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {tour.duration}
                    </Typography>
                  </Box>
                )}
                {tour.companyName && (
                  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography variant="body2" color="text.secondary">
                      Tur Firması
                    </Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {tour.companyName}
                    </Typography>
                  </Box>
                )}
                {tour.guideName && (
                  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography variant="body2" color="text.secondary">
                      Rehber
                    </Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {tour.guideName}
                    </Typography>
                  </Box>
                )}
              </Stack>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
