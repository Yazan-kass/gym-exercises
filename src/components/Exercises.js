import React, { useEffect, useState } from "react";
import Pagination from "@mui/material/Pagination";
import { Box, Stack, Typography, Paper } from "@mui/material";

import { exerciseOptions, fetchData } from "../utils/fetchData";
import ExerciseCard from "./ExerciseCard";
import { ExerciseSkeletonGrid } from "./ExerciseSkeleton";

const Exercises = ({ exercises, setExercises, bodyPart }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const exercisesPerPage = 6;

  useEffect(() => {
    const fetchExercisesData = async () => {
      setLoading(true);
      try {
        let exercisesData = [];

        if (bodyPart === "all") {
          exercisesData = await fetchData(
            "https://exercisedb.p.rapidapi.com/exercises",
            exerciseOptions
          );
        } else {
          exercisesData = await fetchData(
            `https://exercisedb.p.rapidapi.com/exercises/bodyPart/${bodyPart}`,
            exerciseOptions
          );
        }

        if (Array.isArray(exercisesData)) {
          setExercises(exercisesData);
        } else {
          setExercises([]);
        }
      } catch (err) {
        console.error("Error fetching exercises:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchExercisesData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bodyPart]);

  // Safe pagination calculation
  const safeExercises = Array.isArray(exercises) ? exercises : [];
  const indexOfLastExercise = currentPage * exercisesPerPage;
  const indexOfFirstExercise = indexOfLastExercise - exercisesPerPage;
  const currentExercises = safeExercises.slice(
    indexOfFirstExercise,
    indexOfLastExercise
  );

  const paginate = (event, value) => {
    setCurrentPage(value);
    window.scrollTo({ top: 1800, behavior: "smooth" });
  };

  return (
    <Box id="exercises" sx={{ mt: { lg: "100px", xs: "50px" } }} p="20px">
      <Typography
        variant="h3"
        fontWeight={800}
        sx={{ fontSize: { lg: "44px", xs: "28px" } }}
        mb="46px"
        textAlign={{ xs: "center", md: "left" }}
      >
        Showing Results
      </Typography>

      {loading ? (
        <ExerciseSkeletonGrid count={6} />
      ) : safeExercises.length === 0 ? (
        <Paper
          elevation={0}
          sx={{
            py: 8,
            px: 3,
            textAlign: "center",
            borderRadius: "20px",
            border: "1px dashed",
            borderColor: "divider",
          }}
        >
          <Typography variant="h6" color="text.secondary">
            No exercises found. Please try another search or category.
          </Typography>
        </Paper>
      ) : (
        <>
          <Stack
            direction="row"
            sx={{ gap: { lg: "60px", xs: "30px" } }}
            flexWrap="wrap"
            justifyContent="center"
          >
            {currentExercises.map((exercise, idx) => (
              <ExerciseCard key={exercise.id || idx} exercise={exercise} />
            ))}
          </Stack>

          {safeExercises.length > exercisesPerPage && (
            <Stack sx={{ mt: { lg: "100px", xs: "60px" } }} alignItems="center">
              <Pagination
                color="primary"
                shape="rounded"
                count={Math.ceil(safeExercises.length / exercisesPerPage)}
                page={currentPage}
                onChange={paginate}
                size="large"
                sx={{
                  "& .MuiPaginationItem-root": {
                    fontSize: "16px",
                    fontWeight: 700,
                  },
                }}
              />
            </Stack>
          )}
        </>
      )}
    </Box>
  );
};

export default Exercises;
