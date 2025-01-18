import { AddCircleOutline, DeleteForever, Edit } from '@mui/icons-material';
import { IconButton, Stack, Tooltip, Typography } from '@mui/material';
import { useSession } from 'next-auth/react';
import { ENV } from '../../utils/env';

export interface CustomLabelProps {
  name: React.ReactNode;
  className?: string;
  onAdd: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onDelete: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onEdit: (event: React.MouseEvent<HTMLButtonElement>) => void;
  hasRoles: boolean;
}

export function CustomProcessLabel({
  name,
  className,
  onAdd,
  onDelete,
  onEdit,
  hasRoles,
}: CustomLabelProps) {
  const { data: session, update } = useSession();
  const { ADMIN_GROUP } = ENV;
  const isAdmin = session?.user.roles?.includes(ADMIN_GROUP); // Prüft, ob der Benutzer Admin ist

  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      className={className}
      spacing={2}
      flexGrow={1}
    >
      <Typography>{name}</Typography>

      {hasRoles && isAdmin && (
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
      )}
    </Stack>
  );
}
