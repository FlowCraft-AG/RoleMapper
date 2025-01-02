/**
 * @file CustomLabel.tsx
 * @description Eine flexible Komponente zur Anzeige eines benutzerdefinierten Labels mit Aktionen wie Hinzufügen, Bearbeiten und Löschen.
 *
 * @module CustomLabel
 */

import { AddCircleOutline, DeleteForever, Edit } from '@mui/icons-material';
import { IconButton, Stack, Tooltip, Typography } from '@mui/material';

/**
 * Props für die `CustomLabel`-Komponente.
 *
 * @interface CustomLabelProps
 * @property {React.ReactNode} children - Der Inhalt, der im Label angezeigt wird.
 * @property {string} [className] - Optionale CSS-Klasse für zusätzliche Stile.
 * @property {function} onAdd - Callback-Funktion, die beim Klicken auf den Hinzufügen-Button aufgerufen wird.
 * @property {function} onDelete - Callback-Funktion, die beim Klicken auf den Löschen-Button aufgerufen wird.
 * @property {function} onEdit - Callback-Funktion, die beim Klicken auf den Bearbeiten-Button aufgerufen wird.
 */
export interface CustomLabelProps {
  children: React.ReactNode;
  className?: string;
    onAdd: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onDelete: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onEdit: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

/**
 * `CustomLabel`-Komponente
 *
 * Diese Komponente stellt ein flexibles Label bereit, das drei Hauptaktionen unterstützt:
 * Hinzufügen, Bearbeiten und Löschen.
 *
 * @component
 * @param {CustomLabelProps} props - Die Props der Komponente.
 * @returns {JSX.Element} Die JSX-Struktur des benutzerdefinierten Labels.
 *
 * @example
 * <CustomLabel
 *   onAdd={() => console.log('Eintrag hinzufügen')}
 *   onDelete={() => console.log('Eintrag löschen')}
 *   onEdit={() => console.log('Eintrag bearbeiten')}
 * >
 *   Mein Label
 * </CustomLabel>
 */
export function CustomLabel({
  children,
  className,
  onAdd,
  onDelete,
  onEdit,
}: CustomLabelProps) {
  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      className={className}
      spacing={2}
      flexGrow={1}
    >
      <Typography>{children}</Typography>
      <Stack direction="row" spacing={1}>
        <Tooltip title="Eintrag hinzufügen">
          <IconButton
            edge="end"
            color="primary"
            onClick={(e) => {
              e.stopPropagation(); // Blockiere Event nur für den Button
              onAdd(e);
            }}
          >
            <AddCircleOutline />
          </IconButton>
        </Tooltip>

        <Tooltip title="Eintrag bearbeiten">
          <IconButton
            edge="end"
            color="secondary"
            onClick={(e) => {
              e.stopPropagation(); // Blockiere Event nur für den Button
              onEdit(e); // Aufruf der Edit-Funktion
            }}
          >
            <Edit />
          </IconButton>
        </Tooltip>

        <Tooltip title="Eintrag löschen">
          <IconButton
            edge="end"
            color="error"
            onClick={(e) => {
              e.stopPropagation(); // Blockiere Event nur für den Button
              onDelete(e);
            }}
          >
            <DeleteForever />
          </IconButton>
        </Tooltip>
      </Stack>
    </Stack>
  );
}
