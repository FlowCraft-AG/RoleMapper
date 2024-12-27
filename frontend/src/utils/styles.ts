import { Theme } from '@mui/material';

export function getListItemStyles(theme: Theme, isSelected: boolean) {
  return {
    color: isSelected
      ? theme.palette.custom?.selected
      : theme.palette.text.primary,
    '&.Mui-selected': {
      backgroundColor: 'transparent',
    },
    '&:hover': {
      color: isSelected
        ? theme.palette.custom?.selected
        : theme.palette.text.primary,
    },
  };
}
