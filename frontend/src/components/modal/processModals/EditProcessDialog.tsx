'use client';

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';
import { JSX, useState } from 'react';

interface EditProcessDialogProps {
  open: boolean;
  onClose: () => void;
  processName: string;
  processParentId: string;
  onSave: (name: string, parentId: string) => void;
}

export default function EditProcessDialog({
  open,
  onClose,
  processName,
  processParentId,
  onSave,
}: EditProcessDialogProps): JSX.Element {
  const [name, setName] = useState(processName);
  const [parentId, setParentId] = useState(processParentId);

  const handleSave = () => {
    onSave(name, parentId);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Prozess ändern</DialogTitle>
      <DialogContent>
        <TextField
          label="Prozessname"
          fullWidth
          margin="dense"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          label="ParentID"
          fullWidth
          margin="dense"
          value={parentId}
          onChange={(e) => setParentId(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Abbrechen
        </Button>
        <Button onClick={handleSave} color="primary">
          Speichern
        </Button>
      </DialogActions>
    </Dialog>
  );
}
