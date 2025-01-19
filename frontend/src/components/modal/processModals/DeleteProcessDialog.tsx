'use client';

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import { JSX } from 'react';

interface DeleteProcessDialogProps {
  open: boolean;
  onClose: () => void;
  onDelete: () => void;
}

export default function DeleteProcessDialog({
  open,
  onClose,
  onDelete,
}: DeleteProcessDialogProps): JSX.Element {
  const handleDelete = () => {
    onDelete();
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Prozess löschen</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Möchten Sie diesen Prozess wirklich löschen? Diese Aktion kann nicht
          rückgängig gemacht werden.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Abbrechen
        </Button>
        <Button onClick={handleDelete} color="error">
          Löschen
        </Button>
      </DialogActions>
    </Dialog>
  );
}
