import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Tabs,
  Tab,
  Stack,
  TextField,
  Button,
  RadioGroup,
  FormControlLabel,
  Radio,
  MenuItem,
  LinearProgress,
  Divider,
  Chip,
} from "@mui/material";
import CalculateIcon from "@mui/icons-material/Calculate";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import MonitorWeightIcon from "@mui/icons-material/MonitorWeight";

const Calculator = () => {
  const [tabIndex, setTabIndex] = useState(0);

  // === 1. BMI State ===
  const [bmiHeight, setBmiHeight] = useState("175");
  const [bmiWeight, setBmiWeight] = useState("75");
  const [bmiResult, setBmiResult] = useState(null);

  // === 2. Calorie & Macro State ===
  const [calAge, setCalAge] = useState("25");
  const [calGender, setCalGender] = useState("male");
  const [calHeight, setCalHeight] = useState("178");
  const [calWeight, setCalWeight] = useState("78");
  const [calActivity, setCalActivity] = useState("1.55"); // Moderate
  const [calGoal, setCalGoal] = useState("maintain");
  const [calResult, setCalResult] = useState(null);

  // === 3. 1RM State ===
  const [ormWeight, setOrmWeight] = useState("80");
  const [ormReps, setOrmReps] = useState("6");
  const [ormResult, setOrmResult] = useState(null);

  // Calculate BMI
  const handleCalculateBMI = (e) => {
    e.preventDefault();
    const hMeters = parseFloat(bmiHeight) / 100;
    const wKg = parseFloat(bmiWeight);
    if (!hMeters || !wKg || hMeters <= 0 || wKg <= 0) return;

    const bmi = +(wKg / (hMeters * hMeters)).toFixed(1);
    let category = "";
    let color = "success";
    let message = "";

    if (bmi < 18.5) {
      category = "Underweight";
      color = "info";
      message = "You may need to focus on calorie surplus and strength training for healthy mass gain.";
    } else if (bmi >= 18.5 && bmi <= 24.9) {
      category = "Normal Weight";
      color = "success";
      message = "Great job! You have a healthy body weight. Maintain with balanced nutrition and consistent exercise.";
    } else if (bmi >= 25 && bmi <= 29.9) {
      category = "Overweight";
      color = "warning";
      message = "Focus on a slight calorie deficit, cardio workouts, and progressive resistance training.";
    } else {
      category = "Obese";
      color = "error";
      message = "We recommend consulting a healthcare provider and starting with low-impact structured fitness routines.";
    }

    const minHealthyWeight = +(18.5 * hMeters * hMeters).toFixed(1);
    const maxHealthyWeight = +(24.9 * hMeters * hMeters).toFixed(1);

    setBmiResult({
      bmi,
      category,
      color,
      message,
      healthyRange: `${minHealthyWeight} kg - ${maxHealthyWeight} kg`,
    });
  };

  // Calculate Daily Calories & Macros
  const handleCalculateCalories = (e) => {
    e.preventDefault();
    const age = parseInt(calAge, 10);
    const weight = parseFloat(calWeight);
    const height = parseFloat(calHeight);
    const activity = parseFloat(calActivity);

    if (!age || !weight || !height) return;

    // Mifflin-St Jeor Formula for BMR
    let bmr = 10 * weight + 6.25 * height - 5 * age;
    bmr = calGender === "male" ? bmr + 5 : bmr - 161;

    const tdee = Math.round(bmr * activity);

    let targetCalories = tdee;
    if (calGoal === "weight_loss") targetCalories = Math.round(tdee - 500);
    else if (calGoal === "mild_cut") targetCalories = Math.round(tdee - 250);
    else if (calGoal === "lean_bulk") targetCalories = Math.round(tdee + 300);
    else if (calGoal === "bulk") targetCalories = Math.round(tdee + 500);

    // Calculate Macros (e.g. 2g protein per kg, 25% fats, rest carbs)
    const proteinGrams = Math.round(weight * 2.0);
    const proteinCalories = proteinGrams * 4;

    const fatCalories = Math.round(targetCalories * 0.25);
    const fatGrams = Math.round(fatCalories / 9);

    const carbCalories = Math.max(0, targetCalories - proteinCalories - fatCalories);
    const carbGrams = Math.round(carbCalories / 4);

    setCalResult({
      bmr: Math.round(bmr),
      tdee,
      targetCalories,
      proteinGrams,
      fatGrams,
      carbGrams,
    });
  };

  // Calculate 1RM
  const handleCalculate1RM = (e) => {
    e.preventDefault();
    const w = parseFloat(ormWeight);
    const r = parseInt(ormReps, 10);
    if (!w || !r || r < 1 || r > 15) return;

    // Brzycki formula: 1RM = Weight / (1.0278 - 0.0278 * Reps)
    const oneRepMax = Math.round(w / (1.0278 - 0.0278 * r));

    // Percentages table
    const table = [
      { percentage: "100%", reps: "1 Rep (Max)", weight: oneRepMax },
      { percentage: "95%", reps: "2 Reps", weight: Math.round(oneRepMax * 0.95) },
      { percentage: "90%", reps: "4 Reps", weight: Math.round(oneRepMax * 0.9) },
      { percentage: "85%", reps: "6 Reps", weight: Math.round(oneRepMax * 0.85) },
      { percentage: "80%", reps: "8 Reps", weight: Math.round(oneRepMax * 0.8) },
      { percentage: "75%", reps: "10 Reps", weight: Math.round(oneRepMax * 0.75) },
      { percentage: "70%", reps: "12 Reps", weight: Math.round(oneRepMax * 0.7) },
    ];

    setOrmResult({ oneRepMax, table });
  };

  return (
    <Box minHeight="85vh" py={5} px={{ xs: 2, md: 4 }}>
      <Container maxWidth="lg">
        {/* Title Header */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, md: 4 },
            borderRadius: "28px",
            background: (theme) =>
              theme.palette.mode === "dark"
                ? "linear-gradient(135deg, #1A1A24 0%, #12121A 100%)"
                : "linear-gradient(135deg, #FFF3F4 0%, #FFFFFF 100%)",
            border: "1px solid",
            borderColor: "divider",
            mb: 4,
            textAlign: "center",
          }}
        >
          <Stack direction="row" spacing={1.5} justifyContent="center" alignItems="center" mb={1}>
            <CalculateIcon sx={{ color: "primary.main", fontSize: 36 }} />
            <Typography variant="h3" fontWeight={800}>
              Fitness Calculators
            </Typography>
          </Stack>
          <Typography variant="body1" color="text.secondary" maxWidth={600} mx="auto">
            Calculate your Body Mass Index (BMI), Daily Calorie and Macro requirements (TDEE),
            and One Rep Max (1RM) to optimize your fitness progress.
          </Typography>
        </Paper>

        {/* Tabs navigation */}
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
            value={tabIndex}
            onChange={(e, val) => setTabIndex(val)}
            variant="fullWidth"
            textColor="primary"
            indicatorColor="primary"
          >
            <Tab
              icon={<MonitorWeightIcon />}
              iconPosition="start"
              label="BMI Calculator"
              sx={{ fontWeight: 700, py: 2 }}
            />
            <Tab
              icon={<LocalFireDepartmentIcon />}
              iconPosition="start"
              label="Calories & Macros (TDEE)"
              sx={{ fontWeight: 700, py: 2 }}
            />
            <Tab
              icon={<FitnessCenterIcon />}
              iconPosition="start"
              label="1RM Strength Calculator"
              sx={{ fontWeight: 700, py: 2 }}
            />
          </Tabs>
        </Paper>

        {/* TAB 0: BMI CALCULATOR */}
        {tabIndex === 0 && (
          <Paper
            elevation={2}
            sx={{
              p: { xs: 3, md: 5 },
              borderRadius: "24px",
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <Stack direction={{ xs: "column", md: "row" }} spacing={5}>
              <Box flex={1}>
                <Typography variant="h5" fontWeight={700} gutterBottom>
                  Enter Your Body Stats
                </Typography>
                <form onSubmit={handleCalculateBMI}>
                  <Stack spacing={3} mt={3}>
                    <TextField
                      label="Height (cm)"
                      type="number"
                      value={bmiHeight}
                      onChange={(e) => setBmiHeight(e.target.value)}
                      required
                      fullWidth
                    />
                    <TextField
                      label="Weight (kg)"
                      type="number"
                      value={bmiWeight}
                      onChange={(e) => setBmiWeight(e.target.value)}
                      required
                      fullWidth
                    />
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      size="large"
                      sx={{ py: 1.5, fontSize: 16 }}
                    >
                      Calculate BMI
                    </Button>
                  </Stack>
                </form>
              </Box>

              {/* Result display */}
              <Box
                flex={1}
                sx={{
                  bgcolor: "background.subtle",
                  p: 4,
                  borderRadius: "20px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  textAlign: "center",
                  border: "1px solid",
                  borderColor: "divider",
                }}
              >
                {bmiResult ? (
                  <Stack spacing={2} alignItems="center" width="100%">
                    <Typography variant="body2" color="text.secondary" fontWeight={600}>
                      YOUR BODY MASS INDEX
                    </Typography>
                    <Typography
                      variant="h2"
                      fontWeight={800}
                      color={`${bmiResult.color}.main`}
                    >
                      {bmiResult.bmi}
                    </Typography>
                    <Chip
                      label={bmiResult.category}
                      color={bmiResult.color}
                      sx={{ fontWeight: 700, fontSize: 16, py: 2, px: 1 }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      Healthy Weight for your height: <strong>{bmiResult.healthyRange}</strong>
                    </Typography>
                    <Divider sx={{ width: "100%", my: 1 }} />
                    <Typography variant="body2" color="text.primary">
                      {bmiResult.message}
                    </Typography>
                  </Stack>
                ) : (
                  <Stack spacing={1} alignItems="center">
                    <MonitorWeightIcon sx={{ fontSize: 50, color: "text.secondary", opacity: 0.5 }} />
                    <Typography variant="body1" color="text.secondary">
                      Enter your height and weight and press Calculate to view your BMI and recommendations.
                    </Typography>
                  </Stack>
                )}
              </Box>
            </Stack>
          </Paper>
        )}

        {/* TAB 1: CALORIES & MACROS */}
        {tabIndex === 1 && (
          <Paper
            elevation={2}
            sx={{
              p: { xs: 3, md: 5 },
              borderRadius: "24px",
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <Stack direction={{ xs: "column", md: "row" }} spacing={5}>
              <Box flex={1}>
                <Typography variant="h5" fontWeight={700} gutterBottom>
                  Daily Energy & Macro Calculator
                </Typography>
                <form onSubmit={handleCalculateCalories}>
                  <Stack spacing={2.5} mt={3}>
                    <Stack direction="row" spacing={2}>
                      <TextField
                        label="Age"
                        type="number"
                        value={calAge}
                        onChange={(e) => setCalAge(e.target.value)}
                        fullWidth
                        required
                      />
                      <Box sx={{ minWidth: 140 }}>
                        <RadioGroup
                          row
                          value={calGender}
                          onChange={(e) => setCalGender(e.target.value)}
                        >
                          <FormControlLabel value="male" control={<Radio size="small" />} label="Male" />
                          <FormControlLabel value="female" control={<Radio size="small" />} label="Female" />
                        </RadioGroup>
                      </Box>
                    </Stack>

                    <Stack direction="row" spacing={2}>
                      <TextField
                        label="Height (cm)"
                        type="number"
                        value={calHeight}
                        onChange={(e) => setCalHeight(e.target.value)}
                        fullWidth
                        required
                      />
                      <TextField
                        label="Weight (kg)"
                        type="number"
                        value={calWeight}
                        onChange={(e) => setCalWeight(e.target.value)}
                        fullWidth
                        required
                      />
                    </Stack>

                    <TextField
                      select
                      label="Activity Level"
                      value={calActivity}
                      onChange={(e) => setCalActivity(e.target.value)}
                      fullWidth
                    >
                      <MenuItem value="1.2">Sedentary (Little or no exercise)</MenuItem>
                      <MenuItem value="1.375">Light (Exercise 1-3 days/week)</MenuItem>
                      <MenuItem value="1.55">Moderate (Exercise 3-5 days/week)</MenuItem>
                      <MenuItem value="1.725">Active (Exercise 6-7 days/week)</MenuItem>
                      <MenuItem value="1.9">Very Active (Twice per day / Heavy athlete)</MenuItem>
                    </TextField>

                    <TextField
                      select
                      label="Your Primary Fitness Goal"
                      value={calGoal}
                      onChange={(e) => setCalGoal(e.target.value)}
                      fullWidth
                    >
                      <MenuItem value="weight_loss">Aggressive Fat Loss (-500 kcal)</MenuItem>
                      <MenuItem value="mild_cut">Moderate Cut (-250 kcal)</MenuItem>
                      <MenuItem value="maintain">Maintain Current Weight (TDEE)</MenuItem>
                      <MenuItem value="lean_bulk">Lean Muscle Gain (+300 kcal)</MenuItem>
                      <MenuItem value="bulk">Strength & Bulking (+500 kcal)</MenuItem>
                    </TextField>

                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      size="large"
                      sx={{ py: 1.5, fontSize: 16 }}
                    >
                      Calculate Macros & Calories
                    </Button>
                  </Stack>
                </form>
              </Box>

              {/* Result display */}
              <Box
                flex={1}
                sx={{
                  bgcolor: "background.subtle",
                  p: 4,
                  borderRadius: "20px",
                  border: "1px solid",
                  borderColor: "divider",
                }}
              >
                {calResult ? (
                  <Stack spacing={2.5}>
                    <Box textAlign="center">
                      <Typography variant="body2" color="text.secondary" fontWeight={600}>
                        TARGET DAILY CALORIES
                      </Typography>
                      <Typography variant="h2" fontWeight={800} color="primary.main">
                        {calResult.targetCalories}{" "}
                        <Typography component="span" variant="h5">
                          kcal
                        </Typography>
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Maintenance TDEE: {calResult.tdee} kcal | BMR: {calResult.bmr} kcal
                      </Typography>
                    </Box>

                    <Divider />

                    <Typography variant="subtitle1" fontWeight={700}>
                      Recommended Daily Macronutrients:
                    </Typography>

                    {/* Protein */}
                    <Box>
                      <Stack direction="row" justifyContent="space-between" mb={0.5}>
                        <Typography variant="body2" fontWeight={600} color="error.main">
                          🥩 Protein (High Muscle Recovery)
                        </Typography>
                        <Typography variant="body2" fontWeight={700}>
                          {calResult.proteinGrams}g ({calResult.proteinGrams * 4} kcal)
                        </Typography>
                      </Stack>
                      <LinearProgress
                        variant="determinate"
                        value={35}
                        color="error"
                        sx={{ height: 8, borderRadius: 4 }}
                      />
                    </Box>

                    {/* Carbs */}
                    <Box>
                      <Stack direction="row" justifyContent="space-between" mb={0.5}>
                        <Typography variant="body2" fontWeight={600} color="warning.main">
                          🍚 Carbohydrates (Workout Energy)
                        </Typography>
                        <Typography variant="body2" fontWeight={700}>
                          {calResult.carbGrams}g ({calResult.carbGrams * 4} kcal)
                        </Typography>
                      </Stack>
                      <LinearProgress
                        variant="determinate"
                        value={45}
                        color="warning"
                        sx={{ height: 8, borderRadius: 4 }}
                      />
                    </Box>

                    {/* Fats */}
                    <Box>
                      <Stack direction="row" justifyContent="space-between" mb={0.5}>
                        <Typography variant="body2" fontWeight={600} color="info.main">
                          🥑 Healthy Fats (Hormone Balance)
                        </Typography>
                        <Typography variant="body2" fontWeight={700}>
                          {calResult.fatGrams}g ({calResult.fatGrams * 9} kcal)
                        </Typography>
                      </Stack>
                      <LinearProgress
                        variant="determinate"
                        value={20}
                        color="info"
                        sx={{ height: 8, borderRadius: 4 }}
                      />
                    </Box>
                  </Stack>
                ) : (
                  <Stack
                    spacing={1}
                    alignItems="center"
                    justifyContent="center"
                    height="100%"
                    textAlign="center"
                  >
                    <LocalFireDepartmentIcon
                      sx={{ fontSize: 50, color: "text.secondary", opacity: 0.5 }}
                    />
                    <Typography variant="body1" color="text.secondary">
                      Fill out your stats and activity level to see your customized calorie & macronutrient breakdown.
                    </Typography>
                  </Stack>
                )}
              </Box>
            </Stack>
          </Paper>
        )}

        {/* TAB 2: ONE REP MAX (1RM) */}
        {tabIndex === 2 && (
          <Paper
            elevation={2}
            sx={{
              p: { xs: 3, md: 5 },
              borderRadius: "24px",
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <Stack direction={{ xs: "column", md: "row" }} spacing={5}>
              <Box flex={1}>
                <Typography variant="h5" fontWeight={700} gutterBottom>
                  Calculate 1-Rep Max Strength
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={3}>
                  Enter the weight you lifted and how many clean repetitions you completed (1-12 reps).
                </Typography>
                <form onSubmit={handleCalculate1RM}>
                  <Stack spacing={3}>
                    <TextField
                      label="Weight Lifted (kg / lbs)"
                      type="number"
                      value={ormWeight}
                      onChange={(e) => setOrmWeight(e.target.value)}
                      required
                      fullWidth
                    />
                    <TextField
                      label="Reps Performed (1 to 12)"
                      type="number"
                      value={ormReps}
                      onChange={(e) => setOrmReps(e.target.value)}
                      inputProps={{ min: 1, max: 15 }}
                      required
                      fullWidth
                    />
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      size="large"
                      sx={{ py: 1.5, fontSize: 16 }}
                    >
                      Calculate 1RM
                    </Button>
                  </Stack>
                </form>
              </Box>

              {/* Result display */}
              <Box
                flex={1}
                sx={{
                  bgcolor: "background.subtle",
                  p: 4,
                  borderRadius: "20px",
                  border: "1px solid",
                  borderColor: "divider",
                }}
              >
                {ormResult ? (
                  <Stack spacing={2}>
                    <Box textAlign="center" mb={1}>
                      <Typography variant="body2" color="text.secondary" fontWeight={600}>
                        ESTIMATED 1-REP MAX (1RM)
                      </Typography>
                      <Typography variant="h2" fontWeight={800} color="secondary.main">
                        {ormResult.oneRepMax}{" "}
                        <Typography component="span" variant="h5">
                          kg/lbs
                        </Typography>
                      </Typography>
                    </Box>

                    <Typography variant="subtitle2" fontWeight={700}>
                      Calculated Rep Ranges:
                    </Typography>

                    <Stack spacing={1}>
                      {ormResult.table.map((row, idx) => (
                        <Stack
                          key={idx}
                          direction="row"
                          justifyContent="space-between"
                          p={1}
                          sx={{
                            borderRadius: "10px",
                            bgcolor: idx === 0 ? "primary.main" : "background.paper",
                            color: idx === 0 ? "#fff" : "text.primary",
                          }}
                        >
                          <Typography variant="body2" fontWeight={600}>
                            {row.percentage} — {row.reps}
                          </Typography>
                          <Typography variant="body2" fontWeight={700}>
                            {row.weight} kg/lbs
                          </Typography>
                        </Stack>
                      ))}
                    </Stack>
                  </Stack>
                ) : (
                  <Stack
                    spacing={1}
                    alignItems="center"
                    justifyContent="center"
                    height="100%"
                    textAlign="center"
                  >
                    <FitnessCenterIcon
                      sx={{ fontSize: 50, color: "text.secondary", opacity: 0.5 }}
                    />
                    <Typography variant="body1" color="text.secondary">
                      Enter the weight and repetitions to estimate your maximum 1-rep lift.
                    </Typography>
                  </Stack>
                )}
              </Box>
            </Stack>
          </Paper>
        )}
      </Container>
    </Box>
  );
};

export default Calculator;
