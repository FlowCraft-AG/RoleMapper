/**
 * Interface `FacultyTheme`:
 * Definiert die Struktur eines Themas für Fakultäten.
 * Dieses Interface wird verwendet, um Farben und Stile für verschiedene Fakultäten zu definieren.
 */
export interface FacultyTheme {
  /**
   * Farbe für Trenner oder Divider-Elemente.
   * Wird z. B. für horizontale oder vertikale Linien in der UI verwendet.
   */
  divider: string;

  /**
   * Benutzerdefinierte Farbpalette für die Navigationsleiste und andere spezifische Elemente.
   */
  custom: {
    navbar: {
      /**
       * Primärfarbe der Navigationsleiste (z. B. Hintergrundfarbe).
       */
      primary: string;

      /**
       * Sekundärfarbe der Navigationsleiste (z. B. Schriftfarbe).
       */
      secondary: string;
    };

    /**
     * Farbe für ausgewählte Elemente in der Benutzeroberfläche.
     */
    selected: string;

    /**
     * Benutzerdefinierte Primärfarbe.
     * Kann für spezifische Komponenten oder Akzente verwendet werden.
     */
    primary: string;

    /**
     * Benutzerdefinierte Sekundärfarbe.
     * Kann für sekundäre Komponenten oder Akzente verwendet werden.
     */
    secondary: string;
  };

  /**
   * Primärfarbe des Themes.
   * Wird häufig als Hauptfarbe in der Benutzeroberfläche verwendet.
   */
  primary: string;

  /**
   * Sekundärfarbe des Themes.
   * Wird als ergänzende Farbe verwendet, z. B. für Schaltflächen oder Links.
   */
  secondary: string;
}
