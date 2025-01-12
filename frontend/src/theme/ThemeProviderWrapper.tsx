'use client';

import { createTheme, ThemeProvider } from '@mui/material/styles';
import React, { createContext, useContext, useMemo, useState } from 'react';
import { FacultyTheme } from '../interfaces/facultyTheme';
import getFacultyTheme from './fakultäten';

/**
 * ThemeContext: Kontext für das Thema (Theme) und den Toggle.
 * Enthält:
 * - `setFacultyTheme`: Methode zum Setzen eines dynamischen Themes.
 * - `useCustomStyles`: Boolean, um benutzerdefinierte Stile zu aktivieren/deaktivieren.
 * - `toggleCustomStyles`: Methode, um `useCustomStyles` umzuschalten.
 */
const ThemeContext = createContext<{
  setFacultyTheme: (theme: FacultyTheme) => void;
  useCustomStyles: boolean;
  toggleCustomStyles: () => void;
}>({
  setFacultyTheme: () => {},
  useCustomStyles: true,
  toggleCustomStyles: () => {},
});

/**
 * Custom Hook, um auf den Theme-Kontext zuzugreifen.
 * @returns {Object} - Enthält:
 * - `setFacultyTheme`: Methode zum Setzen eines Themes.
 * - `useCustomStyles`: Boolean für den Toggle.
 * - `toggleCustomStyles`: Methode, um den Toggle umzuschalten.
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

  // Toggle-State für benutzerdefinierte Stile
  const [useCustomStyles, setUseCustomStyles] = useState(true);

  /**
   * Umschalten zwischen benutzerdefinierten und Standard-Stilen.
   */
  const toggleCustomStyles = () => {
    setUseCustomStyles((prev) => !prev);
  };

  /**
   * Standard-Theme (bei deaktiviertem Toggle).
   */
  const defaultTheme = getFacultyTheme('default');

  /**
   * Dynamisches Material-UI-Theme basierend auf dem aktuellen `facultyTheme`.
   * Die `useMemo`-Hook optimiert die Berechnung, indem das Theme nur aktualisiert wird,
   * wenn sich `facultyTheme` ändert.
   *
   * Wenn `useCustomStyles` deaktiviert ist, wird das Standard-Theme verwendet.
   */
  const dynamicTheme = useMemo(
    () =>
      createTheme({
        palette: useCustomStyles
          ? {
              divider: facultyTheme.divider,
              custom: facultyTheme.custom,
              primary: { main: facultyTheme.primary },
              secondary: { main: facultyTheme.secondary },
            }
          : {
              divider: defaultTheme.divider,
              custom: defaultTheme.custom,
              primary: { main: defaultTheme.primary },
              secondary: { main: defaultTheme.secondary },
            },
        typography: {
          fontFamily: 'Roboto, Arial, sans-serif',
        },
      }),
    [facultyTheme, useCustomStyles],
  );

  return (
    /**
     * Der Theme-Kontext wird bereitgestellt, sodass untergeordnete Komponenten
     * die Methode `setFacultyTheme` nutzen können, um das Theme dynamisch zu ändern.
     */
    <ThemeContext.Provider
      value={{
        setFacultyTheme,
        useCustomStyles,
        toggleCustomStyles,
      }}
    >
      <ThemeProvider theme={dynamicTheme}>{children}</ThemeProvider>
    </ThemeContext.Provider>
  );
};

export default ThemeProviderWrapper;
