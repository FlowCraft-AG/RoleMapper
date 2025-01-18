import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';

/**
 * Dialog zum endgültigen Bestätigen des Löschens.
 */
export function ConfirmFinalDeleteDialog({
  open,
  onClose,
  onConfirm,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Löschvorgang bestätigen</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Sind Sie sicher, dass Sie diesen Prozess und alle zugehörigen
          Unterprozesse löschen möchten? Diese Aktion kann nicht rückgängig
          gemacht werden.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Abbrechen
        </Button>
        <Button onClick={onConfirm} color="error" variant="contained">
          Löschen
        </Button>
      </DialogActions>
    </Dialog>
  );
}
