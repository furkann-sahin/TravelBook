import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  Avatar,
  Divider,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";

import { useAuth } from "../hooks/useAuth";
import { userApi } from "../services/api";
import { getErrorMessage } from "../utils/getErrorMessage";

export default function UserProfilePage() {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "" });
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "user") {
      navigate("/login");
      return;
    }

    userApi
      .getProfile(user.id)
      .then((res) => {
        setProfile(res.data);
        setForm({ name: res.data.name, phone: res.data.phone || "" });
      })
      .catch((err) => setError(getErrorMessage(err, "Profil bilgileri yüklenemedi.")));
  }, [isAuthenticated, user, navigate]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const res = await userApi.updateProfile(user.id, form);
      setProfile(res.data);
      setSuccess("Profil başarıyla güncellendi.");
      setEditing(false);
    } catch (err) {
      setError(err.message || "Güncelleme başarısız oldu.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Hesabınızı silmek istediğinizden emin misiniz?")) return;
    try {
      await userApi.deleteAccount(user.id);
      logout();
      navigate("/");
    } catch (err) {
      setError(err.message || "Hesap silinemedi.");
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (
      !passwordForm.oldPassword ||
      !passwordForm.newPassword ||
      !passwordForm.confirmPassword
    ) {
      setError("Lütfen tüm şifre alanlarını doldurun.");
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError("Yeni şifreler eşleşmiyor.");
      return;
    }

    setPasswordLoading(true);
    try {
      const res = await userApi.updatePassword(user.id, {
        oldPassword: passwordForm.oldPassword,
        newPassword: passwordForm.newPassword,
      });
      setSuccess(res?.message || "Şifre başarıyla güncellendi.");
      setPasswordForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      setError(err.message || "Şifre güncellenemedi.");
    } finally {
      setPasswordLoading(false);
    }
  };

  if (!profile) {
    return (
      <Container maxWidth="sm" sx={{ py: 6 }}>
        <Typography>Yükleniyor…</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ py: 6 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
          <Avatar sx={{ width: 56, height: 56, bgcolor: "primary.main" }}>
            <PersonIcon sx={{ fontSize: 32 }} />
          </Avatar>
          <Box>
            <Typography variant="h5" fontWeight={700}>
              {profile.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {profile.email}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        {editing ? (
          <Box
            component="form"
            onSubmit={handleUpdate}
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          >
            <TextField
              label="Ad Soyad"
              required
              fullWidth
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <TextField
              label="Telefon"
              fullWidth
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
            <Box sx={{ display: "flex", gap: 2 }}>
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
              >
                {loading ? "Kaydediliyor…" : "Kaydet"}
              </Button>
              <Button
                variant="outlined"
                onClick={() => {
                  setEditing(false);
                  setForm({ name: profile.name, phone: profile.phone || "" });
                }}
              >
                İptal
              </Button>
            </Box>
          </Box>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Typography>
              <strong>Ad Soyad:</strong> {profile.name}
            </Typography>
            <Typography>
              <strong>E-posta:</strong> {profile.email}
            </Typography>
            <Typography>
              <strong>Telefon:</strong> {profile.phone || "—"}
            </Typography>
            <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
              <Button variant="contained" onClick={() => setEditing(true)}>
                Profili Düzenle
              </Button>
              <Button
                variant="outlined"
                onClick={() => navigate(`/users/${user.id}/purchases`)}
              >
                Seyahatlerim
              </Button>
              <Button variant="outlined" color="error" onClick={handleDelete}>
                Hesabı Sil
              </Button>
            </Box>
          </Box>
        )}

        <Divider sx={{ my: 3 }} />

        <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
          Şifre Güncelle
        </Typography>
        <Box
          component="form"
          onSubmit={handlePasswordUpdate}
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <TextField
            label="Mevcut Şifre"
            type="password"
            fullWidth
            value={passwordForm.oldPassword}
            onChange={(e) =>
              setPasswordForm({ ...passwordForm, oldPassword: e.target.value })
            }
            autoComplete="current-password"
          />
          <TextField
            label="Yeni Şifre"
            type="password"
            fullWidth
            value={passwordForm.newPassword}
            onChange={(e) =>
              setPasswordForm({ ...passwordForm, newPassword: e.target.value })
            }
            autoComplete="new-password"
          />
          <TextField
            label="Yeni Şifre (Tekrar)"
            type="password"
            fullWidth
            value={passwordForm.confirmPassword}
            onChange={(e) =>
              setPasswordForm({
                ...passwordForm,
                confirmPassword: e.target.value,
              })
            }
            autoComplete="new-password"
          />
          <Box sx={{ display: "flex", justifyContent: "flex-start" }}>
            <Button type="submit" variant="contained" disabled={passwordLoading}>
              {passwordLoading ? "Güncelleniyor…" : "Şifreyi Güncelle"}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}
