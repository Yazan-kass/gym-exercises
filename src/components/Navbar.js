import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Stack,
  Box,
  IconButton,
  Badge,
  Tooltip,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import FavoriteIcon from "@mui/icons-material/Favorite";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import CalculateIcon from "@mui/icons-material/Calculate";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import HomeIcon from "@mui/icons-material/Home";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";

import Logo from "../assets/images/Logo.png";
import { useThemeMode } from "../context/ThemeContext";
import { useFavorites } from "../context/FavoritesContext";

const Navbar = () => {
  const { mode, toggleTheme } = useThemeMode();
  const { favoritesCount } = useFavorites();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { label: "Home", path: "/", icon: <HomeIcon /> },
    { label: "Exercises", path: "/#exercises", icon: <FitnessCenterIcon />, isAnchor: true },
    { label: "Planner", path: "/planner", icon: <CalendarMonthIcon /> },
    { label: "Calculators", path: "/calculator", icon: <CalculateIcon /> },
    {
      label: "Favorites",
      path: "/favorites",
      icon: (
        <Badge badgeContent={favoritesCount} color="primary">
          <FavoriteIcon />
        </Badge>
      ),
    },
  ];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box
      component="nav"
      sx={{
        position: "sticky",
        top: 0,
        zIndex: 1100,
        backdropFilter: "blur(12px)",
        bgcolor: (theme) =>
          theme.palette.mode === "dark"
            ? "rgba(13, 13, 18, 0.85)"
            : "rgba(250, 250, 252, 0.85)",
        borderBottom: "1px solid",
        borderColor: "divider",
        px: { xs: 2, sm: 4, md: 6 },
        py: 1.5,
        transition: "all 0.3s ease",
      }}
    >
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        maxWidth="1440px"
        mx="auto"
      >
        {/* Logo & Brand */}
        <Link
          to="/"
          style={{
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <img
            src={Logo}
            alt="Gym Exercises Logo"
            style={{ width: "42px", height: "42px" }}
          />
          <Typography
            variant="h6"
            sx={{
              fontWeight: 800,
              letterSpacing: "1px",
              background: "linear-gradient(90deg, #FF2625 0%, #FF7070 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              display: { xs: "none", sm: "block" },
            }}
          >
            FITPULSE
          </Typography>
        </Link>

        {/* Desktop Navigation Links */}
        <Stack
          direction="row"
          spacing={3}
          alignItems="center"
          sx={{ display: { xs: "none", md: "flex" } }}
        >
          {navItems.map((item) => {
            const isActive =
              !item.isAnchor && location.pathname === item.path;

            if (item.isAnchor) {
              return (
                <a
                  key={item.label}
                  href={item.path}
                  style={{
                    textDecoration: "none",
                    fontSize: "17px",
                    fontWeight: 600,
                    color: "inherit",
                    padding: "8px 12px",
                    borderRadius: "12px",
                    transition: "all 0.2s ease",
                  }}
                  className="nav-link"
                >
                  {item.label}
                </a>
              );
            }

            return (
              <Link
                key={item.label}
                to={item.path}
                style={{
                  textDecoration: "none",
                  fontSize: "17px",
                  fontWeight: isActive ? 700 : 600,
                  color: isActive ? "#FF2625" : "inherit",
                  padding: "8px 14px",
                  borderRadius: "12px",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  borderBottom: isActive ? "3px solid #FF2625" : "3px solid transparent",
                  transition: "all 0.2s ease",
                }}
                className="nav-link"
              >
                {item.label}
                {item.label === "Favorites" && favoritesCount > 0 && (
                  <Badge
                    badgeContent={favoritesCount}
                    color="primary"
                    sx={{ ml: 1 }}
                  />
                )}
              </Link>
            );
          })}
        </Stack>

        {/* Action Buttons: Theme Toggle & Mobile Menu */}
        <Stack direction="row" spacing={1} alignItems="center">
          <Tooltip title={`Switch to ${mode === "dark" ? "Light" : "Dark"} Mode`}>
            <IconButton
              onClick={toggleTheme}
              color="inherit"
              sx={{
                p: 1,
                border: "1px solid",
                borderColor: "divider",
                borderRadius: "12px",
                transition: "all 0.2s ease",
                "&:hover": {
                  bgcolor: "background.paper",
                  transform: "rotate(20deg)",
                },
              }}
            >
              {mode === "dark" ? (
                <Brightness7Icon sx={{ color: "#FCC757" }} />
              ) : (
                <Brightness4Icon sx={{ color: "#FF2625" }} />
              )}
            </IconButton>
          </Tooltip>

          {/* Mobile Menu Button */}
          <IconButton
            color="inherit"
            edge="end"
            onClick={handleDrawerToggle}
            sx={{ display: { md: "none" } }}
          >
            <MenuIcon />
          </IconButton>
        </Stack>
      </Stack>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        PaperProps={{
          sx: {
            width: 280,
            bgcolor: "background.paper",
            p: 2,
          },
        }}
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
          pb={1}
          borderBottom="1px solid"
          borderColor="divider"
        >
          <Stack direction="row" spacing={1.5} alignItems="center">
            <img src={Logo} alt="Logo" style={{ width: "32px", height: "32px" }} />
            <Typography variant="h6" fontWeight={800} color="primary.main">
              FITPULSE
            </Typography>
          </Stack>
          <IconButton onClick={handleDrawerToggle}>
            <CloseIcon />
          </IconButton>
        </Stack>

        <List>
          {navItems.map((item) => (
            <ListItem key={item.label} disablePadding sx={{ mb: 1 }}>
              {item.isAnchor ? (
                <ListItemButton
                  component="a"
                  href={item.path}
                  onClick={handleDrawerToggle}
                  sx={{ borderRadius: "12px" }}
                >
                  <ListItemIcon sx={{ color: "primary.main", minWidth: 40 }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{ fontWeight: 600 }}
                  />
                </ListItemButton>
              ) : (
                <ListItemButton
                  component={Link}
                  to={item.path}
                  onClick={handleDrawerToggle}
                  selected={location.pathname === item.path}
                  sx={{
                    borderRadius: "12px",
                    "&.Mui-selected": {
                      bgcolor: "background.subtle",
                      color: "primary.main",
                    },
                  }}
                >
                  <ListItemIcon sx={{ color: "primary.main", minWidth: 40 }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{ fontWeight: 700 }}
                  />
                </ListItemButton>
              )}
            </ListItem>
          ))}
        </List>
      </Drawer>
    </Box>
  );
};

export default Navbar;
