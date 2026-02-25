import React, { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const getInitialTheme = () => {
    const savedTheme = localStorage.getItem("themeMode");
    if (savedTheme) {
      return savedTheme;
    }
    return "light";
  };

  const getInitialImageMode = () => {
    const savedImageMode = localStorage.getItem("ImageMode");
    if (savedImageMode) {
      return savedImageMode;
    }
    return "cover";
  };

  const [theme, setTheme] = useState(getInitialTheme);
  const [imageMode, setImageMode] = useState(getInitialImageMode);

  useEffect(() => {
    const root = document.documentElement;

    if (theme === "dark") {
      root.classList.add("darkMode");
    } else {
      root.classList.remove("darkMode");
    }

    localStorage.setItem("themeMode", theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("ImageMode", imageMode);
  }, [imageMode]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const setLight = () => setTheme("light");
  const setDark = () => setTheme("dark");

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleTheme,
        setLight,
        setDark,
        setImageMode,
        imageMode,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);

