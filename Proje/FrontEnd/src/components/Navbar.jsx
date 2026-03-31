import { useState } from "react";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";

// Material-UI components and icons
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Box,
  Container,
  useScrollTrigger,
  Menu,
  MenuItem,
  Avatar,
  Divider,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import DirectionsBusIcon from "@mui/icons-material/DirectionsBus";
import PersonIcon from "@mui/icons-material/Person";

import { useAuth } from "../hooks/useAuth";

// Navbar component with responsive design, scroll-triggered styling, and authentication-aware menu
const navLinks = [
  { label: "Ana Sayfa", path: "/" },
  { label: "Hakkımızda", path: "/about" },
];

// Main navigation bar component
export default function Navbar() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();

  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 50,
  });

  const isHome = location.pathname === "/";
  const textColor = trigger || !isHome ? "text.primary" : "#fff";
  const brandColor = trigger || !isHome ? "primary.main" : "#fff";

  const handleLogout = () => {
    setAnchorEl(null);
    logout();
    navigate("/");
  };

  return (
    <>
      <AppBar
        position="fixed"
        elevation={trigger ? 2 : 0}
        sx={{
          backgroundColor:
            trigger || !isHome ? "rgba(255,255,255,0.97)" : "transparent",
          backdropFilter: trigger ? "blur(10px)" : "none",
          transition: "all 0.3s ease",
        }}
      >
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ justifyContent: "space-between" }}>
            <Box
              component={RouterLink}
              to="/"
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                textDecoration: "none",
              }}
            >
              <DirectionsBusIcon sx={{ fontSize: 32, color: brandColor }} />
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 800,
                  color: brandColor,
                  letterSpacing: "-0.5px",
                }}
              >
                TravelBook
              </Typography>
            </Box>

            {/* Desktop Nav */}
            <Box
              sx={{
                display: { xs: "none", md: "flex" },
                alignItems: "center",
                gap: 1,
              }}
            >
              {navLinks.map((link) => (
                <Button
                  key={link.path}
                  component={RouterLink}
                  to={link.path}
                  sx={{
                    color: textColor,
                    fontWeight: location.pathname === link.path ? 700 : 500,
                    position: "relative",
                    "&::after": {
                      content: '""',
                      position: "absolute",
                      bottom: 4,
                      left: "50%",
                      transform: "translateX(-50%)",
                      width: location.pathname === link.path ? "60%" : 0,
                      height: 2,
                      bgcolor: "secondary.main",
                      borderRadius: 1,
                      transition: "width 0.25s",
                    },
                    "&:hover::after": { width: "60%" },
                  }}
                >
                  {link.label}
                </Button>
              ))}

              {isAuthenticated ? (
                <>
                  <IconButton
                    onClick={(e) => setAnchorEl(e.currentTarget)}
                    sx={{ ml: 1 }}
                  >
                    <Avatar
                      sx={{
                        width: 34,
                        height: 34,
                        bgcolor: "secondary.main",
                        fontSize: 15,
                      }}
                    >
                      {user?.name?.charAt(0)?.toUpperCase() || <PersonIcon />}
                    </Avatar>
                  </IconButton>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={() => setAnchorEl(null)}
                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                    transformOrigin={{ vertical: "top", horizontal: "right" }}
                    slotProps={{ paper: { sx: { minWidth: 180, mt: 1 } } }}
                  >
                    <MenuItem disabled>
                      <Typography variant="body2" color="text.secondary">
                        {user?.email}
                      </Typography>
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        setAnchorEl(null);
                        navigate(`/${user?.id}/profile`);
                      }}
                    >
                      Profilim
                    </MenuItem>
                    <Divider />
                    <MenuItem onClick={handleLogout}>Çıkış Yap</MenuItem>
                  </Menu>
                </>
              ) : (
                <>
                  <Button
                    component={RouterLink}
                    to="/login"
                    sx={{ ml: 1, color: textColor, fontWeight: 600 }}
                  >
                    Giriş Yap
                  </Button>
                  <Button
                    component={RouterLink}
                    to="/register"
                    variant="contained"
                    color="secondary"
                  >
                    Kayıt Ol
                  </Button>
                </>
              )}
            </Box>

            {/* Mobile Menu Icon */}
            <IconButton
              sx={{ display: { xs: "flex", md: "none" }, color: textColor }}
              onClick={() => setDrawerOpen(true)}
            >
              <MenuIcon />
            </IconButton>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <Box sx={{ width: 260, pt: 2 }}>
          <Box
            sx={{ display: "flex", alignItems: "center", gap: 1, px: 2, mb: 2 }}
          >
            <DirectionsBusIcon color="primary" />
            <Typography variant="h6" fontWeight={800} color="primary">
              TravelBook
            </Typography>
          </Box>
          <List>
            {navLinks.map((link) => (
              <ListItem key={link.path} disablePadding>
                <ListItemButton
                  component={RouterLink}
                  to={link.path}
                  onClick={() => setDrawerOpen(false)}
                  selected={location.pathname === link.path}
                >
                  <ListItemText primary={link.label} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Box
            sx={{
              px: 2,
              mt: 2,
              display: "flex",
              flexDirection: "column",
              gap: 1,
            }}
          >
            {isAuthenticated ? (
              <>
                <Button
                  component={RouterLink}
                  to={`/${user?.id}/profile`}
                  variant="contained"
                  color="secondary"
                  fullWidth
                  onClick={() => setDrawerOpen(false)}
                >
                  Profilim
                </Button>
                <Button
                  variant="outlined"
                  color="primary"
                  fullWidth
                  onClick={() => {
                    setDrawerOpen(false);
                    handleLogout();
                  }}
                >
                  Çıkış Yap
                </Button>
              </>
            ) : (
              <>
                <Button
                  component={RouterLink}
                  to="/login"
                  variant="outlined"
                  fullWidth
                  onClick={() => setDrawerOpen(false)}
                >
                  Giriş Yap
                </Button>
                <Button
                  component={RouterLink}
                  to="/register"
                  variant="contained"
                  color="secondary"
                  fullWidth
                  onClick={() => setDrawerOpen(false)}
                >
                  Kayıt Ol
                </Button>
              </>
            )}
          </Box>
        </Box>
      </Drawer>

      {/* Toolbar spacer - only on non-home pages */}
      {!isHome && <Toolbar />}
    </>
  );
}
