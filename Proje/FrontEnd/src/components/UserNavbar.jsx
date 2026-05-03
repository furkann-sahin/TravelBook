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
import HomeIcon from "@mui/icons-material/Home";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PersonIcon from "@mui/icons-material/Person";

import { useAuth } from "../hooks/useAuth";
import { getImageUrl } from "../services/api";

const navLinks = [
  { label: "Ana Sayfa", path: "/user", key: "home", icon: <HomeIcon /> },
  {
    label: "Dashboard",
    path: "/user/dashboard",
    key: "dashboard",
    icon: <DashboardIcon />,
  },
];

export default function UserNavbar() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const avatarSrc = getImageUrl(user?.profileImageUrl);
  const purchasesPath = "/user/purchases?status=past";

  const activeKey =
    location.pathname === "/user"
      ? "home"
      : location.pathname.startsWith("/user/dashboard")
        ? "dashboard"
        : null;

  const handleLogout = () => {
    setAnchorEl(null);
    logout();
    navigate("/");
  };

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
            <Box
              component={RouterLink}
              to="/user"
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                textDecoration: "none",
              }}
            >
              <DirectionsBusIcon sx={{ fontSize: 32, color: "secondary.main" }} />
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
                Kullanıcı
              </Typography>
            </Box>

            <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center", gap: 0.5 }}>
              {navLinks.map((link) => (
                <Button
                  key={link.key}
                  component={RouterLink}
                  to={link.path}
                  startIcon={link.icon}
                  sx={{
                    color: activeKey === link.key ? "secondary.main" : "text.primary",
                    fontWeight: activeKey === link.key ? 700 : 500,
                    position: "relative",
                    "&::after": {
                      content: '""',
                      position: "absolute",
                      bottom: 4,
                      left: "50%",
                      transform: "translateX(-50%)",
                      width: activeKey === link.key ? "60%" : 0,
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

              <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} sx={{ ml: 1 }}>
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
                    navigate("/user/profile");
                  }}
                >
                  Profilim
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    setAnchorEl(null);
                    navigate(purchasesPath);
                  }}
                >
                  Seyahatlerim
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleLogout}>Çıkış Yap</MenuItem>
              </Menu>
            </Box>

            <IconButton
              sx={{ display: { xs: "flex", md: "none" }, color: "text.primary" }}
              onClick={() => setDrawerOpen(true)}
            >
              <MenuIcon />
            </IconButton>
          </Toolbar>
        </Container>
      </AppBar>

      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={{ width: 280, pt: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, px: 2, mb: 2 }}>
            <DirectionsBusIcon color="secondary" />
            <Typography variant="h6" fontWeight={800} color="primary">
              TravelBook
            </Typography>
          </Box>

          <List>
            {navLinks.map((link) => (
              <ListItem key={link.key} disablePadding>
                <ListItemButton
                  component={RouterLink}
                  to={link.path}
                  onClick={() => setDrawerOpen(false)}
                  selected={activeKey === link.key}
                >
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
              to="/user/profile"
              variant="outlined"
              color="secondary"
              fullWidth
              onClick={() => setDrawerOpen(false)}
            >
              Profilim
            </Button>
            <Button
              component={RouterLink}
              to={purchasesPath}
              variant="outlined"
              color="secondary"
              fullWidth
              onClick={() => setDrawerOpen(false)}
            >
              Seyahatlerim
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
          </Box>
        </Box>
      </Drawer>

      <Toolbar />
    </>
  );
}
