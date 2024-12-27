import { AddCircleOutline, DeleteForever, Edit } from '@mui/icons-material';
import { IconButton, Stack, Tooltip, Typography } from '@mui/material';

export interface CustomLabelProps {
  children: React.ReactNode;
  className?: string;
  onAdd: (event: React.MouseEvent<HTMLButtonElement>) => void; // Füge die onAdd-Funktion hinzu (Callback für Add-Button)
  onDelete: (event: React.MouseEvent<HTMLButtonElement>) => void; // Füge die onDelete-Funktion hinzu (Callback für Delete-Button)
  onEdit: (event: React.MouseEvent<HTMLButtonElement>) => void; // Füge die onEdit-Funktion hinzu (Callback für Edit-Button)
}

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
