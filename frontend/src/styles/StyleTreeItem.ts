import { alpha, styled } from '@mui/material';
import { treeItemClasses } from '@mui/x-tree-view/TreeItem';
import { TreeItem2 } from '@mui/x-tree-view/TreeItem2';

export const StyledTreeItem = styled(TreeItem2)(({ theme }) => ({
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
