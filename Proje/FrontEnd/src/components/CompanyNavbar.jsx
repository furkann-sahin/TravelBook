import { useState } from "react";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
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
  ListItemIcon,
  ListItemText,
  Box,
  Container,
  Menu,
  MenuItem,
  Avatar,
  Divider,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import DirectionsBusIcon from "@mui/icons-material/DirectionsBus";
import DashboardIcon from "@mui/icons-material/Dashboard";
import MapIcon from "@mui/icons-material/Map";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import HomeIcon from "@mui/icons-material/Home";
import InfoIcon from "@mui/icons-material/Info";

import { useAuth } from "../hooks/useAuth";

export default function CompanyNavbar() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const navLinks = [
    { label: "Panel", path: "/company", icon: <DashboardIcon /> },
    { label: "Turlarım", path: "/company/tours", icon: <MapIcon /> },
    { label: "Profilim", path: "/company/profile", icon: <PersonIcon /> },
  ];

  const handleLogout = () => {
    setAnchorEl(null);
    logout();
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <AppBar
        position="fixed"
        elevation={1}
        sx={{
          bgcolor: "rgba(255,255,255,0.97)",
          backdropFilter: "blur(10px)",
        }}
      >
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ justifyContent: "space-between" }}>
            {/* Brand */}
            <Box
              component={RouterLink}
              to="/company"
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                textDecoration: "none",
              }}
            >
              <DirectionsBusIcon
                sx={{ fontSize: 32, color: "secondary.main" }}
              />
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 800,
                  color: "primary.main",
                  letterSpacing: "-0.5px",
                }}
              >
                TravelBook
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  ml: 0.5,
                  px: 1,
                  py: 0.25,
                  bgcolor: "secondary.main",
                  color: "#fff",
                  borderRadius: 1,
                  fontWeight: 700,
                  fontSize: "0.65rem",
                  letterSpacing: 1,
                  textTransform: "uppercase",
                }}
              >
                Firma Paneli
              </Typography>
            </Box>

            {/* Desktop nav links */}
            <Box
              sx={{
                display: { xs: "none", md: "flex" },
                alignItems: "center",
                gap: 0.5,
              }}
            >
              {/* Public site links */}
              <Button
                component={RouterLink}
                to="/"
                startIcon={<HomeIcon />}
                sx={{
                  color: "text.secondary",
                  fontWeight: 500,
                  "&:hover": { color: "secondary.main" },
                }}
              >
                Ana Sayfa
              </Button>

              {navLinks.map((link) => (
                <Button
                  key={link.path}
                  component={RouterLink}
                  to={link.path}
                  startIcon={link.icon}
                  sx={{
                    color: isActive(link.path)
                      ? "secondary.main"
                      : "text.primary",
                    fontWeight: isActive(link.path) ? 700 : 500,
                    position: "relative",
                    "&::after": {
                      content: '""',
                      position: "absolute",
                      bottom: 4,
                      left: "50%",
                      transform: "translateX(-50%)",
                      width: isActive(link.path) ? "60%" : 0,
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

              <Button
                component={RouterLink}
                to="/about"
                startIcon={<InfoIcon />}
                sx={{
                  color: "text.secondary",
                  fontWeight: 500,
                  "&:hover": { color: "secondary.main" },
                }}
              >
                Hakkımızda
              </Button>

              {/* User menu */}
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
                slotProps={{ paper: { sx: { minWidth: 200, mt: 1 } } }}
              >
                <MenuItem disabled>
                  <Typography variant="body2" color="text.secondary">
                    {user?.email}
                  </Typography>
                </MenuItem>
                <Divider />
                <MenuItem
                  onClick={() => {
                    setAnchorEl(null);
                    navigate("/company/profile");
                  }}
                >
                  <ListItemIcon>
                    <PersonIcon fontSize="small" />
                  </ListItemIcon>
                  Profilim
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                  <ListItemIcon>
                    <LogoutIcon fontSize="small" />
                  </ListItemIcon>
                  Çıkış Yap
                </MenuItem>
              </Menu>
            </Box>

            {/* Mobile menu icon */}
            <IconButton
              sx={{
                display: { xs: "flex", md: "none" },
                color: "text.primary",
              }}
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
        <Box sx={{ width: 280, pt: 2 }}>
          <Box
            sx={{ display: "flex", alignItems: "center", gap: 1, px: 2, mb: 1 }}
          >
            <DirectionsBusIcon color="secondary" />
            <Typography variant="h6" fontWeight={800} color="primary">
              TravelBook
            </Typography>
          </Box>
          <Box sx={{ px: 2, mb: 2 }}>
            <Typography variant="caption" color="text.secondary">
              Firma Paneli – {user?.name}
            </Typography>
          </Box>
          <Divider />
          <List>
            {navLinks.map((link) => (
              <ListItem key={link.path} disablePadding>
                <ListItemButton
                  component={RouterLink}
                  to={link.path}
                  onClick={() => setDrawerOpen(false)}
                  selected={isActive(link.path)}
                >
                  <ListItemIcon>{link.icon}</ListItemIcon>
                  <ListItemText primary={link.label} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Divider />
          <List>
            <ListItem disablePadding>
              <ListItemButton
                component={RouterLink}
                to="/"
                onClick={() => setDrawerOpen(false)}
              >
                <ListItemIcon>
                  <HomeIcon />
                </ListItemIcon>
                <ListItemText primary="Ana Sayfa" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton
                component={RouterLink}
                to="/about"
                onClick={() => setDrawerOpen(false)}
              >
                <ListItemIcon>
                  <InfoIcon />
                </ListItemIcon>
                <ListItemText primary="Hakkımızda" />
              </ListItemButton>
            </ListItem>
          </List>
          <Divider />
          <Box
            sx={{
              px: 2,
              mt: 2,
              display: "flex",
              flexDirection: "column",
              gap: 1,
            }}
          >
            <Button
              variant="outlined"
              color="primary"
              fullWidth
              startIcon={<LogoutIcon />}
              onClick={() => {
                setDrawerOpen(false);
                handleLogout();
              }}
            >
              Çıkış Yap
            </Button>
          </Box>
        </Box>
      </Drawer>

      {/* Toolbar spacer */}
      <Toolbar />
    </>
  );
}
