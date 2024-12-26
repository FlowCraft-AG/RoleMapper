'use client';

import { createTheme } from '@mui/material/styles';

const hkaTheme = createTheme({
  palette: {
    divider: '#ff0000', // Eigene Divider-Farbe
    text: {
      primary: '#333333',
      secondary: '#666666',
    },
    custom: {
      navbar: {
        primary: '#000000', // Schwarz
        secondary: '#ffffff', // Weiß
      },
      selected: '#ff0000',
      primary: '#000000', // Schwarz
      secondary: '#ffffff', // Weiß
    },
    primary: {
      main: '#1976d2', // Blau
    },
    secondary: {
      main: '#ff4081', // Pink
    },
    error: {
      main: '#d32f2f', // Rot
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
  },
  transitions: {
    duration: {
      standard: 500, // 500ms Übergang
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

export default hkaTheme;
