import React, { createContext, useContext, useState, useEffect } from "react";

const PlannerContext = createContext();

export const usePlanner = () => useContext(PlannerContext);

const DEFAULT_SCHEDULE = {
  Monday: { title: "Chest & Triceps", exercises: [] },
  Tuesday: { title: "Back & Biceps", exercises: [] },
  Wednesday: { title: "Legs & Core", exercises: [] },
  Thursday: { title: "Shoulders & Arms", exercises: [] },
  Friday: { title: "Full Body / Cardio", exercises: [] },
  Saturday: { title: "Active Recovery", exercises: [] },
  Sunday: { title: "Rest Day", exercises: [] },
};

export const PlannerProvider = ({ children }) => {
  const [schedule, setSchedule] = useState(() => {
    try {
      const saved = localStorage.getItem("gym_weekly_planner");
      return saved ? JSON.parse(saved) : DEFAULT_SCHEDULE;
    } catch (e) {
      console.error("Failed to parse weekly planner from localStorage", e);
      return DEFAULT_SCHEDULE;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("gym_weekly_planner", JSON.stringify(schedule));
    } catch (e) {
      console.error("Failed to save weekly planner to localStorage", e);
    }
  }, [schedule]);

  const addExerciseToDay = (day, exercise, customDetails = {}) => {
    setSchedule((prev) => {
      const currentDay = prev[day] || { title: day, exercises: [] };
      const alreadyAdded = currentDay.exercises.some(
        (ex) => String(ex.id) === String(exercise.id)
      );

      if (alreadyAdded) return prev;

      const newExerciseItem = {
        id: exercise.id,
        name: exercise.name,
        gifUrl: exercise.gifUrl,
        bodyPart: exercise.bodyPart,
        target: exercise.target,
        equipment: exercise.equipment,
        sets: customDetails.sets || 3,
        reps: customDetails.reps || "10-12",
        weight: customDetails.weight || "",
        completed: false,
        addedAt: new Date().toISOString(),
      };

      return {
        ...prev,
        [day]: {
          ...currentDay,
          exercises: [...currentDay.exercises, newExerciseItem],
        },
      };
    });
  };

  const removeExerciseFromDay = (day, exerciseId) => {
    setSchedule((prev) => {
      const currentDay = prev[day];
      if (!currentDay) return prev;
      return {
        ...prev,
        [day]: {
          ...currentDay,
          exercises: currentDay.exercises.filter(
            (ex) => String(ex.id) !== String(exerciseId)
          ),
        },
      };
    });
  };

  const toggleExerciseCompleted = (day, exerciseId) => {
    setSchedule((prev) => {
      const currentDay = prev[day];
      if (!currentDay) return prev;
      return {
        ...prev,
        [day]: {
          ...currentDay,
          exercises: currentDay.exercises.map((ex) =>
            String(ex.id) === String(exerciseId)
              ? { ...ex, completed: !ex.completed }
              : ex
          ),
        },
      };
    });
  };

  const updateExerciseDetails = (day, exerciseId, updates) => {
    setSchedule((prev) => {
      const currentDay = prev[day];
      if (!currentDay) return prev;
      return {
        ...prev,
        [day]: {
          ...currentDay,
          exercises: currentDay.exercises.map((ex) =>
            String(ex.id) === String(exerciseId) ? { ...ex, ...updates } : ex
          ),
        },
      };
    });
  };

  const setDayTitle = (day, title) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: {
        ...(prev[day] || { exercises: [] }),
        title,
      },
    }));
  };

  const clearDay = (day) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: {
        ...(prev[day] || {}),
        exercises: [],
      },
    }));
  };

  const resetWeeklyProgress = () => {
    setSchedule((prev) => {
      const updated = {};
      Object.keys(prev).forEach((day) => {
        updated[day] = {
          ...prev[day],
          exercises: prev[day].exercises.map((ex) => ({
            ...ex,
            completed: false,
          })),
        };
      });
      return updated;
    });
  };

  return (
    <PlannerContext.Provider
      value={{
        schedule,
        addExerciseToDay,
        removeExerciseFromDay,
        toggleExerciseCompleted,
        updateExerciseDetails,
        setDayTitle,
        clearDay,
        resetWeeklyProgress,
      }}
    >
      {children}
    </PlannerContext.Provider>
  );
};
