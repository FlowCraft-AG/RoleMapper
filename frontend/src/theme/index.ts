'use client';

import { createTheme } from '@mui/material/styles';

/**
 * Definiert das benutzerdefinierte HKA-Theme für die Anwendung.
 * Dieses Theme verwendet die Material-UI-Design-Richtlinien und erweitert die Standard-Palette
 * um benutzerdefinierte Farben für die Navigationsleiste und ausgewählte Elemente.
 */
const hkaTheme = createTheme({
  palette: {
    divider: '#ff0000', // Eigene Divider-Farbe
    text: {
      primary: '#333333', // Hauptfarbe für Text (dunkelgrau)
      secondary: '#666666', // Sekundärfarbe für Text (grau)
    },
    custom: {
      navbar: {
        primary: '#000000', // Navigationsleisten-Hauptfarbe (schwarz)
        secondary: '#ffffff', // Navigationsleisten-Sekundärfarbe (weiß)
      },
      selected: '#ff0000', // Farbe für ausgewählte Elemente (rot)
      primary: '#000000', // Benutzerdefinierte Hauptfarbe (schwarz)
      secondary: '#ffffff', // Benutzerdefinierte Sekundärfarbe (weiß)
    },
    primary: {
      main: '#1976d2', // Hauptfarbe für Primärelemente (blau)
    },
    secondary: {
      main: '#ff4081', // Hauptfarbe für Sekundärelemente (pink)
    },
    error: {
      main: '#d32f2f', // Farbe für Fehlerzustände (rot)
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif', // Schriftarten für die gesamte Anwendung
  },
  transitions: {
    duration: {
      standard: 500, // Standardübergangsdauer in Millisekunden
    },
  },
});

/**
 * Erweiterung der Material-UI-Typdefinitionen, um benutzerdefinierte Farben zu unterstützen.
 * Fügt der Palette eine `custom`-Eigenschaft hinzu, die Farben für die Navigationsleiste,
 * ausgewählte Elemente und benutzerdefinierte Primär-/Sekundärfarben enthält.
 */
declare module '@mui/material/styles' {
  interface Palette {
    custom?: {
      navbar: {
        primary: string; // Hauptfarbe der Navigationsleiste
        secondary: string; // Sekundärfarbe der Navigationsleiste
      };
      selected: string; // Farbe für ausgewählte Elemente
      primary: string; // Benutzerdefinierte Primärfarbe
      secondary: string; // Benutzerdefinierte Sekundärfarbe
    };
  }
  interface PaletteOptions {
    custom?: {
      navbar: {
        primary: string; // Hauptfarbe der Navigationsleiste
        secondary: string; // Sekundärfarbe der Navigationsleiste
      };
      selected: string; // Farbe für ausgewählte Elemente
      primary: string; // Benutzerdefinierte Primärfarbe
      secondary: string; // Benutzerdefinierte Sekundärfarbe
    };
  }
}

export default hkaTheme;
