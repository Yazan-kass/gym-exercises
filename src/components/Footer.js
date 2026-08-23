import React from "react";
import { Box, Stack, Typography, Container, Divider } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import Logo from "../assets/images/Logo-1.png";

const Footer = () => (
  <Box
    component="footer"
    mt="100px"
    sx={{
      bgcolor: (theme) =>
        theme.palette.mode === "dark" ? "#0A0A0E" : "#FFF3F4",
      borderTop: "1px solid",
      borderColor: "divider",
      pt: 6,
      pb: 5,
    }}
  >
    <Container maxWidth="lg">
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems="center"
        spacing={3}
      >
        <Stack direction="row" spacing={1.5} alignItems="center">
          <img src={Logo} alt="FitPulse Logo" style={{ width: "160px", height: "auto" }} />
        </Stack>

        <Typography variant="body2" color="text.secondary" textAlign={{ xs: "center", sm: "right" }}>
          Empowering your fitness journey with over 1,300 exercises, video tutorials, and routine tracking.
        </Typography>
      </Stack>

      <Divider sx={{ my: 4 }} />

      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems="center"
        spacing={2}
      >
        <Typography variant="body2" color="text.secondary">
          © {new Date().getFullYear()} FitPulse Gym Club. All rights reserved.
        </Typography>

        <Stack direction="row" spacing={0.5} alignItems="center">
          <Typography variant="body2" color="text.secondary">
            Made with
          </Typography>
          <FavoriteIcon sx={{ color: "primary.main", fontSize: 16 }} />
          <Typography variant="body2" fontWeight={700} color="text.primary">
            by Yazan abu al-kass
          </Typography>
        </Stack>
      </Stack>
    </Container>
  </Box>
);

export default Footer;
