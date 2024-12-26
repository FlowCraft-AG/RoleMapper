'use client';

import { createTheme, ThemeProvider } from '@mui/material/styles';
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { FacultyTheme } from '../interfaces/facultyTheme';

const ThemeContext = createContext<{
  setFacultyTheme: (theme: FacultyTheme) => void;
}>({
  setFacultyTheme: () => {},
});

export const useFacultyTheme = () => useContext(ThemeContext);

const ThemeProviderWrapper = ({ children }: { children: React.ReactNode }) => {
  // Setze das Standard-Theme auf Rot
  const [facultyTheme, setFacultyTheme] = useState<FacultyTheme>({
    divider: '#ff0000',
    custom: {
      navbar: {
        primary: '#ffffff',
        secondary: '#000000',
      },
      selected: '#ff0000',
      primary: '#ff0000',
      secondary: '#ff6666',
    },
    primary: '#ff0000',
    secondary: '#ff6666',
  });

  // Dynamisches Theme erstellen
  const dynamicTheme = useMemo(
    () =>
      createTheme({
        palette: {
          divider: facultyTheme.divider,
          custom: facultyTheme.custom,
          primary: { main: facultyTheme.primary },
          secondary: { main: facultyTheme.secondary },
        },
        typography: {
          fontFamily: 'Roboto, Arial, sans-serif',
        },
      }),
    [facultyTheme],
  );

  // Debugging: Logge das aktuelle Theme
  useEffect(() => {
    console.log('Aktuelles Theme:', facultyTheme);
  }, [facultyTheme]);

  return (
    <ThemeContext.Provider value={{ setFacultyTheme }}>
      <ThemeProvider theme={dynamicTheme}>{children}</ThemeProvider>
    </ThemeContext.Provider>
  );
};

export default ThemeProviderWrapper;
