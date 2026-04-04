import { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";

// Material-UI components and icons
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Tabs,
  Tab,
  Alert,
  InputAdornment,
  IconButton,
  Link,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import BusinessIcon from "@mui/icons-material/Business";
import CardTravelIcon from "@mui/icons-material/CardTravel";
import PersonIcon from "@mui/icons-material/Person";
import DirectionsBusIcon from "@mui/icons-material/DirectionsBus";

import { useAuth } from "../hooks/useAuth";

// Define user roles for registration
const roles = [
  { key: "user", label: "Kullanıcı", icon: <PersonIcon /> },
  { key: "company", label: "Firma", icon: <BusinessIcon /> },
  { key: "guide", label: "Rehber", icon: <CardTravelIcon /> },
];

const defaultForm = {
  user: {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
  },
  company: {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    address: "",
    description: "",
  },
  guide: {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    biography: "",
    languages: "",
    expertRoutes: "",
  },
};

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [roleIdx, setRoleIdx] = useState(0);
  const [forms, setForms] = useState(defaultForm);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const selectedRole = roles[roleIdx].key;
  const form = forms[selectedRole];

  const updateField = (field, value) => {
    setForms((prev) => ({
      ...prev,
      [selectedRole]: { ...prev[selectedRole], [field]: value },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Şifreler eşleşmiyor.");
      return;
    }
    if (form.password.length < 6) {
      setError("Şifre en az 6 karakter olmalıdır.");
      return;
    }

    setLoading(true);
    try {
      const { confirmPassword, ...data } = form;

      // Convert comma-separated strings to arrays for guide role
      if (selectedRole === "guide") {
        data.languages = data.languages
          ? data.languages
              .split(",")
              .map((l) => l.trim())
              .filter(Boolean)
          : [];
        data.expertRoutes = data.expertRoutes
          ? data.expertRoutes
              .split(",")
              .map((r) => r.trim())
              .filter(Boolean)
          : [];
      }

      await register(selectedRole, data);
      navigate(
        selectedRole === "user"
          ? "/user"
          : selectedRole === "company"
            ? "/company"
              ? selectedRole === "guide"
                ? "/guide"
                : "/"
              : "/"
            : "/",
      );
    } catch (err) {
      setError(err.message || "Kayıt başarısız oldu.");
    } finally {
      setLoading(false);
    }
  };

  const passwordFields = (
    <>
      <TextField
        label="Şifre"
        type={showPassword ? "text" : "password"}
        required
        fullWidth
        value={form.password}
        onChange={(e) => updateField("password", e.target.value)}
        autoComplete="new-password"
        slotProps={{
          input: {
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                  size="small"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
      />
      <TextField
        label="Şifreyi Onayla"
        type={showPassword ? "text" : "password"}
        required
        fullWidth
        value={form.confirmPassword}
        onChange={(e) => updateField("confirmPassword", e.target.value)}
        autoComplete="new-password"
      />
    </>
  );

  const renderUserForm = () => (
    <>
      <TextField
        label="Ad Soyad"
        required
        fullWidth
        value={form.name}
        onChange={(e) => updateField("name", e.target.value)}
      />
      <TextField
        label="E-posta Adresi"
        type="email"
        required
        fullWidth
        value={form.email}
        onChange={(e) => updateField("email", e.target.value)}
        autoComplete="email"
      />
      {passwordFields}
      <TextField
        label="Telefon"
        type="tel"
        required
        fullWidth
        value={form.phone}
        onChange={(e) => updateField("phone", e.target.value)}
        placeholder="+90 555 123 4567"
      />
    </>
  );

  const renderCompanyForm = () => (
    <>
      <TextField
        label="Firma Adı"
        required
        fullWidth
        value={form.name}
        onChange={(e) => updateField("name", e.target.value)}
      />
      <TextField
        label="E-posta Adresi"
        type="email"
        required
        fullWidth
        value={form.email}
        onChange={(e) => updateField("email", e.target.value)}
        autoComplete="email"
      />
      {passwordFields}
      <TextField
        label="Telefon"
        type="tel"
        required
        fullWidth
        value={form.phone}
        onChange={(e) => updateField("phone", e.target.value)}
        placeholder="+90 555 123 4567"
      />
      <TextField
        label="Adres"
        required
        fullWidth
        value={form.address}
        onChange={(e) => updateField("address", e.target.value)}
      />
      <TextField
        label="Açıklama"
        required
        fullWidth
        multiline
        minRows={3}
        value={form.description}
        onChange={(e) => updateField("description", e.target.value)}
        placeholder="Firmanız hakkında bilgi verin…"
      />
    </>
  );

  const renderGuideForm = () => (
    <>
      <TextField
        label="Ad"
        required
        fullWidth
        value={form.firstName}
        onChange={(e) => updateField("firstName", e.target.value)}
      />
      <TextField
        label="Soyad"
        required
        fullWidth
        value={form.lastName}
        onChange={(e) => updateField("lastName", e.target.value)}
      />
      <TextField
        label="E-posta Adresi"
        type="email"
        required
        fullWidth
        value={form.email}
        onChange={(e) => updateField("email", e.target.value)}
        autoComplete="email"
      />
      {passwordFields}
      <TextField
        label="Telefon"
        type="tel"
        fullWidth
        value={form.phone}
        onChange={(e) => updateField("phone", e.target.value)}
        placeholder="+90 555 123 4567"
      />
      <TextField
        label="Biyografi"
        fullWidth
        multiline
        minRows={3}
        value={form.biography}
        onChange={(e) => updateField("biography", e.target.value)}
        placeholder="Kendiniz hakkında bilgi verin…"
      />
      <TextField
        label="Diller"
        fullWidth
        value={form.languages}
        onChange={(e) => updateField("languages", e.target.value)}
        placeholder="Türkçe, İngilizce, Almanca"
        helperText="Virgülle ayırarak yazın"
      />
      <TextField
        label="Uzman Rotalar"
        fullWidth
        value={form.expertRoutes}
        onChange={(e) => updateField("expertRoutes", e.target.value)}
        placeholder="Kapadokya, Efes, Pamukkale"
        helperText="Virgülle ayırarak yazın"
      />
    </>
  );

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          "linear-gradient(135deg, #2D3436 0%, #636e72 50%, #2D3436 100%)",
        py: 4,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={8}
          sx={{
            p: { xs: 3, sm: 5 },
            borderRadius: 4,
            textAlign: "center",
          }}
        >
          <Box
            component={RouterLink}
            to="/"
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 1,
              mb: 1,
              textDecoration: "none",
            }}
          >
            <DirectionsBusIcon sx={{ fontSize: 36, color: "primary.main" }} />
            <Typography variant="h4" fontWeight={800} color="primary">
              TravelBook
            </Typography>
          </Box>

          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Hesap oluştur
          </Typography>

          <Tabs
            value={roleIdx}
            onChange={(_, v) => {
              setRoleIdx(v);
              setError("");
            }}
            variant="fullWidth"
            sx={{
              mb: 4,
              bgcolor: "grey.50",
              borderRadius: 2,
              "& .MuiTab-root": {
                minHeight: 52,
                textTransform: "none",
                fontWeight: 600,
              },
              "& .Mui-selected": { color: "primary.main" },
            }}
          >
            {roles.map((r) => (
              <Tab
                key={r.key}
                icon={r.icon}
                label={r.label}
                iconPosition="start"
              />
            ))}
          </Tabs>

          {error && (
            <Alert severity="error" sx={{ mb: 3, textAlign: "left" }}>
              {error}
            </Alert>
          )}

          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}
          >
            {selectedRole === "user" && renderUserForm()}
            {selectedRole === "company" && renderCompanyForm()}
            {selectedRole === "guide" && renderGuideForm()}

            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              fullWidth
              disabled={loading}
              sx={{ py: 1.5, mt: 1, fontSize: "1rem" }}
            >
              {loading ? "Hesap oluşturuluyor…" : "Hesap oluştur"}
            </Button>
          </Box>

          <Typography variant="body2" sx={{ mt: 3, color: "text.secondary" }}>
            Zaten bir hesabınız var mı?{" "}
            <Link component={RouterLink} to="/login" fontWeight={600}>
              Giriş yap
            </Link>
          </Typography>

          <Link
            component={RouterLink}
            to="/"
            variant="body2"
            sx={{ mt: 2, display: "inline-block", color: "text.secondary" }}
          >
            ← Ana Sayfaya Dön
          </Link>
        </Paper>
      </Container>
    </Box>
  );
}
