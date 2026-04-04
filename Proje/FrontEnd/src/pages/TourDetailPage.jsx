import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Divider,
  Paper,
  Stack,
  TextField,
  Typography,
  Alert,
  Rating,
  IconButton,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { tourApi, reviewApi } from "../services/api";
import { useAuth } from "../hooks/useAuth";

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

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("tr-TR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

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
        const res = await tourApi.createReview(tourId, {
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

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 8, display: "flex", justifyContent: "center" }}>
        <CircularProgress color="secondary" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 6 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate("/tours")}>
          Turlara Dön
        </Button>
      </Container>
    );
  }

  if (!tour) return null;

  return (
    <Box sx={{ py: 5 }}>
      <Container maxWidth="md">
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/tours")}
          sx={{ mb: 2 }}
        >
          Turlara Dön
        </Button>

        <Paper
          elevation={0}
          sx={{
            overflow: "hidden",
            borderRadius: 3,
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <Box
            component="img"
            src={
              tour.images?.[0] ||
              "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1200"
            }
            alt={tour.title}
            sx={{ width: "100%", height: { xs: 220, md: 340 }, objectFit: "cover" }}
          />

          <Box sx={{ p: { xs: 2.5, md: 4 } }}>
            <Typography variant="h4" fontWeight={800} gutterBottom>
              {tour.title}
            </Typography>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={1} sx={{ mb: 2 }}>
              <Chip icon={<LocationOnIcon />} label={tour.location || "-"} variant="outlined" />
              <Chip icon={<CalendarTodayIcon />} label={formatDate(tour.date)} variant="outlined" />
              <Chip icon={<AccessTimeIcon />} label={tour.duration || "-"} variant="outlined" />
            </Stack>

            <Typography variant="h5" color="secondary.main" fontWeight={800} sx={{ mb: 2 }}>
              ₺{tour.price?.toLocaleString("tr-TR")}
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Typography variant="h6" fontWeight={700} sx={{ mb: 1 }}>
              Tur Açıklaması
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 3 }}>
              {tour.description || "Açıklama bulunamadı."}
            </Typography>

            <Typography variant="h6" fontWeight={700} sx={{ mb: 1 }}>
              Dahil Olanlar
            </Typography>
            {tour.included?.length ? (
              <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap" sx={{ mb: 3 }}>
                {tour.included.map((item) => (
                  <Chip key={item} label={item} color="secondary" variant="outlined" />
                ))}
              </Stack>
            ) : (
              <Typography color="text.secondary" sx={{ mb: 3 }}>
                Dahil olan bilgiler bulunamadı.
              </Typography>
            )}

            <Typography variant="h6" fontWeight={700} sx={{ mb: 1 }}>
              Gezilecek Yerler
            </Typography>
            {tour.places?.length ? (
              <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap" sx={{ mb: 1 }}>
                {tour.places.map((place) => (
                  <Chip key={place} label={place} />
                ))}
              </Stack>
            ) : (
              <Typography color="text.secondary">Gezilecek yer bilgisi bulunamadı.</Typography>
            )}

            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" fontWeight={700} sx={{ mb: 1.5 }}>
              Yorumlar
            </Typography>

            {reviewError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {reviewError}
              </Alert>
            )}

            {reviewSuccess && (
              <Alert severity="success" sx={{ mb: 2 }}>
                {reviewSuccess}
              </Alert>
            )}

            <Box
              component="form"
              onSubmit={handleSubmitReview}
              sx={{ mb: 3, p: 2, border: "1px solid", borderColor: "divider", borderRadius: 2 }}
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
                  <Paper key={review.id} variant="outlined" sx={{ p: 2 }}>
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
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
