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

import BrandLogo from "../components/BrandLogo";
import { useAuth } from "../hooks/useAuth";
import { getErrorMessage } from "../utils/getErrorMessage";
import { getDefaultRouteForRole } from "../utils/authRoutes";

// Define user roles for login
const roles = [
  { key: "user", label: "Kullanıcı", icon: <PersonIcon /> },
  { key: "company", label: "Firma", icon: <BusinessIcon /> },
  { key: "guide", label: "Rehber", icon: <CardTravelIcon /> },
];

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [roleIdx, setRoleIdx] = useState(0);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const selectedRole = roles[roleIdx].key;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(selectedRole, email, password);
      navigate(getDefaultRouteForRole(selectedRole));
    } catch (err) {
      setError(getErrorMessage(err, "Giriş başarısız. Lütfen bilgilerinizi kontrol edin."));
    } finally {
      setLoading(false);
    }
  };

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
          {/* Logo */}
          <BrandLogo
            to="/"
            iconSize={36}
            textVariant="h4"
            textColor="primary.main"
            sx={{ justifyContent: "center", mb: 1 }}
          />

          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Lütfen rolünüzü seçin ve giriş bilgilerinizi girin.
          </Typography>

          {/* Role Tabs */}
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
            <TextField
              label="E-posta"
              type="email"
              required
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
            <TextField
              label="Şifre"
              type={showPassword ? "text" : "password"}
              required
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
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

            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              fullWidth
              disabled={loading}
              sx={{ py: 1.5, mt: 1, fontSize: "1rem" }}
            >
              {loading ? "Giriş Yapılıyor…" : "Giriş Yap"}
            </Button>
          </Box>

          <Typography variant="body2" sx={{ mt: 3, color: "text.secondary" }}>
            Hesabınız yok mu?{" "}
            <Link component={RouterLink} to="/register" fontWeight={600}>
              Hesap Oluştur
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
