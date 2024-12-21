import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { IconButton, Stack, Tooltip, Typography } from '@mui/material';
import { TreeItem2Props } from '@mui/x-tree-view/TreeItem2';
import { ReactElement } from 'react';

export interface ItemToRender {
  label: string;
  itemId: string;
  id?: string; // Kann undefined sein
  children?: ItemToRender[]; // Rekursive Definition für verschachtelte Kinder
}

interface ChildProp {
  itemsToRender?: ItemToRender[]; // Optional, falls es fehlen könnte
}

interface CustomTreeItemProps extends TreeItem2Props {
  refetch: () => void;
  children?: ReactElement<ChildProp>[] | ReactElement<ChildProp>;
}

interface CustomLabelProps {
  children: React.ReactNode;
  className?: string;
  onAdd: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onDelete: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export function CustomLabel({
  children,
  className,
  onAdd,
  onDelete,
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
            <AddCircleOutlineIcon />
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
            <DeleteForeverIcon />
          </IconButton>
        </Tooltip>
      </Stack>
    </Stack>
  );
}
