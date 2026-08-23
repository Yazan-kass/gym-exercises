import React from "react";
import { Typography, Box, Stack, Paper } from "@mui/material";
import PlayCircleFilledWhiteIcon from "@mui/icons-material/PlayCircleFilledWhite";
import Loader from "./Loader";

const ExerciseVideos = ({ exerciseVideos, name }) => {
  const safeVideos = Array.isArray(exerciseVideos) ? exerciseVideos : [];

  if (!safeVideos.length) return <Loader />;

  return (
    <Box sx={{ marginTop: { lg: "120px", xs: "40px" } }} p="20px">
      <Typography
        sx={{ fontSize: { lg: "44px", xs: "25px" } }}
        fontWeight={800}
        color="text.primary"
        mb="33px"
      >
        Watch{" "}
        <span style={{ color: "#FF2625", textTransform: "capitalize" }}>
          {name}
        </span>{" "}
        Exercise Tutorials
      </Typography>

      <Stack
        sx={{
          flexDirection: { lg: "row" },
          gap: { lg: "40px", xs: "20px" },
        }}
        justifyContent="flex-start"
        flexWrap="wrap"
        alignItems="stretch"
      >
        {safeVideos.slice(0, 3).map((item, index) => (
          <Paper
            key={index}
            component="a"
            href={`https://www.youtube.com/watch?v=${item.video.videoId}`}
            target="_blank"
            rel="noreferrer"
            elevation={2}
            className="exercise-video"
            sx={{
              bgcolor: "background.paper",
              border: "1px solid",
              borderColor: "divider",
              borderRadius: "24px",
              overflow: "hidden",
              textDecoration: "none",
              transition: "all 0.3s ease",
              "&:hover": {
                borderColor: "primary.main",
                transform: "translateY(-6px)",
              },
            }}
          >
            <Box position="relative">
              <img
                style={{
                  width: "100%",
                  height: "220px",
                  objectFit: "cover",
                  borderRadius: "16px",
                }}
                src={item.video.thumbnails[0]?.url}
                alt={item.video.title}
              />
              <PlayCircleFilledWhiteIcon
                sx={{
                  position: "absolute",
                  bottom: 12,
                  right: 12,
                  color: "primary.main",
                  fontSize: 40,
                  bgcolor: "rgba(0,0,0,0.6)",
                  borderRadius: "50%",
                }}
              />
            </Box>
            <Box p={1}>
              <Typography
                sx={{ fontSize: { lg: "20px", xs: "16px" } }}
                fontWeight={700}
                color="text.primary"
                noWrap
                title={item.video.title}
              >
                {item.video.title}
              </Typography>
              <Typography fontSize="14px" color="text.secondary" mt={0.5}>
                {item.video.channelName}
              </Typography>
            </Box>
          </Paper>
        ))}
      </Stack>
    </Box>
  );
};

export default ExerciseVideos;
