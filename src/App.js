import React from "react";
import { Route, Routes } from "react-router-dom";
import { Box } from "@mui/material";

import "./App.css";
import { CustomThemeProvider } from "./context/ThemeContext";
import { FavoritesProvider } from "./context/FavoritesContext";
import { PlannerProvider } from "./context/PlannerContext";

import Home from "./pages/Home";
import ExerciseDetail from "./pages/ExerciseDetail";
import Favorites from "./pages/Favorites";
import Calculator from "./pages/Calculator";
import Planner from "./pages/Planner";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import WorkoutTimer from "./components/WorkoutTimer";

const App = () => (
  <CustomThemeProvider>
    <FavoritesProvider>
      <PlannerProvider>
        <Box width="100%" maxWidth="1488px" m="auto" minHeight="100vh" display="flex" flexDirection="column">
          <Navbar />
          <Box flex={1}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/exercise/:id" element={<ExerciseDetail />} />
              <Route path="/favorites" element={<Favorites />} />
              <Route path="/calculator" element={<Calculator />} />
              <Route path="/planner" element={<Planner />} />
            </Routes>
          </Box>
          <WorkoutTimer />
          <Footer />
        </Box>
      </PlannerProvider>
    </FavoritesProvider>
  </CustomThemeProvider>
);

export default App;
