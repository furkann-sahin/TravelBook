import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import "dayjs/locale/tr";

// Material-UI components and icons
import {
  Container,
  Typography,
  Box,
  Paper,
  TextField,
  Button,
  Alert,
  Grid,
  InputAdornment,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

import { useAuth } from "../hooks/useAuth";
import { companyTourApi } from "../services/api";
import {
  IMAGE_UPLOAD_ACCEPT,
  createImagePreviewUrl,
  revokeImagePreviewUrl,
  validateImageFile,
} from "../utils/image-upload";

const initialForm = {
  name: "",
  description: "",
  price: "",
  startDate: "",
  endDate: "",
  totalCapacity: "",
  departureLocation: "",
  arrivalLocation: "",
};

export default function CreateTourPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [form, setForm] = useState(initialForm);
  const [services, setServices] = useState([]);
  const [serviceInput, setServiceInput] = useState("");
  const [destinations, setDestinations] = useState([]);
  const [destinationInput, setDestinationInput] = useState("");
  const [selectedGuideId, setSelectedGuideId] = useState("");
  const [guides, setGuides] = useState([]);
  const [guidesLoading, setGuidesLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch available guides on mount
  useEffect(() => {
    if (!user?.id) return;
    setGuidesLoading(true);
    companyTourApi
      .listGuides(user.id)
      .then((res) => setGuides(res.data || []))
      .catch(() => {})
      .finally(() => setGuidesLoading(false));
  }, [user?.id]);

  useEffect(() => () => {
    revokeImagePreviewUrl(imagePreview);
  }, [imagePreview]);

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validationError = validateImageFile(file);
    if (validationError) {
      setError(validationError);
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    setImageFile(file);
    setImagePreview((prev) => {
      revokeImagePreviewUrl(prev);
      return createImagePreviewUrl(file);
    });
    setError("");
  };

  const removeImage = () => {
    revokeImagePreviewUrl(imagePreview);
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const addService = () => {
    const trimmed = serviceInput.trim();
    if (!trimmed) return;
    if (services.includes(trimmed)) {
      setServiceInput("");
      return;
    }
    setServices((prev) => [...prev, trimmed]);
    setServiceInput("");
  };

  const removeService = (service) => {
    setServices((prev) => prev.filter((s) => s !== service));
  };

  const addDestination = () => {
    const trimmed = destinationInput.trim();
    if (!trimmed) return;
    if (destinations.includes(trimmed)) {
      setDestinationInput("");
      return;
    }
    setDestinations((prev) => [...prev, trimmed]);
    setDestinationInput("");
  };

  const removeDestination = (dest) => {
    setDestinations((prev) => prev.filter((d) => d !== dest));
  };

  // Client-side validation
  const validate = () => {
    if (!form.name.trim()) return "Tur adı zorunludur.";
    if (!form.description.trim()) return "Açıklama zorunludur.";
    if (!form.departureLocation.trim()) return "Kalkış yeri zorunludur.";
    if (!form.arrivalLocation.trim()) return "Varış yeri zorunludur.";

    const price = Number(form.price);
    if (!form.price || isNaN(price) || price < 0) return "Geçerli bir fiyat giriniz.";

    if (!form.startDate) return "Başlangıç tarihi zorunludur.";
    if (!form.endDate) return "Bitiş tarihi zorunludur.";

    if (new Date(form.endDate) <= new Date(form.startDate)) {
      return "Bitiş tarihi başlangıç tarihinden sonra olmalıdır.";
    }

    const capacity = Number(form.totalCapacity);
    if (!form.totalCapacity || !Number.isInteger(capacity) || capacity < 1) {
      return "Kapasite en az 1 olmalıdır.";
    }

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    try {
      await companyTourApi.createTour(user.id, {
        name: form.name.trim(),
        description: form.description.trim(),
        location: `${form.departureLocation.trim()} → ${form.arrivalLocation.trim()}`,
        price: Number(form.price),
        startDate: form.startDate,
        endDate: form.endDate,
        totalCapacity: Number(form.totalCapacity),
        departureLocation: form.departureLocation.trim(),
        arrivalLocation: form.arrivalLocation.trim(),
        services,
        places: destinations,
        guideId: selectedGuideId || undefined,
        imageFile,
      });
      navigate("/company/tours");
    } catch (err) {
      setError(err.message || "Tur oluşturulurken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "80vh", py: 6 }}>
      <Container maxWidth="md">
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
          <Typography
            variant="h4"
            fontWeight={800}
            sx={{ display: "flex", alignItems: "center", gap: 1 }}
          >
            <AddCircleOutlineIcon color="secondary" />
            Yeni Tur Oluştur
          </Typography>
          <Button
            onClick={() => navigate("/company/tours")}
            startIcon={<ArrowBackIcon />}
            variant="outlined"
            color="primary"
          >
            Turlarıma Dön
          </Button>
        </Box>

        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, sm: 4 },
            borderRadius: 4,
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}
          >
            <TextField
              label="Tur Adı"
              required
              fullWidth
              value={form.name}
              onChange={(e) => updateField("name", e.target.value)}
              placeholder="Örn: Kapadokya Balon Turu"
            />

            <TextField
              label="Açıklama"
              required
              fullWidth
              multiline
              minRows={3}
              value={form.description}
              onChange={(e) => updateField("description", e.target.value)}
              placeholder="Tur hakkında detaylı açıklama yazın…"
            />

            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Kalkış Yeri"
                  required
                  fullWidth
                  value={form.departureLocation}
                  onChange={(e) => updateField("departureLocation", e.target.value)}
                  placeholder="Örn: İstanbul"
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Varış Yeri"
                  required
                  fullWidth
                  value={form.arrivalLocation}
                  onChange={(e) => updateField("arrivalLocation", e.target.value)}
                  placeholder="Örn: Nevşehir"
                />
              </Grid>
            </Grid>

            {/* Destinations (Places to Visit) */}
            <Box>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                Gezilecek Yerler (isteğe bağlı)
              </Typography>
              <Box sx={{ display: "flex", gap: 1, mb: 1 }}>
                <TextField
                  size="small"
                  fullWidth
                  value={destinationInput}
                  onChange={(e) => setDestinationInput(e.target.value)}
                  placeholder="Örn: Eyfel Kulesi"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addDestination();
                    }
                  }}
                />
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={addDestination}
                  sx={{ minWidth: 44, px: 1 }}
                >
                  <AddIcon />
                </Button>
              </Box>
              {destinations.length > 0 && (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  {destinations.map((dest) => (
                    <Chip
                      key={dest}
                      label={dest}
                      color="secondary"
                      onDelete={() => removeDestination(dest)}
                    />
                  ))}
                </Box>
              )}
            </Box>

            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Fiyat"
                  required
                  fullWidth
                  type="number"
                  value={form.price}
                  onChange={(e) => updateField("price", e.target.value)}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">₺</InputAdornment>
                      ),
                    },
                    htmlInput: { min: 0, step: "0.01" },
                  }}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Kapasite"
                  required
                  fullWidth
                  type="number"
                  value={form.totalCapacity}
                  onChange={(e) => updateField("totalCapacity", e.target.value)}
                  placeholder="Örn: 40"
                  slotProps={{
                    htmlInput: { min: 1, step: 1 },
                  }}
                />
              </Grid>
            </Grid>

            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="tr">
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <DatePicker
                    label="Başlangıç Tarihi"
                    format="DD MMMM YYYY"
                    minDate={dayjs().startOf("day")}
                    value={form.startDate ? dayjs(form.startDate) : null}
                    onChange={(value) =>
                      updateField(
                        "startDate",
                        value && value.isValid() ? value.format("YYYY-MM-DD") : "",
                      )
                    }
                    slotProps={{
                      textField: {
                        required: true,
                        fullWidth: true,
                        inputProps: { readOnly: true },
                      },
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <DatePicker
                    label="Bitiş Tarihi"
                    format="DD MMMM YYYY"
                    minDate={form.startDate ? dayjs(form.startDate) : dayjs().startOf("day")}
                    value={form.endDate ? dayjs(form.endDate) : null}
                    onChange={(value) =>
                      updateField(
                        "endDate",
                        value && value.isValid() ? value.format("YYYY-MM-DD") : "",
                      )
                    }
                    slotProps={{
                      textField: {
                        required: true,
                        fullWidth: true,
                        inputProps: { readOnly: true },
                      },
                    }}
                  />
                </Grid>
              </Grid>
            </LocalizationProvider>

            {/* Image Upload */}
            <Box>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                Tur Görseli (isteğe bağlı)
              </Typography>
              <input
                ref={fileInputRef}
                type="file"
                accept={IMAGE_UPLOAD_ACCEPT}
                hidden
                onChange={handleImageChange}
              />
              {imagePreview ? (
                <Box sx={{ position: "relative", display: "inline-block" }}>
                  <Box
                    component="img"
                    src={imagePreview}
                    alt="Önizleme"
                    sx={{
                      width: "100%",
                      maxHeight: 220,
                      objectFit: "cover",
                      borderRadius: 3,
                      border: "1px solid",
                      borderColor: "divider",
                    }}
                  />
                  <Button
                    size="small"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={removeImage}
                    sx={{ mt: 1 }}
                  >
                    Görseli Kaldır
                  </Button>
                </Box>
              ) : (
                <Button
                  variant="outlined"
                  startIcon={<CloudUploadIcon />}
                  onClick={() => fileInputRef.current?.click()}
                  sx={{ textTransform: "none" }}
                >
                  Görsel Yükle
                </Button>
              )}
              <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5 }}>
                JPEG, PNG, WebP veya GIF — Maks. 5 MB
              </Typography>
            </Box>

            {/* Services – Manual Input */}
            <Box>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                Dahil Hizmetler (isteğe bağlı)
              </Typography>
              <Box sx={{ display: "flex", gap: 1, mb: 1 }}>
                <TextField
                  size="small"
                  fullWidth
                  value={serviceInput}
                  onChange={(e) => setServiceInput(e.target.value)}
                  placeholder="Örn: Kahvaltı"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addService();
                    }
                  }}
                />
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={addService}
                  sx={{ minWidth: 44, px: 1 }}
                >
                  <AddIcon />
                </Button>
              </Box>
              {services.length > 0 && (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  {services.map((service) => (
                    <Chip
                      key={service}
                      label={service}
                      color="secondary"
                      onDelete={() => removeService(service)}
                    />
                  ))}
                </Box>
              )}
            </Box>

            {/* Guide Selection */}
            <FormControl fullWidth>
              <InputLabel id="guide-select-label">Rehber Ata (isteğe bağlı)</InputLabel>
              <Select
                labelId="guide-select-label"
                value={selectedGuideId}
                label="Rehber Ata (isteğe bağlı)"
                onChange={(e) => setSelectedGuideId(e.target.value)}
                disabled={guidesLoading}
                startAdornment={
                  guidesLoading ? (
                    <InputAdornment position="start">
                      <CircularProgress size={20} />
                    </InputAdornment>
                  ) : null
                }
              >
                <MenuItem value="">
                  <em>Rehber seçilmedi</em>
                </MenuItem>
                {guides.map((guide) => (
                  <MenuItem key={guide.id} value={guide.id}>
                    {guide.firstName} {guide.lastName}
                    {guide.rating > 0 ? ` — ★ ${guide.rating}` : ""}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Button
              type="submit"
              variant="contained"
              color="secondary"
              size="large"
              fullWidth
              disabled={loading}
              sx={{ py: 1.5, mt: 1, fontSize: "1rem" }}
            >
              {loading ? "Oluşturuluyor…" : "Tur Oluştur"}
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
