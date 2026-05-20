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
import DashboardIcon from "@mui/icons-material/Dashboard";
import MapIcon from "@mui/icons-material/Map";
import GroupIcon from "@mui/icons-material/Group";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import HomeIcon from "@mui/icons-material/Home";

import BrandLogo from "./BrandLogo";
import { useAuth } from "../hooks/useAuth";
import { getImageUrl } from "../services/api";

export default function CompanyNavbar() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const navLinks = [
    { label: "Ana Sayfa", path: "/company", icon: <HomeIcon />, key: "home" },
    {
      label: "Dashboard",
      path: "/company/dashboard",
      icon: <DashboardIcon />,
      key: "dashboard",
    },
    {
      label: "Turlarım",
      path: "/company/tours",
      icon: <MapIcon />,
      key: "tours",
    },
    {
      label: "Rehberler",
      path: "/company/guides",
      icon: <GroupIcon />,
      key: "guides",
    },
    {
      label: "Profil",
      path: "/company/profile",
      icon: <PersonIcon />,
      key: "profile",
    },
  ];

  const handleLogout = () => {
    setAnchorEl(null);
    logout();
    navigate("/");
  };

  const getActiveKey = (pathname) => {
    if (pathname === "/company") return "home";
    if (pathname.startsWith("/company/dashboard")) return "dashboard";
    if (pathname.startsWith("/company/tours")) return "tours";
    if (pathname.startsWith("/company/guides")) return "guides";
    if (pathname.startsWith("/company/profile")) return "profile";
    if (pathname.startsWith("/company")) return "dashboard";
    return null;
  };

  const activeKey = getActiveKey(location.pathname);
  const isActive = (key) => activeKey === key;
  const avatarSrc = getImageUrl(user?.profileImageUrl);

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
            <BrandLogo
              to="/company"
              iconSize={32}
              textColor="primary.main"
            >
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
            </BrandLogo>

            {/* Desktop nav links */}
            <Box
              sx={{
                display: { xs: "none", md: "flex" },
                alignItems: "center",
                gap: 0.5,
              }}
            >
              {navLinks.map((link) => (
                <Button
                  key={link.key}
                  component={RouterLink}
                  to={link.path}
                  startIcon={link.icon}
                  sx={{
                    color: isActive(link.key)
                      ? "secondary.main"
                      : "text.primary",
                    fontWeight: isActive(link.key) ? 700 : 500,
                    position: "relative",
                    "&::after": {
                      content: '""',
                      position: "absolute",
                      bottom: 4,
                      left: "50%",
                      transform: "translateX(-50%)",
                      width: isActive(link.key) ? "60%" : 0,
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

              {/* User menu */}
              <IconButton
                onClick={(e) => setAnchorEl(e.currentTarget)}
                sx={{ ml: 1 }}
              >
                <Avatar
                  src={avatarSrc || undefined}
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
                    navigate("/company/dashboard");
                  }}
                >
                  <ListItemIcon>
                    <DashboardIcon fontSize="small" />
                  </ListItemIcon>
                  Dashboard
                </MenuItem>
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
          <BrandLogo
            to="/company"
            iconSize={24}
            textVariant="h6"
            textColor="primary.main"
            sx={{ px: 2, mb: 1 }}
          />
          <Box sx={{ px: 2, mb: 2 }}>
            <Typography variant="caption" color="text.secondary">
              Firma Paneli – {user?.name}
            </Typography>
          </Box>
          <Divider />
          <List>
            {navLinks.map((link) => (
              <ListItem key={link.key} disablePadding>
                <ListItemButton
                  component={RouterLink}
                  to={link.path}
                  onClick={() => setDrawerOpen(false)}
                  selected={isActive(link.key)}
                >
                  <ListItemIcon>{link.icon}</ListItemIcon>
                  <ListItemText primary={link.label} />
                </ListItemButton>
              </ListItem>
            ))}
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
              component={RouterLink}
              to="/company/profile"
              variant="outlined"
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
