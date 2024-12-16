'use client';

import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    divider: '#ff0000', // Eigene Divider-Farbe
    text: {
      primary: '#333333',
      secondary: '#666666',
    },
    custom: {
      navbar: {
        primary: '#000', // Schwarz
        secondary: '#fff', // weiss  // Schriftfarbe für ausgewählte Elemente
      },
      selected: '#ff0000',
      primary: '#000', // Schwarz
      secondary: '#ff0000', // weiss  // Schriftfarbe für ausgewählte Elemente
    },
  },
});

declare module '@mui/material/styles' {
  interface Palette {
    custom?: {
      navbar: {
        primary: string;
        secondary: string;
      };
      selected: string;
      primary: string;
      secondary: string;
    };
  }
  interface PaletteOptions {
    custom?: {
      navbar: {
        primary: string;
        secondary: string;
      };
      selected: string;
      primary: string;
      secondary: string;
    };
  }
}

export default theme;
