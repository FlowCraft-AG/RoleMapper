'use client';

import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    divider: '#ff0000', // Eigene Divider-Farbe
    text: {
      primary: '#000', // Hauptschriftfarbe
      secondary: '#ff0000', // Sekundäre Schriftfarbe
    },
    custom: {
      selected: '#ff0000', // Schriftfarbe für ausgewählte Elemente
    },
  },
});

declare module '@mui/material/styles' {
  interface Palette {
    custom?: {
      selected: string;
    };
  }
  interface PaletteOptions {
    custom?: {
      selected: string;
    };
  }
}

export default theme;
