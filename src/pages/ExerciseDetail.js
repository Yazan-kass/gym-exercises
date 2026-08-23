import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Container } from "@mui/material";

import { exerciseOptions, fetchData, youtubeOptions } from "../utils/fetchData";
import Detail from "../components/Detail";
import ExerciseVideos from "../components/ExerciseVideos";
import SimilarExercises from "../components/SimilarExercises";
import Loader from "../components/Loader";

const ExerciseDetail = () => {
  const [exerciseDetail, setExerciseDetail] = useState({});
  const [exerciseVideos, setExerciseVideos] = useState([]);
  const [targetMuscleExercises, setTargetMuscleExercises] = useState([]);
  const [equipmentExercises, setEquipmentExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });

    const fetchExercisesData = async () => {
      setLoading(true);
      try {
        const exerciseDbUrl = "https://exercisedb.p.rapidapi.com";
        const youtubeSearchUrl =
          "https://youtube-search-and-download.p.rapidapi.com";

        const exerciseDetailData = await fetchData(
          `${exerciseDbUrl}/exercises/exercise/${id}`,
          exerciseOptions
        );
        setExerciseDetail(exerciseDetailData || {});

        if (exerciseDetailData?.name) {
          const exerciseVideosData = await fetchData(
            `${youtubeSearchUrl}/search?query=${exerciseDetailData.name} exercise`,
            youtubeOptions
          );
          setExerciseVideos(exerciseVideosData?.contents || []);
        }

        if (exerciseDetailData?.target) {
          const targetMuscleExercisesData = await fetchData(
            `${exerciseDbUrl}/exercises/target/${exerciseDetailData.target}`,
            exerciseOptions
          );
          setTargetMuscleExercises(
            Array.isArray(targetMuscleExercisesData) ? targetMuscleExercisesData : []
          );
        }

        if (exerciseDetailData?.equipment) {
          const equimentExercisesData = await fetchData(
            `${exerciseDbUrl}/exercises/equipment/${exerciseDetailData.equipment}`,
            exerciseOptions
          );
          setEquipmentExercises(
            Array.isArray(equimentExercisesData) ? equimentExercisesData : []
          );
        }
      } catch (e) {
        console.error("Error fetching exercise details:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchExercisesData();
  }, [id]);

  if (loading && !exerciseDetail.name) return <Loader />;

  if (!exerciseDetail || !exerciseDetail.name) return <Box p={5}>No Data Available</Box>;

  return (
    <Container maxWidth="xl" sx={{ mt: { lg: "60px", xs: "30px" }, pb: 6 }}>
      <Detail exerciseDetail={exerciseDetail} />
      <ExerciseVideos
        exerciseVideos={exerciseVideos}
        name={exerciseDetail.name}
      />
      <SimilarExercises
        targetMuscleExercises={targetMuscleExercises}
        equipmentExercises={equipmentExercises}
      />
    </Container>
  );
};

export default ExerciseDetail;
