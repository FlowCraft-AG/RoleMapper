'use client';

import { createTheme, ThemeProvider } from '@mui/material/styles';
import React, { createContext, useContext, useMemo, useState } from 'react';
import { FacultyTheme } from '../interfaces/facultyTheme';

/**
 * ThemeContext: Kontext für das Thema (Theme).
 * Ermöglicht den Zugriff auf die Methode `setFacultyTheme`, um das Theme dynamisch zu ändern.
 */
const ThemeContext = createContext<{
  setFacultyTheme: (theme: FacultyTheme) => void;
}>({
  setFacultyTheme: () => {},
});

/**
 * Custom Hook, um auf den Theme-Kontext zuzugreifen.
 * @returns {Object} - Enthält die Funktion `setFacultyTheme`, um das Theme zu ändern.
 */
export const useFacultyTheme = () => useContext(ThemeContext);

/**
 * ThemeProviderWrapper: Komponente, die einen Theme-Kontext bereitstellt.
 * Stellt ein dynamisches MUI-Theme basierend auf dem aktuellen `facultyTheme` zur Verfügung.
 *
 * @param {React.ReactNode} children - Die untergeordneten Komponenten, die den Theme-Kontext nutzen können.
 */
const ThemeProviderWrapper = ({ children }: { children: React.ReactNode }) => {
  // Setze das Standard-Theme auf Rot
  const [facultyTheme, setFacultyTheme] = useState<FacultyTheme>({
    divider: '#ff0000', // Farbe für Trenner
    custom: {
      navbar: {
        primary: '#000', // Hauptfarbe der Navigationsleiste
        secondary: '#fff', // Sekundärfarbe der Navigationsleiste
      },
      selected: '#ff0000', // Farbe für ausgewählte Elemente
      primary: '#ff0000', // Primärfarbe
      secondary: '#ff6666', // Sekundärfarbe
    },
    primary: '#ff0000', // Primärfarbe des Themes
    secondary: '#ff6666', // Sekundärfarbe des Themes
  });

  /**
   * Dynamisches Material-UI-Theme basierend auf dem aktuellen `facultyTheme`.
   * Die `useMemo`-Hook optimiert die Berechnung, indem das Theme nur aktualisiert wird,
   * wenn sich `facultyTheme` ändert.
   */
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
          fontFamily: 'Roboto, Arial, sans-serif', // Standard-Schriftarten
        },
      }),
    [facultyTheme],
  );

  return (
    /**
     * Der Theme-Kontext wird bereitgestellt, sodass untergeordnete Komponenten
     * die Methode `setFacultyTheme` nutzen können, um das Theme dynamisch zu ändern.
     */
    <ThemeContext.Provider value={{ setFacultyTheme }}>
      <ThemeProvider theme={dynamicTheme}>{children}</ThemeProvider>
    </ThemeContext.Provider>
  );
};

export default ThemeProviderWrapper;
