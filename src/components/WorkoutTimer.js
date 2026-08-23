import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Button,
  Stack,
  Tabs,
  Tab,
  CircularProgress,
  Badge,
  Tooltip,
  Fade,
  Chip,
} from "@mui/material";
import TimerIcon from "@mui/icons-material/Timer";
import CloseIcon from "@mui/icons-material/Close";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import FlagIcon from "@mui/icons-material/Flag";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";

// Sound synthesizer using Web Audio API
const playBeep = (freq = 880, duration = 0.15, count = 1) => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();

    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + duration);
      }, i * 180);
    }
  } catch (e) {
    // AudioContext blocked or not supported
  }
};

const WorkoutTimer = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  // === 1. Rest Timer State ===
  const [restDuration, setRestDuration] = useState(60);
  const [restTimeLeft, setRestTimeLeft] = useState(60);
  const [isRestRunning, setIsRestRunning] = useState(false);

  // === 2. Stopwatch State ===
  const [stopwatchTime, setStopwatchTime] = useState(0);
  const [isStopwatchRunning, setIsStopwatchRunning] = useState(false);
  const [laps, setLaps] = useState([]);

  // === 3. Tabata / Interval State ===
  const [tabataWork, setTabataWork] = useState(20);
  const [tabataRest, setTabataRest] = useState(10);
  const [tabataRounds, setTabataRounds] = useState(8);
  const [currentRound, setCurrentRound] = useState(1);
  const [tabataPhase, setTabataPhase] = useState("work"); // 'work' | 'rest' | 'complete'
  const [tabataTimeLeft, setTabataTimeLeft] = useState(20);
  const [isTabataRunning, setIsTabataRunning] = useState(false);

  const restTimerRef = useRef(null);
  const stopwatchRef = useRef(null);
  const tabataRef = useRef(null);

  // Rest Timer Interval
  useEffect(() => {
    if (isRestRunning) {
      restTimerRef.current = setInterval(() => {
        setRestTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(restTimerRef.current);
            setIsRestRunning(false);
            playBeep(920, 0.25, 3); // 3 beeps on finish
            return 0;
          }
          if (prev <= 4) {
            playBeep(440, 0.08, 1); // warning beep for last 3 seconds
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(restTimerRef.current);
    }
    return () => clearInterval(restTimerRef.current);
  }, [isRestRunning]);

  // Stopwatch Interval
  useEffect(() => {
    if (isStopwatchRunning) {
      stopwatchRef.current = setInterval(() => {
        setStopwatchTime((prev) => prev + 10);
      }, 10);
    } else {
      clearInterval(stopwatchRef.current);
    }
    return () => clearInterval(stopwatchRef.current);
  }, [isStopwatchRunning]);

  // Tabata Interval
  useEffect(() => {
    if (isTabataRunning) {
      tabataRef.current = setInterval(() => {
        setTabataTimeLeft((prev) => {
          if (prev <= 1) {
            if (tabataPhase === "work") {
              setTabataPhase("rest");
              playBeep(600, 0.2, 2);
              return tabataRest;
            } else if (tabataPhase === "rest") {
              if (currentRound < tabataRounds) {
                setCurrentRound((r) => r + 1);
                setTabataPhase("work");
                playBeep(900, 0.2, 1);
                return tabataWork;
              } else {
                setTabataPhase("complete");
                setIsTabataRunning(false);
                playBeep(1000, 0.3, 4);
                return 0;
              }
            }
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(tabataRef.current);
    }
    return () => clearInterval(tabataRef.current);
  }, [isTabataRunning, tabataPhase, currentRound, tabataRounds, tabataWork, tabataRest]);

  // Rest Timer Controls
  const handleSelectPreset = (seconds) => {
    setRestDuration(seconds);
    setRestTimeLeft(seconds);
    setIsRestRunning(false);
  };

  const handleToggleRest = () => {
    if (restTimeLeft === 0) setRestTimeLeft(restDuration);
    setIsRestRunning(!isRestRunning);
  };

  const handleResetRest = () => {
    setIsRestRunning(false);
    setRestTimeLeft(restDuration);
  };

  // Stopwatch formatting
  const formatStopwatch = (timeMs) => {
    const minutes = Math.floor(timeMs / 60000);
    const seconds = Math.floor((timeMs % 60000) / 1000);
    const ms = Math.floor((timeMs % 1000) / 10);
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )}.${String(ms).padStart(2, "0")}`;
  };

  const handleAddLap = () => {
    setLaps((prev) => [
      { id: Date.now(), lapNum: prev.length + 1, time: formatStopwatch(stopwatchTime) },
      ...prev,
    ]);
  };

  const handleResetStopwatch = () => {
    setIsStopwatchRunning(false);
    setStopwatchTime(0);
    setLaps([]);
  };

  // Tabata Controls
  const handleResetTabata = () => {
    setIsTabataRunning(false);
    setCurrentRound(1);
    setTabataPhase("work");
    setTabataTimeLeft(tabataWork);
  };

  const isAnyTimerRunning = isRestRunning || isStopwatchRunning || isTabataRunning;

  return (
    <>
      {/* Floating Toggle Button */}
      <Box
        sx={{
          position: "fixed",
          bottom: { xs: 20, md: 30 },
          right: { xs: 20, md: 30 },
          zIndex: 1300,
        }}
      >
        <Tooltip title="Workout & Rest Timer" placement="left">
          <IconButton
            onClick={() => setIsOpen(!isOpen)}
            sx={{
              width: 58,
              height: 58,
              bgcolor: isAnyTimerRunning ? "primary.main" : "background.paper",
              color: isAnyTimerRunning ? "#fff" : "primary.main",
              boxShadow: "0 8px 30px rgba(255, 38, 37, 0.35)",
              border: "2px solid",
              borderColor: "primary.main",
              transition: "all 0.3s ease",
              "&:hover": {
                bgcolor: "primary.main",
                color: "#fff",
                transform: "scale(1.08)",
              },
            }}
          >
            <Badge
              color="secondary"
              variant="dot"
              invisible={!isAnyTimerRunning}
            >
              <TimerIcon sx={{ fontSize: 30 }} />
            </Badge>
          </IconButton>
        </Tooltip>
      </Box>

      {/* Expanded Timer Card */}
      <Fade in={isOpen}>
        <Paper
          elevation={12}
          sx={{
            display: isOpen ? "block" : "none",
            position: "fixed",
            bottom: { xs: 85, md: 100 },
            right: { xs: 15, md: 30 },
            width: { xs: "calc(100vw - 30px)", sm: 380 },
            maxWidth: 380,
            borderRadius: "24px",
            overflow: "hidden",
            zIndex: 1300,
            bgcolor: "background.paper",
            border: "1px solid",
            borderColor: "divider",
            boxShadow: "0 20px 50px rgba(0,0,0,0.3)",
          }}
        >
          {/* Header */}
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            px={2.5}
            py={1.5}
            sx={{
              background: (theme) =>
                theme.palette.mode === "dark"
                  ? "linear-gradient(135deg, #1F1F2E 0%, #161622 100%)"
                  : "linear-gradient(135deg, #FFF3F4 0%, #FFFFFF 100%)",
              borderBottom: "1px solid",
              borderColor: "divider",
            }}
          >
            <Stack direction="row" spacing={1} alignItems="center">
              <FitnessCenterIcon sx={{ color: "primary.main", fontSize: 22 }} />
              <Typography variant="subtitle1" fontWeight={700}>
                Workout Timer
              </Typography>
            </Stack>
            <IconButton size="small" onClick={() => setIsOpen(false)}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Stack>

          {/* Mode Tabs */}
          <Tabs
            value={activeTab}
            onChange={(e, val) => setActiveTab(val)}
            variant="fullWidth"
            textColor="primary"
            indicatorColor="primary"
            sx={{ borderBottom: "1px solid", borderColor: "divider" }}
          >
            <Tab label="Rest Timer" sx={{ fontSize: 13, fontWeight: 600 }} />
            <Tab label="Stopwatch" sx={{ fontSize: 13, fontWeight: 600 }} />
            <Tab label="HIIT / Tabata" sx={{ fontSize: 13, fontWeight: 600 }} />
          </Tabs>

          <Box p={2.5}>
            {/* TAB 0: REST TIMER */}
            {activeTab === 0 && (
              <Stack spacing={2.5} alignItems="center">
                {/* Circular Countdown Display */}
                <Box position="relative" display="inline-flex">
                  <CircularProgress
                    variant="determinate"
                    value={
                      restDuration > 0
                        ? ((restDuration - restTimeLeft) / restDuration) * 100
                        : 0
                    }
                    size={140}
                    thickness={4.5}
                    sx={{ color: "primary.main" }}
                  />
                  <Box
                    sx={{
                      top: 0,
                      left: 0,
                      bottom: 0,
                      right: 0,
                      position: "absolute",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Typography
                      variant="h3"
                      fontWeight={700}
                      color={restTimeLeft === 0 ? "error.main" : "text.primary"}
                    >
                      {restTimeLeft}s
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {isRestRunning ? "Resting..." : "Rest Time"}
                    </Typography>
                  </Box>
                </Box>

                {/* Preset Chips */}
                <Stack direction="row" spacing={1} flexWrap="wrap" justifyContent="center">
                  {[30, 45, 60, 90, 120].map((sec) => (
                    <Chip
                      key={sec}
                      label={`${sec}s`}
                      clickable
                      color={restDuration === sec ? "primary" : "default"}
                      variant={restDuration === sec ? "filled" : "outlined"}
                      onClick={() => handleSelectPreset(sec)}
                      size="small"
                      sx={{ fontWeight: 600 }}
                    />
                  ))}
                </Stack>

                {/* Controls */}
                <Stack direction="row" spacing={2} width="100%">
                  <Button
                    variant="contained"
                    fullWidth
                    size="large"
                    color="primary"
                    startIcon={isRestRunning ? <PauseIcon /> : <PlayArrowIcon />}
                    onClick={handleToggleRest}
                    sx={{ py: 1.2 }}
                  >
                    {isRestRunning ? "Pause" : "Start Rest"}
                  </Button>
                  <IconButton
                    onClick={handleResetRest}
                    sx={{
                      border: "1px solid",
                      borderColor: "divider",
                      borderRadius: "14px",
                    }}
                  >
                    <RestartAltIcon />
                  </IconButton>
                </Stack>
              </Stack>
            )}

            {/* TAB 1: STOPWATCH */}
            {activeTab === 1 && (
              <Stack spacing={2.5} alignItems="center">
                <Typography
                  variant="h3"
                  fontWeight={700}
                  fontFamily="monospace"
                  sx={{ letterSpacing: 2, color: "text.primary" }}
                >
                  {formatStopwatch(stopwatchTime)}
                </Typography>

                <Stack direction="row" spacing={1.5} width="100%">
                  <Button
                    variant="contained"
                    fullWidth
                    color="primary"
                    startIcon={isStopwatchRunning ? <PauseIcon /> : <PlayArrowIcon />}
                    onClick={() => setIsStopwatchRunning(!isStopwatchRunning)}
                  >
                    {isStopwatchRunning ? "Pause" : "Start"}
                  </Button>
                  {isStopwatchRunning && (
                    <Button
                      variant="outlined"
                      color="secondary"
                      startIcon={<FlagIcon />}
                      onClick={handleAddLap}
                    >
                      Lap
                    </Button>
                  )}
                  <IconButton
                    onClick={handleResetStopwatch}
                    sx={{
                      border: "1px solid",
                      borderColor: "divider",
                      borderRadius: "14px",
                    }}
                  >
                    <RestartAltIcon />
                  </IconButton>
                </Stack>

                {/* Laps List */}
                {laps.length > 0 && (
                  <Box
                    sx={{
                      width: "100%",
                      maxHeight: 120,
                      overflowY: "auto",
                      borderTop: "1px solid",
                      borderColor: "divider",
                      pt: 1,
                    }}
                  >
                    {laps.map((lap) => (
                      <Stack
                        key={lap.id}
                        direction="row"
                        justifyContent="space-between"
                        py={0.5}
                        px={1}
                      >
                        <Typography variant="body2" color="text.secondary">
                          Lap {lap.lapNum}
                        </Typography>
                        <Typography variant="body2" fontWeight={600} fontFamily="monospace">
                          {lap.time}
                        </Typography>
                      </Stack>
                    ))}
                  </Box>
                )}
              </Stack>
            )}

            {/* TAB 2: TABATA / HIIT */}
            {activeTab === 2 && (
              <Stack spacing={2} alignItems="center">
                <Stack direction="row" spacing={2} width="100%" justifyContent="space-around">
                  <Box textAlign="center">
                    <Typography variant="caption" color="text.secondary">
                      Round
                    </Typography>
                    <Typography variant="h5" fontWeight={700}>
                      {currentRound} / {tabataRounds}
                    </Typography>
                  </Box>
                  <Box textAlign="center">
                    <Typography variant="caption" color="text.secondary">
                      Phase
                    </Typography>
                    <Typography
                      variant="h5"
                      fontWeight={700}
                      color={
                        tabataPhase === "work"
                          ? "primary.main"
                          : tabataPhase === "rest"
                          ? "secondary.main"
                          : "success.main"
                      }
                      textTransform="uppercase"
                    >
                      {tabataPhase}
                    </Typography>
                  </Box>
                </Stack>

                {/* Timer Countdown */}
                <Typography
                  variant="h2"
                  fontWeight={800}
                  color={tabataPhase === "work" ? "primary.main" : "secondary.main"}
                >
                  {tabataTimeLeft}s
                </Typography>

                {/* Controls */}
                <Stack direction="row" spacing={2} width="100%">
                  <Button
                    variant="contained"
                    fullWidth
                    color="primary"
                    disabled={tabataPhase === "complete"}
                    startIcon={isTabataRunning ? <PauseIcon /> : <PlayArrowIcon />}
                    onClick={() => setIsTabataRunning(!isTabataRunning)}
                  >
                    {isTabataRunning ? "Pause" : "Start HIIT"}
                  </Button>
                  <IconButton
                    onClick={handleResetTabata}
                    sx={{
                      border: "1px solid",
                      borderColor: "divider",
                      borderRadius: "14px",
                    }}
                  >
                    <RestartAltIcon />
                  </IconButton>
                </Stack>

                {/* Quick Interval Setup */}
                {!isTabataRunning && currentRound === 1 && (
                  <Stack direction="row" spacing={1} justifyContent="center">
                    <Chip
                      label={`Work: ${tabataWork}s`}
                      size="small"
                      onClick={() => setTabataWork(tabataWork === 20 ? 30 : tabataWork === 30 ? 45 : 20)}
                    />
                    <Chip
                      label={`Rest: ${tabataRest}s`}
                      size="small"
                      onClick={() => setTabataRest(tabataRest === 10 ? 15 : tabataRest === 15 ? 20 : 10)}
                    />
                    <Chip
                      label={`Rounds: ${tabataRounds}`}
                      size="small"
                      onClick={() => setTabataRounds(tabataRounds === 8 ? 6 : tabataRounds === 6 ? 10 : 8)}
                    />
                  </Stack>
                )}
              </Stack>
            )}
          </Box>
        </Paper>
      </Fade>
    </>
  );
};

export default WorkoutTimer;
