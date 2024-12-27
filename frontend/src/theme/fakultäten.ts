// Standard-Farben für Fakultäten
export const facultyThemes = {
  default: {
    divider: '#ff0000', // Standard-Divider-Farbe
    custom: {
      navbar: {
        primary: '#000000',
        secondary: '#ffffff',
      },
      selected: '#ff0000',
      primary: '#000000',
      secondary: '#ffffff',
    },
    primary: '#ff0000', // Rot
    secondary: '#ff4081', // Pink
  },
  'Architektur und Bauwesen': {
    divider: '#246D4D', // Leichtes Grün
    custom: {
      navbar: {
        primary: '#000', // Dunkles Grün
        secondary: '#98FB98', // Hellgrün
      },
      selected: '#246D4D',
      primary: '#246D4D',
      secondary: '#98FB98',
    },
    primary: '#246D4D',
    secondary: '#98FB98',
  },
  'Elektrotechnik und Informationstechnik': {
    divider: '#98FB98', // Hellgrün
    custom: {
      navbar: {
        primary: '#000', // Dunkles Grün
        secondary: '#006400', // Dunkles Grün
      },
      selected: '#98FB98',
      primary: '#98FB98',
      secondary: '#ADFF2F',
    },
    primary: '#98FB98',
    secondary: '#ADFF2F',
  },
  'Informatik und Wirtschaftsinformatik': {
    divider: '#DDA0DD', // Leicht mattes Violett
    custom: {
      navbar: {
        primary: '#800080', // Dunkles Violett
        secondary: '#E6E6FA', // Lavendel
      },
      selected: '#DDA0DD',
      primary: '#DDA0DD',
      secondary: '#E6E6FA',
    },
    primary: '#DDA0DD',
    secondary: '#E6E6FA',
  },
  'Informationsmanagement und Medien': {
    divider: '#F409EC',
    custom: {
      navbar: {
        primary: '#4B0082', // Indigo
        secondary: '#fff', // Orchidee
      },
      selected: '#F409EC',
      primary: '#F409EC',
      secondary: '#DA70D6',
    },
    primary: '#F409EC',
    secondary: '#DA70D6',
  },
  'Maschinenbau und Mechatronik': {
    divider: '#3282FF',
    custom: {
      navbar: {
        primary: '#000',
        secondary: '#B0E0E6', // Himmelblau
      },
      selected: '#3282FF',
      primary: '#3282FF',
      secondary: '#B0E0E6',
    },
    primary: '#3282FF',
    secondary: '#B0E0E6',
  },
  Wirtschaftswissenschaften: {
    divider: '#002BC4', // Dunkles Blau
    custom: {
      navbar: {
        primary: '#fff',
        secondary: '#6495ED', // Kornblumenblau
      },
      selected: '#002BC4',
      primary: '#002BC4',
      secondary: '#6495ED',
    },
    primary: '#002BC4',
    secondary: '#6495ED',
  },
} as const;

// Typ für die Schlüssel von facultyThemes
type FacultyThemeKey = keyof typeof facultyThemes;

// Funktion, um das Theme für eine Fakultät zu bekommen
const getFacultyTheme = (key: string) => {
  return key in facultyThemes
    ? facultyThemes[key as FacultyThemeKey]
    : facultyThemes.default;
};

export default getFacultyTheme;
