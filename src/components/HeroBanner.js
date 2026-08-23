import React from "react";
import { Link } from "react-router-dom";
import { Box, Stack, Typography, Button, Paper, Chip } from "@mui/material";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import CalculateIcon from "@mui/icons-material/Calculate";

import HeroBannerImage from "../assets/images/banner.png";

const HeroBanner = () => {
  return (
    <Box
      sx={{
        mt: { lg: "40px", xs: "20px" },
        px: { lg: "40px", sm: "30px", xs: "16px" },
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Stack
        direction={{ xs: "column", lg: "row" }}
        justifyContent="space-between"
        alignItems="center"
        spacing={{ xs: 4, lg: 6 }}
      >
        {/* Left Column: Text & CTAs */}
        <Stack spacing={2.5} sx={{ maxWidth: { lg: "640px", xs: "100%" }, zIndex: 2 }}>
          

          {/* Main Heading */}
          <Typography
            variant="h1"
            sx={{
              fontSize: { lg: "58px", sm: "46px", xs: "36px" },
              fontWeight: 900,
              lineHeight: 1.15,
              letterSpacing: "-0.5px",
            }}
          >
            Sweat, Smile <br />
            <Typography
              component="span"
              variant="inherit"
              sx={{
                background: "linear-gradient(90deg, #FF2625 0%, #FCC757 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              And Repeat
            </Typography>
          </Typography>

          {/* Tagline */}
          <Typography
            variant="body1"
            sx={{
              fontSize: { lg: "19px", xs: "16px" },
              color: "text.secondary",
              lineHeight: 1.6,
              maxWidth: "540px",
            }}
          >
            Explore over 1,300+ categorized exercises with video tutorials, build your
            weekly routine, and track your fitness progress seamlessly.
          </Typography>

          {/* CTA Buttons */}
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            pt={1}
            pb={2}
          >
            <Button
              component="a"
              href="#exercises"
              variant="contained"
              color="primary"
              size="large"
              startIcon={<FitnessCenterIcon />}
              sx={{
                px: 3.5,
                py: 1.5,
                fontSize: "16px",
                fontWeight: 700,
                boxShadow: "0 10px 25px rgba(255, 38, 37, 0.4)",
              }}
            >
              Explore Exercises
            </Button>

            <Button
              component={Link}
              to="/planner"
              variant="outlined"
              color="inherit"
              size="large"
              startIcon={<CalendarMonthIcon />}
              sx={{
                px: 3,
                py: 1.5,
                fontSize: "16px",
                fontWeight: 600,
                borderRadius: "30px",
                borderColor: "divider",
              }}
            >
              Workout Planner
            </Button>

            <Button
              component={Link}
              to="/calculator"
              variant="text"
              color="secondary"
              size="large"
              startIcon={<CalculateIcon />}
              sx={{
                px: 2,
                py: 1.5,
                fontSize: "16px",
                fontWeight: 700,
              }}
            >
              Calculators
            </Button>
          </Stack>

          {/* Stat Highlights Card */}
          <Paper
            elevation={0}
            sx={{
              p: 2.5,
              borderRadius: "20px",
              bgcolor: (theme) =>
                theme.palette.mode === "dark"
                  ? "rgba(22, 22, 34, 0.7)"
                  : "rgba(255, 255, 255, 0.8)",
              backdropFilter: "blur(10px)",
              border: "1px solid",
              borderColor: "divider",
              maxWidth: "540px",
            }}
          >
            <Stack
              direction="row"
              justifyContent="space-between"
              divider={<Box sx={{ borderRight: "1px solid", borderColor: "divider" }} />}
            >
              <Box textAlign="center" px={1.5}>
                <Typography variant="h5" fontWeight={800} color="primary.main">
                  1,300+
                </Typography>
                <Typography variant="caption" color="text.secondary" fontWeight={600}>
                  Exercises
                </Typography>
              </Box>
              <Box textAlign="center" px={1.5}>
                <Typography variant="h5" fontWeight={800} color="secondary.main">
                  10+
                </Typography>
                <Typography variant="caption" color="text.secondary" fontWeight={600}>
                  Muscle Groups
                </Typography>
              </Box>
              <Box textAlign="center" px={1.5}>
                <Typography variant="h5" fontWeight={800} color="success.main">
                  HD
                </Typography>
                <Typography variant="caption" color="text.secondary" fontWeight={600}>
                  Video Guides
                </Typography>
              </Box>
            </Stack>
          </Paper>
        </Stack>

        {/* Right Column: Hero Banner Image in dedicated container */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "relative",
            zIndex: 1,
            maxWidth: { lg: "520px", md: "440px", xs: "100%" },
          }}
        >
          {/* Subtle background glow effect */}
          <Box
            sx={{
              position: "absolute",
              width: "80%",
              height: "80%",
              background: "radial-gradient(circle, rgba(255,38,37,0.18) 0%, rgba(252,199,87,0.08) 70%, transparent 100%)",
              filter: "blur(40px)",
              borderRadius: "50%",
              zIndex: 0,
            }}
          />

          <Box
            component="img"
            src={HeroBannerImage}
            alt="Gym Fitness Athlete"
            sx={{
              width: "100%",
              maxHeight: { lg: "580px", md: "480px", xs: "360px" },
              objectFit: "contain",
              position: "relative",
              zIndex: 1,
              borderRadius: { lg: "0 0 40px 100px", xs: "24px" },
              filter: "drop-shadow(0 15px 30px rgba(0,0,0,0.15))",
            }}
          />
        </Box>
      </Stack>

      {/* Decorative Exercise watermark text */}
      <Typography
        fontWeight={900}
        color="primary.main"
        sx={{
          opacity: (theme) => (theme.palette.mode === "dark" ? "0.03" : "0.05"),
          display: { lg: "block", xs: "none" },
          fontSize: "180px",
          position: "absolute",
          bottom: "-60px",
          left: "20px",
          userSelect: "none",
          pointerEvents: "none",
          zIndex: 0,
        }}
      >
        EXERCISE
      </Typography>
    </Box>
  );
};

export default HeroBanner;
