import React, { useState } from "react";
import {
  Typography,
  Stack,
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  TextField,
  Paper,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import BodyPartImage from "../assets/icons/body-part.png";
import TargetImage from "../assets/icons/target.png";
import EquipmentImage from "../assets/icons/equipment.png";
import { useFavorites } from "../context/FavoritesContext";
import { usePlanner } from "../context/PlannerContext";

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const Detail = ({ exerciseDetail }) => {
  const { bodyPart, gifUrl, name, target, equipment, id } = exerciseDetail;
  const { isFavorite, toggleFavorite } = useFavorites();
  const { addExerciseToDay } = usePlanner();

  const [plannerDialogOpen, setPlannerDialogOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState("Monday");
  const [sets, setSets] = useState("3");
  const [reps, setReps] = useState("10-12");
  const [weight, setWeight] = useState("");
  const [addedSuccess, setAddedSuccess] = useState(false);

  const favorited = id ? isFavorite(id) : false;

  const extraDetail = [
    {
      icon: BodyPartImage,
      label: "Body Part",
      name: bodyPart,
    },
    {
      icon: TargetImage,
      label: "Target Muscle",
      name: target,
    },
    {
      icon: EquipmentImage,
      label: "Equipment",
      name: equipment,
    },
  ];

  const handleAddToPlanner = () => {
    addExerciseToDay(
      selectedDay,
      { id, name, gifUrl, bodyPart, target, equipment },
      { sets, reps, weight }
    );
    setAddedSuccess(true);
    setTimeout(() => {
      setAddedSuccess(false);
      setPlannerDialogOpen(false);
    }, 1200);
  };

  return (
    <Box>
      <Stack
        gap="60px"
        sx={{
          flexDirection: { lg: "row" },
          p: "20px",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: "32px",
            bgcolor: (theme) =>
              theme.palette.mode === "dark" ? "#161622" : "#FFFFFF",
            border: "1px solid",
            borderColor: "divider",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            maxWidth: "700px",
            width: "100%",
          }}
        >
          <img
            src={gifUrl}
            alt={name}
            loading="lazy"
            className="detail-image"
            style={{
              maxHeight: "550px",
              maxWidth: "100%",
              objectFit: "contain",
              borderRadius: "20px",
            }}
          />
        </Paper>

        <Stack sx={{ gap: { lg: "30px", xs: "20px" }, maxWidth: "600px", width: "100%" }}>
          <Typography
            sx={{ fontSize: { lg: "54px", xs: "32px" } }}
            fontWeight={800}
            textTransform="capitalize"
            color="text.primary"
            lineHeight={1.15}
          >
            {name}
          </Typography>

          <Typography
            sx={{ fontSize: { lg: "20px", xs: "16px" } }}
            color="text.secondary"
            lineHeight={1.6}
          >
            Exercises keep you strong and energized.{" "}
            <strong style={{ textTransform: "capitalize", color: "#FF2625" }}>
              {name}
            </strong>{" "}
            is one of the most effective exercises to target your{" "}
            <strong>{target}</strong> and improve functional mobility.
          </Typography>

          {/* Quick Action Buttons */}
          <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
            <Button
              variant={favorited ? "contained" : "outlined"}
              color="primary"
              size="large"
              startIcon={favorited ? <FavoriteIcon /> : <FavoriteBorderIcon />}
              onClick={() => toggleFavorite(exerciseDetail)}
              sx={{ px: 3, py: 1.2, fontWeight: 700 }}
            >
              {favorited ? "Favorited" : "Save to Favorites"}
            </Button>

            <Button
              variant="contained"
              color="secondary"
              size="large"
              startIcon={<CalendarMonthIcon />}
              onClick={() => setPlannerDialogOpen(true)}
              sx={{ px: 3, py: 1.2, fontWeight: 700 }}
            >
              Add to Workout Split
            </Button>
          </Stack>

          {/* Key metadata chips/rows */}
          <Stack spacing={2} mt={1}>
            {extraDetail.map((item, index) => (
              <Stack
                key={index}
                direction="row"
                gap="20px"
                alignItems="center"
                sx={{
                  p: 1.5,
                  borderRadius: "16px",
                  bgcolor: "background.paper",
                  border: "1px solid",
                  borderColor: "divider",
                }}
              >
                <Button
                  sx={{
                    background: "rgba(255, 38, 37, 0.1)",
                    borderRadius: "16px",
                    width: "64px",
                    height: "64px",
                    minWidth: "64px",
                  }}
                >
                  <img
                    src={item.icon}
                    alt={item.name}
                    style={{ width: "36px", height: "36px" }}
                  />
                </Button>
                <Box>
                  <Typography variant="caption" color="text.secondary" fontWeight={600}>
                    {item.label}
                  </Typography>
                  <Typography
                    textTransform="capitalize"
                    sx={{ fontSize: { lg: "22px", xs: "18px" }, fontWeight: 700 }}
                    color="text.primary"
                  >
                    {item.name}
                  </Typography>
                </Box>
              </Stack>
            ))}
          </Stack>
        </Stack>
      </Stack>

      {/* Add to Planner Dialog */}
      <Dialog
        open={plannerDialogOpen}
        onClose={() => setPlannerDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: "24px", p: 1 } }}
      >
        <DialogTitle sx={{ fontWeight: 800, fontSize: 20 }}>
          Add "{name}" to Workout Split
        </DialogTitle>
        <DialogContent dividers>
          {addedSuccess ? (
            <Stack spacing={2} alignItems="center" py={4}>
              <CheckCircleIcon color="success" sx={{ fontSize: 60 }} />
              <Typography variant="h6" fontWeight={700} color="success.main">
                Added to {selectedDay}'s Routine!
              </Typography>
            </Stack>
          ) : (
            <Stack spacing={2.5} mt={1}>
              <TextField
                select
                label="Select Day"
                value={selectedDay}
                onChange={(e) => setSelectedDay(e.target.value)}
                fullWidth
              >
                {DAYS.map((day) => (
                  <MenuItem key={day} value={day}>
                    {day}
                  </MenuItem>
                ))}
              </TextField>

              <Stack direction="row" spacing={2}>
                <TextField
                  label="Target Sets"
                  type="number"
                  value={sets}
                  onChange={(e) => setSets(e.target.value)}
                  fullWidth
                />
                <TextField
                  label="Target Reps"
                  value={reps}
                  onChange={(e) => setReps(e.target.value)}
                  fullWidth
                />
              </Stack>

              <TextField
                label="Weight (e.g. 25kg / bodyweight)"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                fullWidth
              />
            </Stack>
          )}
        </DialogContent>
        {!addedSuccess && (
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setPlannerDialogOpen(false)}>Cancel</Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddToPlanner}
              sx={{ px: 3 }}
            >
              Add to {selectedDay}
            </Button>
          </DialogActions>
        )}
      </Dialog>
    </Box>
  );
};

export default Detail;
