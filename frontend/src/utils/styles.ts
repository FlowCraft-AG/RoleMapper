import { Theme } from '@mui/material';

/**
 * Funktion zur Generierung von Stildefinitionen für Listenelemente.
 * Diese Funktion verwendet das aktuelle Theme und den ausgewählten Status des Listenelements,
 * um dynamische Stile zu erstellen.
 *
 * @param {Theme} theme - Das aktuelle Material-UI-Theme.
 * @param {boolean} isSelected - Gibt an, ob das Listenelement ausgewählt ist.
 * @returns {Object} - Ein Objekt mit CSS-Eigenschaften für das Listenelement.
 */
export function getListItemStyles(theme: Theme, isSelected: boolean) {
  return {
    color: isSelected
      ? theme.palette.custom?.selected // Verwendet die benutzerdefinierte Farbe für ausgewählte Elemente
      : theme.palette.text.primary, // Standard-Textfarbe aus dem Theme
    '&.Mui-selected': {
      backgroundColor: 'transparent', // Keine Hintergrundfarbe für ausgewählte Elemente
    },
    '&:hover': {
      color: isSelected
        ? theme.palette.custom?.selected // Beibehaltung der ausgewählten Farbe beim Hover
        : theme.palette.text.primary, // Standard-Hover-Farbe
    },
  };
}
