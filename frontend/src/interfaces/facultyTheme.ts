// Definiere das Interface für das FacultyTheme
export interface FacultyTheme {
  divider: string;
  custom: {
    navbar: {
      primary: string;
      secondary: string;
    };
    selected: string;
    primary: string;
    secondary: string;
  };
  primary: string;
  secondary: string;
}
