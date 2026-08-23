import React from "react";
import { Typography, Box, Stack } from "@mui/material";

import HorizontalScrollbar from "./HorizontalScrollbar";
import Loader from "./Loader";

const SimilarExercises = ({ targetMuscleExercises, equipmentExercises }) => {
  const safeTarget = Array.isArray(targetMuscleExercises) ? targetMuscleExercises : [];
  const safeEquipment = Array.isArray(equipmentExercises) ? equipmentExercises : [];

  return (
    <Box sx={{ mt: { lg: "100px", xs: "40px" } }}>
      <Typography
        sx={{ fontSize: { lg: "40px", xs: "24px" }, ml: "20px" }}
        fontWeight={800}
        color="text.primary"
        mb="33px"
      >
        Similar{" "}
        <span style={{ color: "#FF2625", textTransform: "capitalize" }}>
          Target Muscle
        </span>{" "}
        Exercises
      </Typography>
      <Stack direction="row" sx={{ p: 2, position: "relative" }}>
        {safeTarget.length !== 0 ? (
          <HorizontalScrollbar data={safeTarget} />
        ) : (
          <Loader />
        )}
      </Stack>

      <Typography
        sx={{
          fontSize: { lg: "40px", xs: "24px" },
          ml: "20px",
          mt: { lg: "100px", xs: "60px" },
        }}
        fontWeight={800}
        color="text.primary"
        mb="33px"
      >
        Similar{" "}
        <span style={{ color: "#FF2625", textTransform: "capitalize" }}>
          Equipment
        </span>{" "}
        Exercises
      </Typography>
      <Stack direction="row" sx={{ p: 2, position: "relative" }}>
        {safeEquipment.length !== 0 ? (
          <HorizontalScrollbar data={safeEquipment} />
        ) : (
          <Loader />
        )}
      </Stack>
    </Box>
  );
};

export default SimilarExercises;
