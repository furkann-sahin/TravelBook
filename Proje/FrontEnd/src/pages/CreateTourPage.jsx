import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

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
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

import { useAuth } from "../hooks/useAuth";
import { companyTourApi } from "../services/api";

const initialForm = {
  name: "",
  description: "",
  location: "",
  price: "",
  startDate: "",
  endDate: "",
  totalCapacity: "",
};

export default function CreateTourPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [form, setForm] = useState(initialForm);
  const [services, setServices] = useState([]);
  const [serviceInput, setServiceInput] = useState("");
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

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type
    const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowed.includes(file.type)) {
      setError("Yalnızca JPEG, PNG, WebP ve GIF formatları desteklenir.");
      return;
    }
    // Validate size (5 MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Dosya boyutu en fazla 5 MB olmalıdır.");
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setError("");
  };

  const removeImage = () => {
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

  // Client-side validation
  const validate = () => {
    if (!form.name.trim()) return "Tur adı zorunludur.";
    if (!form.description.trim()) return "Açıklama zorunludur.";
    if (!form.location.trim()) return "Konum zorunludur.";

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
      const formData = new FormData();
      formData.append("name", form.name.trim());
      formData.append("description", form.description.trim());
      formData.append("location", form.location.trim());
      formData.append("price", Number(form.price));
      formData.append("startDate", form.startDate);
      formData.append("endDate", form.endDate);
      formData.append("totalCapacity", Number(form.totalCapacity));
      if (imageFile) {
        formData.append("image", imageFile);
      }
      if (services.length > 0) {
        formData.append("services", JSON.stringify(services));
      }
      if (selectedGuideId) {
        formData.append("guideId", selectedGuideId);
      }

      await companyTourApi.createTour(user.id, formData);
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

            <TextField
              label="Konum"
              required
              fullWidth
              value={form.location}
              onChange={(e) => updateField("location", e.target.value)}
              placeholder="Örn: Nevşehir, Kapadokya"
            />

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

            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Başlangıç Tarihi"
                  required
                  fullWidth
                  type="date"
                  value={form.startDate}
                  onChange={(e) => updateField("startDate", e.target.value)}
                  slotProps={{ inputLabel: { shrink: true } }}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Bitiş Tarihi"
                  required
                  fullWidth
                  type="date"
                  value={form.endDate}
                  onChange={(e) => updateField("endDate", e.target.value)}
                  slotProps={{ inputLabel: { shrink: true } }}
                />
              </Grid>
            </Grid>

            {/* Image Upload */}
            <Box>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                Tur Görseli (isteğe bağlı)
              </Typography>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
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
