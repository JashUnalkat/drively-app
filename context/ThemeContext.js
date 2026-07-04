import React, { createContext, useState, useContext } from 'react';
import { COLORS } from '../theme/theme';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);
  
  // Select the correct set of colors based on the toggle
  const theme = isDarkMode ? COLORS.dark : COLORS;

  return (
    <ThemeContext.Provider value={{ isDarkMode, theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
