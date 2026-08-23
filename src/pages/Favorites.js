import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Typography,
  Stack,
  TextField,
  Button,
  Chip,
  Container,
  Paper,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import DeleteSweepIcon from "@mui/icons-material/DeleteSweep";
import SearchIcon from "@mui/icons-material/Search";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";

import { useFavorites } from "../context/FavoritesContext";
import ExerciseCard from "../components/ExerciseCard";

const Favorites = () => {
  const { favorites, clearFavorites } = useFavorites();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBodyPart, setSelectedBodyPart] = useState("all");

  // Extract unique bodyParts from favorites
  const bodyParts = [
    "all",
    ...Array.from(new Set(favorites.map((ex) => ex.bodyPart).filter(Boolean))),
  ];

  // Filter favorites
  const filteredFavorites = favorites.filter((exercise) => {
    const matchesSearch =
      exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (exercise.target && exercise.target.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesBodyPart =
      selectedBodyPart === "all" || exercise.bodyPart === selectedBodyPart;
    return matchesSearch && matchesBodyPart;
  });

  return (
    <Box minHeight="80vh" py={5} px={{ xs: 2, md: 4 }}>
      <Container maxWidth="xl">
        {/* Header Banner */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, md: 5 },
            borderRadius: "28px",
            background: (theme) =>
              theme.palette.mode === "dark"
                ? "linear-gradient(135deg, #1A1A24 0%, #12121A 100%)"
                : "linear-gradient(135deg, #FFF3F4 0%, #FFFFFF 100%)",
            border: "1px solid",
            borderColor: "divider",
            mb: 5,
          }}
        >
          <Stack
            direction={{ xs: "column", md: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", md: "center" }}
            spacing={3}
          >
            <Box>
              <Stack direction="row" spacing={1.5} alignItems="center" mb={1}>
                <FavoriteIcon sx={{ color: "primary.main", fontSize: 32 }} />
                <Typography variant="h3" fontWeight={800}>
                  My Favorite Exercises
                </Typography>
              </Stack>
              <Typography variant="body1" color="text.secondary">
                You have {favorites.length} saved{" "}
                {favorites.length === 1 ? "exercise" : "exercises"} for quick access.
              </Typography>
            </Box>

            {favorites.length > 0 && (
              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteSweepIcon />}
                onClick={() => {
                  if (window.confirm("Are you sure you want to clear all favorite exercises?")) {
                    clearFavorites();
                  }
                }}
                sx={{ borderRadius: "14px" }}
              >
                Clear All
              </Button>
            )}
          </Stack>

          {/* Search & Filter bar */}
          {favorites.length > 0 && (
            <Stack spacing={2.5} mt={4}>
              <TextField
                placeholder="Filter your saved exercises..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                variant="outlined"
                size="small"
                InputProps={{
                  startAdornment: <SearchIcon sx={{ color: "text.secondary", mr: 1 }} />,
                }}
                sx={{
                  maxWidth: 500,
                  bgcolor: "background.paper",
                  borderRadius: "12px",
                }}
              />

              {bodyParts.length > 2 && (
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  {bodyParts.map((part) => (
                    <Chip
                      key={part}
                      label={part.toUpperCase()}
                      clickable
                      color={selectedBodyPart === part ? "primary" : "default"}
                      variant={selectedBodyPart === part ? "filled" : "outlined"}
                      onClick={() => setSelectedBodyPart(part)}
                      sx={{ fontWeight: 600, my: 0.5 }}
                    />
                  ))}
                </Stack>
              )}
            </Stack>
          )}
        </Paper>

        {/* Exercises Grid or Empty State */}
        {favorites.length === 0 ? (
          <Paper
            elevation={0}
            sx={{
              py: 10,
              px: 3,
              textAlign: "center",
              borderRadius: "28px",
              border: "1px dashed",
              borderColor: "divider",
            }}
          >
            <FitnessCenterIcon
              sx={{ fontSize: 64, color: "text.secondary", mb: 2, opacity: 0.5 }}
            />
            <Typography variant="h5" fontWeight={700} gutterBottom>
              No Favorite Exercises Saved Yet
            </Typography>
            <Typography variant="body1" color="text.secondary" mb={4} maxWidth={500} mx="auto">
              Explore our extensive library of exercises and click the heart icon on any
              exercise to save it here for quick access during your workouts.
            </Typography>
            <Button
              component={Link}
              to="/"
              variant="contained"
              color="primary"
              size="large"
              sx={{ px: 4, py: 1.5, fontSize: 16 }}
            >
              Explore Exercises
            </Button>
          </Paper>
        ) : filteredFavorites.length === 0 ? (
          <Box textAlign="center" py={8}>
            <Typography variant="h6" color="text.secondary">
              No exercises match your search "{searchTerm}".
            </Typography>
          </Box>
        ) : (
          <Stack
            direction="row"
            sx={{ gap: { lg: "60px", xs: "30px" } }}
            flexWrap="wrap"
            justifyContent="center"
          >
            {filteredFavorites.map((exercise) => (
              <ExerciseCard key={exercise.id} exercise={exercise} />
            ))}
          </Stack>
        )}
      </Container>
    </Box>
  );
};

export default Favorites;
