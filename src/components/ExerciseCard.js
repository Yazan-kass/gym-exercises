import React from "react";
import { Link } from "react-router-dom";
import { Button, Stack, Typography, Box, IconButton } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { useFavorites } from "../context/FavoritesContext";

const ExerciseCard = ({ exercise }) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorited = isFavorite(exercise.id);

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(exercise);
  };

  return (
    <Box
      sx={{
        position: "relative",
        width: { lg: "380px", sm: "320px", xs: "280px" },
        borderRadius: "24px",
        overflow: "hidden",
        bgcolor: "background.paper",
        boxShadow: (theme) =>
          theme.palette.mode === "dark"
            ? "0 10px 30px rgba(0, 0, 0, 0.4)"
            : "0 10px 30px rgba(0, 0, 0, 0.06)",
        border: "1px solid",
        borderColor: "divider",
        transition: "all 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
        "&:hover": {
          transform: "translateY(-8px)",
          boxShadow: (theme) =>
            theme.palette.mode === "dark"
              ? "0 20px 40px rgba(255, 38, 37, 0.2)"
              : "0 20px 40px rgba(0, 0, 0, 0.12)",
          borderColor: "primary.main",
        },
      }}
    >
      {/* Heart Favorite Button */}
      <IconButton
        onClick={handleFavoriteClick}
        aria-label="favorite"
        sx={{
          position: "absolute",
          top: 14,
          right: 14,
          zIndex: 10,
          bgcolor: (theme) =>
            theme.palette.mode === "dark"
              ? "rgba(22, 22, 34, 0.85)"
              : "rgba(255, 255, 255, 0.85)",
          backdropFilter: "blur(8px)",
          color: favorited ? "primary.main" : "text.secondary",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          transition: "all 0.2s ease",
          "&:hover": {
            bgcolor: "background.paper",
            transform: "scale(1.15)",
            color: "primary.main",
          },
        }}
      >
        {favorited ? <FavoriteIcon /> : <FavoriteBorderIcon />}
      </IconButton>

      {/* Main Link Wrapper */}
      <Link
        to={`/exercise/${exercise.id}`}
        style={{
          textDecoration: "none",
          display: "flex",
          flexDirection: "column",
          height: "100%",
          justifyContent: "space-between",
        }}
      >
        <Box
          sx={{
            bgcolor: (theme) =>
              theme.palette.mode === "dark" ? "#12121A" : "#FFFFFF",
            p: 2,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "310px",
          }}
        >
          <img
            src={exercise.gifUrl}
            alt={exercise.name}
            loading="lazy"
            style={{
              maxHeight: "280px",
              maxWidth: "100%",
              objectFit: "contain",
              borderRadius: "16px",
            }}
          />
        </Box>

        {/* Details & Tags */}
        <Box p={2.5}>
          <Stack direction="row" spacing={1} mb={1.5}>
            <Button
              size="small"
              sx={{
                color: "#fff",
                background: "linear-gradient(135deg, #FF6B6B 0%, #FF2625 100%)",
                fontSize: "12px",
                fontWeight: 700,
                borderRadius: "20px",
                textTransform: "capitalize",
                px: 1.8,
                py: 0.4,
              }}
            >
              {exercise.bodyPart}
            </Button>
            <Button
              size="small"
              sx={{
                color: "#1A1A24",
                background: "linear-gradient(135deg, #FEDD89 0%, #FCC757 100%)",
                fontSize: "12px",
                fontWeight: 700,
                borderRadius: "20px",
                textTransform: "capitalize",
                px: 1.8,
                py: 0.4,
              }}
            >
              {exercise.target}
            </Button>
          </Stack>

          <Typography
            color="text.primary"
            fontWeight={800}
            sx={{
              fontSize: { lg: "20px", xs: "18px" },
              textTransform: "capitalize",
              lineHeight: 1.3,
            }}
          >
            {exercise.name}
          </Typography>
        </Box>
      </Link>
    </Box>
  );
};

export default ExerciseCard;
