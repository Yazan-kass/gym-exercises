import React from "react";
import { Stack, Typography, Box } from "@mui/material";
import Icon from "../assets/icons/gym.png";

const BodyPart = ({ item, setBodyPart, bodyPart }) => {
  const isSelected = bodyPart === item;

  return (
    <Stack
      alignItems="center"
      justifyContent="center"
      className="bodyPart-card"
      sx={{
        bgcolor: "background.paper",
        borderTop: isSelected ? "4px solid #FF2625" : "4px solid transparent",
        border: "1px solid",
        borderColor: isSelected ? "primary.main" : "divider",
        borderRadius: "24px",
        width: { lg: "260px", xs: "220px" },
        height: { lg: "260px", xs: "220px" },
        cursor: "pointer",
        gap: "30px",
        boxShadow: (theme) =>
          isSelected
            ? theme.palette.mode === "dark"
              ? "0 10px 30px rgba(255, 38, 37, 0.3)"
              : "0 10px 30px rgba(255, 38, 37, 0.2)"
            : theme.palette.mode === "dark"
            ? "0 8px 24px rgba(0,0,0,0.4)"
            : "0 8px 24px rgba(0,0,0,0.04)",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        "&:hover": {
          borderColor: "primary.main",
          transform: "translateY(-6px)",
        },
      }}
      onClick={() => {
        setBodyPart(item);
        window.scrollTo({ top: 1800, left: 100, behavior: "smooth" });
      }}
    >
      <Box
        sx={{
          p: 2,
          borderRadius: "50%",
          bgcolor: isSelected ? "rgba(255, 38, 37, 0.15)" : "background.subtle",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <img
          src={Icon}
          alt="dumbbell icon"
          style={{ width: "45px", height: "45px" }}
        />
      </Box>

      <Typography
        fontSize="22px"
        fontWeight="bold"
        color={isSelected ? "primary.main" : "text.primary"}
        textTransform="capitalize"
        letterSpacing="0.5px"
      >
        {item}
      </Typography>
    </Stack>
  );
};

export default BodyPart;
