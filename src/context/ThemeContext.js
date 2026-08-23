import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

const ThemeContext = createContext();

export const useThemeMode = () => useContext(ThemeContext);

export const CustomThemeProvider = ({ children }) => {
  const [mode, setMode] = useState(() => {
    const saved = localStorage.getItem("gym_theme_mode");
    return saved ? saved : "dark"; // Default to dark for modern fitness vibe
  });

  useEffect(() => {
    localStorage.setItem("gym_theme_mode", mode);
    document.documentElement.setAttribute("data-theme", mode);
  }, [mode]);

  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
  };

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: "#FF2625",
            light: "#FF5E5D",
            dark: "#C71817",
            contrastText: "#FFFFFF",
          },
          secondary: {
            main: "#FCC757",
            light: "#FEDD89",
            dark: "#D6A330",
            contrastText: "#1A1A24",
          },
          background: {
            default: mode === "dark" ? "#0D0D12" : "#FAFAFC",
            paper: mode === "dark" ? "#161622" : "#FFFFFF",
          },
          text: {
            primary: mode === "dark" ? "#F5F5FA" : "#1A1A24",
            secondary: mode === "dark" ? "#A0A0B8" : "#555566",
          },
          divider: mode === "dark" ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.08)",
        },
        typography: {
          fontFamily: "'Josefin Sans', 'Alegreya', -apple-system, BlinkMacSystemFont, sans-serif",
          h1: { fontWeight: 700 },
          h2: { fontWeight: 700 },
          h3: { fontWeight: 700 },
          h4: { fontWeight: 700 },
          h5: { fontWeight: 600 },
          h6: { fontWeight: 600 },
        },
        shape: {
          borderRadius: 16,
        },
        components: {
          MuiButton: {
            styleOverrides: {
              root: {
                textTransform: "none",
                borderRadius: "30px",
                fontWeight: 600,
              },
            },
          },
          MuiCard: {
            styleOverrides: {
              root: {
                borderRadius: "20px",
                backgroundImage: "none",
              },
            },
          },
        },
      }),
    [mode]
  );

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};
