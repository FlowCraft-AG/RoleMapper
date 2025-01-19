import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';

/**
 * Dialog zum Anzeigen der Warnung, welche Kinder-Prozesse gelöscht werden.
 */
export function ConfirmChildrenDeleteDialog({
  open,
  onClose,
  onConfirm,
  childrenToDelete,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  childrenToDelete: { id?: string; label: string }[];
}) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Prozesse und Unterprozesse löschen</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Folgende Prozesse und Unterprozesse werden gelöscht:
        </DialogContentText>
        <List>
          {childrenToDelete.map((child) => (
            <ListItem key={child.id}>
              <ListItemText primary={child.label} />
            </ListItem>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Abbrechen
        </Button>
        <Button onClick={onConfirm} color="error" variant="contained">
          Weiter
        </Button>
      </DialogActions>
    </Dialog>
  );
}
