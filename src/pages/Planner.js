import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Paper,
  Tabs,
  Tab,
  Stack,
  Button,
  IconButton,
  Checkbox,
  TextField,
  Chip,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
} from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AddIcon from "@mui/icons-material/Add";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";

import { usePlanner } from "../context/PlannerContext";
import { useFavorites } from "../context/FavoritesContext";

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const Planner = () => {
  const {
    schedule,
    addExerciseToDay,
    removeExerciseFromDay,
    toggleExerciseCompleted,
    updateExerciseDetails,
    setDayTitle,
    clearDay,
    resetWeeklyProgress,
  } = usePlanner();

  const { favorites } = useFavorites();

  const [selectedDay, setSelectedDay] = useState("Monday");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [customExerciseName, setCustomExerciseName] = useState("");
  const [customBodyPart, setCustomBodyPart] = useState("Chest");
  const [customSets, setCustomSets] = useState("3");
  const [customReps, setCustomReps] = useState("10-12");
  const [customWeight, setCustomWeight] = useState("");

  const currentDayData = schedule[selectedDay] || { title: selectedDay, exercises: [] };
  const currentExercises = currentDayData.exercises || [];

  const completedCount = currentExercises.filter((ex) => ex.completed).length;
  const progressPercent =
    currentExercises.length > 0
      ? Math.round((completedCount / currentExercises.length) * 100)
      : 0;

  // Calculate total weekly progress
  const totalWeeklyExercises = Object.values(schedule).reduce(
    (acc, day) => acc + (day.exercises ? day.exercises.length : 0),
    0
  );
  const totalWeeklyCompleted = Object.values(schedule).reduce(
    (acc, day) =>
      acc + (day.exercises ? day.exercises.filter((ex) => ex.completed).length : 0),
    0
  );
  const weeklyPercent =
    totalWeeklyExercises > 0
      ? Math.round((totalWeeklyCompleted / totalWeeklyExercises) * 100)
      : 0;

  // Add custom or selected exercise
  const handleAddCustomExercise = (e) => {
    e.preventDefault();
    if (!customExerciseName.trim()) return;

    addExerciseToDay(
      selectedDay,
      {
        id: `custom-${Date.now()}`,
        name: customExerciseName.trim(),
        bodyPart: customBodyPart,
        target: customBodyPart,
        equipment: "Gym",
      },
      {
        sets: customSets || 3,
        reps: customReps || "10-12",
        weight: customWeight || "",
      }
    );

    setCustomExerciseName("");
    setCustomWeight("");
    setIsAddModalOpen(false);
  };

  const handleAddFavoriteToDay = (favExercise) => {
    addExerciseToDay(selectedDay, favExercise, {
      sets: 3,
      reps: "10-12",
      weight: "",
    });
    setIsAddModalOpen(false);
  };

  return (
    <Box minHeight="85vh" py={5} px={{ xs: 2, md: 4 }}>
      <Container maxWidth="xl">
        {/* Banner */}
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
            mb: 4,
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
                <CalendarMonthIcon sx={{ color: "primary.main", fontSize: 36 }} />
                <Typography variant="h3" fontWeight={800}>
                  Weekly Workout Planner
                </Typography>
              </Stack>
              <Typography variant="body1" color="text.secondary">
                Structure your workout split, log sets & weights, and track your weekly completion rate.
              </Typography>
            </Box>

            {/* Weekly Completion Progress */}
            <Paper
              elevation={0}
              sx={{
                p: 2.5,
                borderRadius: "20px",
                bgcolor: "background.paper",
                border: "1px solid",
                borderColor: "divider",
                minWidth: 260,
              }}
            >
              <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                <Typography variant="body2" fontWeight={700}>
                  Weekly Completion
                </Typography>
                <Typography variant="body2" fontWeight={800} color="primary.main">
                  {totalWeeklyCompleted} / {totalWeeklyExercises} ({weeklyPercent}%)
                </Typography>
              </Stack>
              <LinearProgress
                variant="determinate"
                value={weeklyPercent}
                color="primary"
                sx={{ height: 8, borderRadius: 4 }}
              />
              <Button
                size="small"
                color="secondary"
                startIcon={<RestartAltIcon />}
                onClick={resetWeeklyProgress}
                sx={{ mt: 1, textTransform: "none", fontSize: 12 }}
              >
                Reset Weekly Checkmarks
              </Button>
            </Paper>
          </Stack>
        </Paper>

        {/* Day Tabs */}
        <Paper
          sx={{
            borderRadius: "20px",
            mb: 4,
            overflow: "hidden",
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <Tabs
            value={selectedDay}
            onChange={(e, val) => setSelectedDay(val)}
            variant="scrollable"
            scrollButtons="auto"
            textColor="primary"
            indicatorColor="primary"
          >
            {DAYS.map((day) => {
              const dayEx = schedule[day]?.exercises || [];
              const dayDone = dayEx.filter((e) => e.completed).length;
              return (
                <Tab
                  key={day}
                  value={day}
                  label={
                    <Stack direction="row" spacing={1} alignItems="center">
                      <span>{day}</span>
                      {dayEx.length > 0 && (
                        <Chip
                          size="small"
                          label={`${dayDone}/${dayEx.length}`}
                          color={dayDone === dayEx.length && dayEx.length > 0 ? "success" : "default"}
                          sx={{ height: 20, fontSize: 11, fontWeight: 700 }}
                        />
                      )}
                    </Stack>
                  }
                  sx={{ fontWeight: 700, py: 2, minWidth: 130 }}
                />
              );
            })}
          </Tabs>
        </Paper>

        {/* Selected Day Routine Header */}
        <Paper
          elevation={1}
          sx={{
            p: { xs: 2.5, md: 4 },
            borderRadius: "24px",
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", sm: "center" }}
            spacing={2}
            mb={3}
          >
            <Box>
              <TextField
                variant="standard"
                value={currentDayData.title || selectedDay}
                onChange={(e) => setDayTitle(selectedDay, e.target.value)}
                placeholder="Day Focus (e.g. Chest & Back)"
                InputProps={{
                  disableUnderline: false,
                  style: { fontSize: "24px", fontWeight: 800 },
                }}
                sx={{ mb: 1 }}
              />
              <Typography variant="body2" color="text.secondary">
                {currentExercises.length} Exercises Planned • {completedCount} Completed ({progressPercent}%)
              </Typography>
            </Box>

            <Stack direction="row" spacing={1.5}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={() => setIsAddModalOpen(true)}
                sx={{ borderRadius: "14px" }}
              >
                Add Exercise
              </Button>
              {currentExercises.length > 0 && (
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => clearDay(selectedDay)}
                  sx={{ borderRadius: "14px" }}
                >
                  Clear Day
                </Button>
              )}
            </Stack>
          </Stack>

          {/* Day Progress Bar */}
          {currentExercises.length > 0 && (
            <Box mb={4}>
              <LinearProgress
                variant="determinate"
                value={progressPercent}
                color="success"
                sx={{ height: 8, borderRadius: 4 }}
              />
            </Box>
          )}

          {/* Exercise Items List */}
          {currentExercises.length === 0 ? (
            <Box textAlign="center" py={8} px={2}>
              <FitnessCenterIcon sx={{ fontSize: 56, color: "text.secondary", opacity: 0.4, mb: 1 }} />
              <Typography variant="h6" fontWeight={700} gutterBottom>
                No exercises planned for {selectedDay} yet
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={3} maxWidth={450} mx="auto">
                Add exercises from your favorites, search the library, or add custom exercises to plan your workout.
              </Typography>
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={() => setIsAddModalOpen(true)}
              >
                Add Exercise to {selectedDay}
              </Button>
            </Box>
          ) : (
            <Stack spacing={2}>
              {currentExercises.map((exercise, index) => (
                <Paper
                  key={exercise.id || index}
                  elevation={0}
                  sx={{
                    p: 2.5,
                    borderRadius: "18px",
                    bgcolor: exercise.completed ? "background.subtle" : "background.paper",
                    border: "1px solid",
                    borderColor: exercise.completed ? "success.light" : "divider",
                    transition: "all 0.25s ease",
                    opacity: exercise.completed ? 0.75 : 1,
                  }}
                >
                  <Stack
                    direction={{ xs: "column", md: "row" }}
                    justifyContent="space-between"
                    alignItems={{ xs: "flex-start", md: "center" }}
                    spacing={2}
                  >
                    {/* Checkbox and Name */}
                    <Stack direction="row" spacing={2} alignItems="center" flex={1}>
                      <Checkbox
                        checked={exercise.completed}
                        onChange={() => toggleExerciseCompleted(selectedDay, exercise.id)}
                        icon={<RadioButtonUncheckedIcon />}
                        checkedIcon={<CheckCircleIcon color="success" />}
                        sx={{ p: 0.5 }}
                      />

                      {exercise.gifUrl && (
                        <Box
                          component="img"
                          src={exercise.gifUrl}
                          alt={exercise.name}
                          sx={{
                            width: 60,
                            height: 60,
                            borderRadius: "12px",
                            objectFit: "cover",
                          }}
                        />
                      )}

                      <Box>
                        {exercise.id && !String(exercise.id).startsWith("custom-") ? (
                          <Typography
                            component={Link}
                            to={`/exercise/${exercise.id}`}
                            variant="subtitle1"
                            fontWeight={700}
                            sx={{
                              textDecoration: exercise.completed ? "line-through" : "none",
                              color: "text.primary",
                              "&:hover": { color: "primary.main" },
                              textTransform: "capitalize",
                            }}
                          >
                            {exercise.name}
                          </Typography>
                        ) : (
                          <Typography
                            variant="subtitle1"
                            fontWeight={700}
                            sx={{
                              textDecoration: exercise.completed ? "line-through" : "none",
                              textTransform: "capitalize",
                            }}
                          >
                            {exercise.name}
                          </Typography>
                        )}
                        <Stack direction="row" spacing={1} mt={0.5}>
                          {exercise.bodyPart && (
                            <Chip
                              label={exercise.bodyPart}
                              size="small"
                              sx={{ textTransform: "capitalize", height: 22, fontSize: 11 }}
                            />
                          )}
                          {exercise.target && (
                            <Chip
                              label={exercise.target}
                              size="small"
                              color="secondary"
                              sx={{ textTransform: "capitalize", height: 22, fontSize: 11 }}
                            />
                          )}
                        </Stack>
                      </Box>
                    </Stack>

                    {/* Sets / Reps / Weight inputs */}
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <TextField
                        size="small"
                        label="Sets"
                        type="number"
                        value={exercise.sets || ""}
                        onChange={(e) =>
                          updateExerciseDetails(selectedDay, exercise.id, {
                            sets: e.target.value,
                          })
                        }
                        sx={{ width: 75 }}
                      />
                      <TextField
                        size="small"
                        label="Reps"
                        value={exercise.reps || ""}
                        onChange={(e) =>
                          updateExerciseDetails(selectedDay, exercise.id, {
                            reps: e.target.value,
                          })
                        }
                        sx={{ width: 85 }}
                      />
                      <TextField
                        size="small"
                        label="Weight"
                        placeholder="e.g. 30kg"
                        value={exercise.weight || ""}
                        onChange={(e) =>
                          updateExerciseDetails(selectedDay, exercise.id, {
                            weight: e.target.value,
                          })
                        }
                        sx={{ width: 100 }}
                      />
                      <IconButton
                        color="error"
                        onClick={() => removeExerciseFromDay(selectedDay, exercise.id)}
                        size="small"
                      >
                        <DeleteOutlineIcon />
                      </IconButton>
                    </Stack>
                  </Stack>
                </Paper>
              ))}
            </Stack>
          )}
        </Paper>

        {/* Add Exercise Modal Dialog */}
        <Dialog
          open={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          maxWidth="md"
          fullWidth
          PaperProps={{ sx: { borderRadius: "24px", p: 1 } }}
        >
          <DialogTitle sx={{ fontWeight: 800, fontSize: 22 }}>
            Add Exercise to {selectedDay}
          </DialogTitle>
          <DialogContent dividers>
            {/* Option A: Quick Add from Favorites */}
            {favorites.length > 0 && (
              <Box mb={4}>
                <Typography variant="subtitle1" fontWeight={700} gutterBottom>
                  ⭐ Add from Your Favorites:
                </Typography>
                <Grid container spacing={1.5} mt={0.5}>
                  {favorites.map((fav) => (
                    <Grid item xs={12} sm={6} key={fav.id}>
                      <Paper
                        variant="outlined"
                        sx={{
                          p: 1.5,
                          borderRadius: "14px",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Typography
                          variant="body2"
                          fontWeight={600}
                          noWrap
                          sx={{ maxWidth: 180, textTransform: "capitalize" }}
                        >
                          {fav.name}
                        </Typography>
                        <Button
                          size="small"
                          variant="contained"
                          color="primary"
                          onClick={() => handleAddFavoriteToDay(fav)}
                        >
                          + Add
                        </Button>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}

            {/* Option B: Custom Exercise */}
            <Typography variant="subtitle1" fontWeight={700} gutterBottom>
              ✍️ Add Custom Exercise:
            </Typography>
            <form onSubmit={handleAddCustomExercise}>
              <Stack spacing={2} mt={1}>
                <TextField
                  label="Exercise Name"
                  placeholder="e.g. Barbell Incline Bench Press"
                  value={customExerciseName}
                  onChange={(e) => setCustomExerciseName(e.target.value)}
                  fullWidth
                  required
                />
                <Stack direction="row" spacing={2}>
                  <TextField
                    label="Body Part / Muscle"
                    value={customBodyPart}
                    onChange={(e) => setCustomBodyPart(e.target.value)}
                    fullWidth
                  />
                  <TextField
                    label="Target Sets"
                    type="number"
                    value={customSets}
                    onChange={(e) => setCustomSets(e.target.value)}
                    fullWidth
                  />
                  <TextField
                    label="Target Reps"
                    value={customReps}
                    onChange={(e) => setCustomReps(e.target.value)}
                    fullWidth
                  />
                </Stack>
                <TextField
                  label="Target Weight (Optional)"
                  placeholder="e.g. 50 kg"
                  value={customWeight}
                  onChange={(e) => setCustomWeight(e.target.value)}
                  fullWidth
                />
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  sx={{ py: 1.5 }}
                >
                  Save Exercise to {selectedDay}
                </Button>
              </Stack>
            </form>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setIsAddModalOpen(false)}>Close</Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default Planner;
