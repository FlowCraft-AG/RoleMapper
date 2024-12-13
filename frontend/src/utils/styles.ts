export function getListItemStyles(theme: any, isSelected: boolean) {
    return {
        color: isSelected ? theme.palette.custom?.selected : theme.palette.text.primary,
        '&.Mui-selected': {
            backgroundColor: 'transparent',
        },
        '&:hover': {
            color: isSelected ? theme.palette.custom?.selected : theme.palette.text.primary,
        },
    };
}
