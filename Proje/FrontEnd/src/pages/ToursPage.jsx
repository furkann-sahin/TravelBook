import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Chip,
  InputAdornment,
  CircularProgress,
  Alert,
  Paper,
  IconButton,
  Collapse,
  Rating,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import FilterListIcon from "@mui/icons-material/FilterList";
import ClearIcon from "@mui/icons-material/Clear";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import { tourApi } from "../services/api";

export default function ToursPage() {
  const navigate = useNavigate();
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filtersOpen, setFiltersOpen] = useState(true);
  const [hasSearched, setHasSearched] = useState(false);

  // Filter state
  const [filters, setFilters] = useState({
    title: "",
    location: "",
    minPrice: "",
    maxPrice: "",
    date: "",
  });
  const [appliedFilters, setAppliedFilters] = useState({});

  const fetchTours = useCallback(async (queryFilters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const res = await tourApi.getTours(queryFilters);
      setTours(res.data || []);
    } catch (err) {
      setError(err.message || "Turlar yüklenirken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleFilterChange = (field) => (e) => {
    setFilters((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setError(null);

    const activeFilters = {};
    if (filters.title.trim()) activeFilters.title = filters.title.trim();
    if (filters.location.trim()) activeFilters.location = filters.location.trim();
    if (filters.minPrice) activeFilters.minPrice = filters.minPrice;
    if (filters.maxPrice) activeFilters.maxPrice = filters.maxPrice;
    if (filters.date) activeFilters.date = filters.date;

    setAppliedFilters(activeFilters);
    setHasSearched(true);
    fetchTours(activeFilters);
  };

  const handleClear = () => {
    setFilters({ title: "", location: "", minPrice: "", maxPrice: "", date: "" });
    setAppliedFilters({});
    setTours([]);
    setHasSearched(false);
    setError(null);
    setLoading(false);
  };

  const hasActiveFilters = Object.keys(appliedFilters).length > 0;

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("tr-TR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <Box sx={{ pt: 4, pb: 8, minHeight: "80vh" }}>
      <Container maxWidth="lg">
        {/* Page Header */}
        <Box sx={{ mb: 4, textAlign: "center" }}>
          <Typography variant="h3" fontWeight={800} gutterBottom>
            Turları Keşfet
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, mx: "auto" }}>
            Hayalinizdeki tatili bulun. Lokasyon, fiyat aralığı veya tarih ile arama yapın.
          </Typography>
        </Box>

        {/* Filter Section */}
        <Paper
          elevation={0}
          sx={{
            mb: 4,
            p: 3,
            borderRadius: 3,
            border: "1px solid",
            borderColor: "divider",
            bgcolor: "background.paper",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: filtersOpen ? 2 : 0 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <FilterListIcon color="secondary" />
              <Typography variant="h6" fontWeight={600}>
                Filtrele
              </Typography>
              {hasActiveFilters && (
                <Chip
                  label={`${Object.keys(appliedFilters).length} filtre aktif`}
                  size="small"
                  color="secondary"
                  sx={{ ml: 1 }}
                />
              )}
            </Box>
            <IconButton size="small" onClick={() => setFiltersOpen(!filtersOpen)}>
              <FilterListIcon sx={{ transform: filtersOpen ? "rotate(180deg)" : "none", transition: "0.3s" }} />
            </IconButton>
          </Box>

          <Collapse in={filtersOpen}>
            <Box component="form" onSubmit={handleSearch}>
              <Grid container spacing={2} alignItems="flex-end">
                {/* Title */}
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <TextField
                    fullWidth
                    label="Tur Adı"
                    placeholder="Ör: Kapadokya"
                    value={filters.title}
                    onChange={handleFilterChange("title")}
                    size="small"
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <SearchIcon fontSize="small" color="action" />
                          </InputAdornment>
                        ),
                      },
                    }}
                  />
                </Grid>

                {/* Location */}
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <TextField
                    fullWidth
                    label="Lokasyon"
                    placeholder="Ör: İstanbul"
                    value={filters.location}
                    onChange={handleFilterChange("location")}
                    size="small"
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <LocationOnIcon fontSize="small" color="action" />
                          </InputAdornment>
                        ),
                      },
                    }}
                  />
                </Grid>

                {/* Min Price */}
                <Grid size={{ xs: 6, sm: 3, md: 2 }}>
                  <TextField
                    fullWidth
                    label="Min Fiyat"
                    placeholder="₺0"
                    type="number"
                    value={filters.minPrice}
                    onChange={handleFilterChange("minPrice")}
                    size="small"
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <AttachMoneyIcon fontSize="small" color="action" />
                          </InputAdornment>
                        ),
                        inputProps: { min: 0 },
                      },
                    }}
                  />
                </Grid>

                {/* Max Price */}
                <Grid size={{ xs: 6, sm: 3, md: 2 }}>
                  <TextField
                    fullWidth
                    label="Max Fiyat"
                    placeholder="₺10000"
                    type="number"
                    value={filters.maxPrice}
                    onChange={handleFilterChange("maxPrice")}
                    size="small"
                    slotProps={{
                      input: {
                        inputProps: { min: 0 },
                      },
                    }}
                  />
                </Grid>

                {/* Date */}
                <Grid size={{ xs: 12, sm: 6, md: 2 }}>
                  <TextField
                    fullWidth
                    label="Tarih"
                    type="date"
                    value={filters.date}
                    onChange={handleFilterChange("date")}
                    size="small"
                    slotProps={{
                      inputLabel: { shrink: true },
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <CalendarTodayIcon fontSize="small" color="action" />
                          </InputAdornment>
                        ),
                      },
                    }}
                  />
                </Grid>

                {/* Buttons */}
                <Grid size={{ xs: 12, md: 2 }}>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <Button
                      type="submit"
                      variant="contained"
                      color="secondary"
                      fullWidth
                      startIcon={<SearchIcon />}
                      sx={{ borderRadius: 2, py: 0.9 }}
                    >
                      Ara
                    </Button>
                    {hasActiveFilters && (
                      <IconButton
                        onClick={handleClear}
                        color="error"
                        size="small"
                        sx={{ border: "1px solid", borderColor: "error.light", borderRadius: 2 }}
                      >
                        <ClearIcon />
                      </IconButton>
                    )}
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Collapse>
        </Paper>

        {/* Results Info */}
        {!loading && !error && hasSearched && (
          <Box sx={{ mb: 3, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Typography variant="body2" color="text.secondary">
              {tours.length > 0
                ? `${tours.length} tur bulundu`
                : "Sonuç bulunamadı"}
            </Typography>
            {hasActiveFilters && (
              <Button size="small" onClick={handleClear} startIcon={<ClearIcon />}>
                Filtreleri Temizle
              </Button>
            )}
          </Box>
        )}

        {/* Loading */}
        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
            <CircularProgress color="secondary" />
          </Box>
        )}

        {!loading && !hasSearched && !error && (
          <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
            Filtre eklemeden de Ara butonuna basarak tüm turları görüntüleyebilirsiniz.
          </Alert>
        )}

        {/* Error */}
        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        {/* Tour Cards */}
        {!loading && !error && hasSearched && (
          <Grid container spacing={3}>
            {tours.map((tour) => (
              <Grid
                size={{ xs: 12, sm: 6, md: 4 }}
                key={tour.id || `${tour.name}-${tour.startDate}`}
              >
                <Card
                  elevation={0}
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    borderRadius: 3,
                    border: "1px solid",
                    borderColor: "divider",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: "0 12px 24px rgba(0,0,0,0.1)",
                    },
                  }}
                >
                  <CardMedia
                    component="img"
                    height="200"
                    image={tour.imageUrl || "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600"}
                    alt={tour.name}
                    sx={{ objectFit: "cover" }}
                  />
                  <CardContent sx={{ flexGrow: 1, p: 2.5 }}>
                    <Typography variant="h6" fontWeight={700} gutterBottom noWrap>
                      {tour.name}
                    </Typography>

                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 1 }}>
                      <LocationOnIcon sx={{ fontSize: 18, color: "secondary.main" }} />
                      <Typography variant="body2" color="text.secondary">
                        {tour.location}
                      </Typography>
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 1.5 }}>
                      <CalendarTodayIcon sx={{ fontSize: 16, color: "text.disabled" }} />
                      <Typography variant="body2" color="text.secondary">
                        {formatDate(tour.startDate)} – {formatDate(tour.endDate)}
                      </Typography>
                    </Box>

                    {tour.rating > 0 && (
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 1.5 }}>
                        <Rating value={tour.rating} precision={0.5} size="small" readOnly />
                        <Typography variant="body2" color="text.secondary">
                          ({tour.rating})
                        </Typography>
                      </Box>
                    )}

                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mt: "auto" }}>
                      <Typography variant="h5" fontWeight={800} color="secondary.main">
                        ₺{tour.price?.toLocaleString("tr-TR")}
                      </Typography>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        {tour.companyName && (
                          <Chip label={tour.companyName} size="small" variant="outlined" />
                        )}
                        <Button
                          size="small"
                          variant="outlined"
                          color="secondary"
                          onClick={() => navigate(`/tours/${tour.id}`)}
                          disabled={!tour.id}
                        >
                          Detay
                        </Button>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}

            {/* Empty State */}
            {tours.length === 0 && (
              <Grid size={12}>
                <Box sx={{ textAlign: "center", py: 8 }}>
                  <SearchIcon sx={{ fontSize: 64, color: "text.disabled", mb: 2 }} />
                  <Typography variant="h5" fontWeight={600} gutterBottom>
                    Tur bulunamadı
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                    Filtrelerinizi değiştirerek tekrar deneyin.
                  </Typography>
                  {hasActiveFilters && (
                    <Button variant="outlined" color="secondary" onClick={handleClear} startIcon={<ClearIcon />}>
                      Tüm Filtreleri Temizle
                    </Button>
                  )}
                </Box>
              </Grid>
            )}
          </Grid>
        )}
      </Container>
    </Box>
  );
}
