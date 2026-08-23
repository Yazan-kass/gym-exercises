import React, { useEffect, useState } from "react";
import { Box, Button, Stack, TextField, Typography, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

import { exerciseOptions, fetchData } from "../utils/fetchData";
import HorizontalScrollbar from "./HorizontalScrollbar";

const SearchExercises = ({ setExercises, bodyPart, setBodyPart }) => {
  const [search, setSearch] = useState("");
  const [bodyParts, setBodyParts] = useState([]);

  useEffect(() => {
    const fetchExercisesData = async () => {
      try {
        const bodyPartsData = await fetchData(
          "https://exercisedb.p.rapidapi.com/exercises/bodyPartList",
          exerciseOptions
        );

        if (Array.isArray(bodyPartsData)) {
          setBodyParts(["all", ...bodyPartsData]);
        } else {
          setBodyParts(["all"]);
        }
      } catch (e) {
        console.error("Error fetching body parts:", e);
        setBodyParts(["all"]);
      }
    };

    fetchExercisesData();
  }, []);

  const handleSearch = async () => {
    if (search.trim()) {
      try {
        const exercisesData = await fetchData(
          "https://exercisedb.p.rapidapi.com/exercises",
          exerciseOptions
        );

        if (Array.isArray(exercisesData)) {
          const searchedExercises = exercisesData.filter(
            (item) =>
              (item.name && item.name.toLowerCase().includes(search.toLowerCase())) ||
              (item.target && item.target.toLowerCase().includes(search.toLowerCase())) ||
              (item.equipment && item.equipment.toLowerCase().includes(search.toLowerCase())) ||
              (item.bodyPart && item.bodyPart.toLowerCase().includes(search.toLowerCase()))
          );

          window.scrollTo({ top: 1800, left: 100, behavior: "smooth" });
          setSearch("");
          setExercises(searchedExercises);
        }
      } catch (e) {
        console.error("Error searching exercises:", e);
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <Stack alignItems="center" mt="37px" justifyContent="center" p="20px">
      <Typography
        fontWeight={800}
        sx={{ fontSize: { lg: "44px", xs: "28px" } }}
        mb="40px"
        textAlign="center"
        color="text.primary"
      >
        Awesome Exercises You <br />
        <span style={{ color: "#FF2625" }}>Should Know</span>
      </Typography>

      <Box
        position="relative"
        mb="72px"
        sx={{ width: { lg: "1000px", md: "750px", sm: "550px", xs: "100%" } }}
      >
        <TextField
          fullWidth
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search by exercise, muscle (e.g. chest, abs, biceps), or equipment..."
          type="text"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: "text.secondary", ml: 1, mr: 0.5 }} />
              </InputAdornment>
            ),
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              bgcolor: "background.paper",
              borderRadius: "40px",
              pr: { lg: "160px", xs: "90px" },
              height: "64px",
              boxShadow: "0 8px 30px rgba(0,0,0,0.06)",
              fontSize: { lg: "18px", xs: "15px" },
              fontWeight: 600,
            },
          }}
        />
        <Button
          className="search-btn"
          variant="contained"
          color="primary"
          sx={{
            width: { lg: "140px", xs: "80px" },
            height: "50px",
            position: "absolute",
            right: "7px",
            top: "7px",
            fontSize: { lg: "16px", xs: "14px" },
            fontWeight: 700,
            borderRadius: "30px",
          }}
          onClick={handleSearch}
        >
          Search
        </Button>
      </Box>

      <Box sx={{ position: "relative", width: "100%", p: "20px" }}>
        <HorizontalScrollbar
          data={bodyParts}
          bodyParts
          setBodyPart={setBodyPart}
          bodyPart={bodyPart}
        />
      </Box>
    </Stack>
  );
};

export default SearchExercises;
