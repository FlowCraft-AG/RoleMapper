import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { IconButton, Stack, Tooltip, Typography } from '@mui/material';
import { alpha, styled } from '@mui/material/styles';
import { treeItemClasses } from '@mui/x-tree-view/TreeItem';
import { TreeItem2, TreeItem2Props } from '@mui/x-tree-view/TreeItem2';
import { useTreeItem2 } from '@mui/x-tree-view/useTreeItem2';
import { forwardRef } from 'react';

const StyledTreeItem = styled(TreeItem2)(({ theme }) => ({
  [`& .${treeItemClasses.content}`]: {
    borderRadius: theme.spacing(0.5),
    padding: theme.spacing(0.5, 1),
    margin: theme.spacing(0.2, 0),
    [`& .${treeItemClasses.label}`]: {
      fontSize: '0.8rem',
      fontWeight: 500,
    },
  },
  [`& .${treeItemClasses.groupTransition}`]: {
    marginLeft: theme.spacing(2),
    paddingLeft: theme.spacing(2.25),
    borderLeft: `1px dashed ${alpha(theme.palette.text.primary, 0.4)}`,
  },
}));

interface CustomLabelProps {
  children: string;
  className: string;
  id: string;
}

function CustomLabel({
  children,
    className,
  id,
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
              e.stopPropagation();
              console.log(`Eintrag hinzufügen ${id}`);
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
              e.stopPropagation();
              console.log('Eintrag löschen');
            }}
          >
            <DeleteForeverIcon />
          </IconButton>
        </Tooltip>
      </Stack>
    </Stack>
  );
}

const CustomTreeItem = forwardRef(function CustomTreeItem(
  props: TreeItem2Props,
  ref: React.Ref<HTMLLIElement>,
) {
  const { publicAPI } = useTreeItem2(props);

  // Anzahl der Kinder des aktuellen Knotens ermitteln
  const childrenNumber = publicAPI.getItemOrderedChildrenIds(
    props.itemId,
  ).length;

  return (
    <StyledTreeItem
      {...props}
      ref={ref}
      slots={{
        label: CustomLabel, // Label-Slot überschreiben
      }}
      slotProps={{
        label: { children: props.label, id: props.itemId } as CustomLabelProps,
      }}
    />
  );
});

export default CustomTreeItem;
