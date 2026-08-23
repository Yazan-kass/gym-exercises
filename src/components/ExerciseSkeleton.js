import React from "react";
import { Box, Skeleton, Stack } from "@mui/material";

export const ExerciseSkeletonCard = () => (
  <Box
    sx={{
      width: { lg: "400px", sm: "320px", xs: "280px" },
      height: "445px",
      borderRadius: "20px",
      overflow: "hidden",
      bgcolor: "background.paper",
      p: "16px",
      boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
    }}
  >
    <Skeleton
      variant="rectangular"
      width="100%"
      height="300px"
      sx={{ borderRadius: "16px" }}
      animation="wave"
    />
    <Stack direction="row" spacing={1} mt={2}>
      <Skeleton
        variant="rounded"
        width="80px"
        height="32px"
        sx={{ borderRadius: "20px" }}
        animation="wave"
      />
      <Skeleton
        variant="rounded"
        width="80px"
        height="32px"
        sx={{ borderRadius: "20px" }}
        animation="wave"
      />
    </Stack>
    <Skeleton
      variant="text"
      width="70%"
      height="36px"
      sx={{ mt: 1, borderRadius: "8px" }}
      animation="wave"
    />
  </Box>
);

export const ExerciseSkeletonGrid = ({ count = 6 }) => (
  <Stack
    direction="row"
    sx={{ gap: { lg: "107px", xs: "50px" } }}
    flexWrap="wrap"
    justifyContent="center"
    py={4}
  >
    {Array.from({ length: count }).map((_, index) => (
      <ExerciseSkeletonCard key={index} />
    ))}
  </Stack>
);

export default ExerciseSkeletonGrid;
