import React, { createContext, useContext, useState, useEffect } from "react";

const FavoritesContext = createContext();

export const useFavorites = () => useContext(FavoritesContext);

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem("gym_favorites");
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Failed to parse favorites from localStorage", e);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("gym_favorites", JSON.stringify(favorites));
    } catch (e) {
      console.error("Failed to save favorites to localStorage", e);
    }
  }, [favorites]);

  const isFavorite = (id) => {
    return favorites.some((item) => String(item.id) === String(id));
  };

  const toggleFavorite = (exercise) => {
    setFavorites((prev) => {
      const exists = prev.some((item) => String(item.id) === String(exercise.id));
      if (exists) {
        return prev.filter((item) => String(item.id) !== String(exercise.id));
      } else {
        return [
          {
            id: exercise.id,
            name: exercise.name,
            gifUrl: exercise.gifUrl,
            bodyPart: exercise.bodyPart,
            target: exercise.target,
            equipment: exercise.equipment,
          },
          ...prev,
        ];
      }
    });
  };

  const removeFavorite = (id) => {
    setFavorites((prev) => prev.filter((item) => String(item.id) !== String(id)));
  };

  const clearFavorites = () => {
    setFavorites([]);
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        toggleFavorite,
        isFavorite,
        removeFavorite,
        clearFavorites,
        favoritesCount: favorites.length,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};
