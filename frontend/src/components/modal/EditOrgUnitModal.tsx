import { useMutation } from '@apollo/client';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Snackbar,
  TextField,
} from '@mui/material';
import { useState } from 'react';
import { UPDATE_ORG_UNIT } from '../../graphql/mutations/org-unit.mutation';
import client from '../../lib/apolloClient';

interface EditOrgUnitModalProps {
  open: boolean;
  onClose: () => void;
  itemId: string;
  refetch: () => void;
}

const EditOrgUnitModal = ({
  open,
  onClose,
  itemId,
  refetch,
}: EditOrgUnitModalProps) => {
  const [formData, setFormData] = useState({ name: '', supervisor: '' });
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });

  const [updateOrgUnit] = useMutation(UPDATE_ORG_UNIT, { client });

  const handleSave = () => {
    // GraphQL-Mutation hier ausführen, z. B. UPDATE_ORG_UNIT
    updateOrgUnit({
      variables: {
        name: formData.name,
        supervisor: formData.supervisor || null,
        id: itemId,
      },
    })
      .then(() => {
        refetch();
        onClose();
        setFormData({ name: '', supervisor: '' });
      })
      .catch((err) => {
        console.error(err);
        setSnackbar({
          open: true,
          message: 'Fehler beim Aktuallisieren der Einheit.',
        });
      });
    refetch(); // Daten neu laden
    onClose(); // Modal schließen
  };

  return (
    <>
      <Snackbar
        open={snackbar.open}
        message={snackbar.message}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ open: false, message: '' })}
      />
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Organisationseinheit bearbeiten</DialogTitle>
        <DialogContent>
          <TextField
            label="Name"
            value={formData.name}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, name: e.target.value }))
            }
            fullWidth
          />
          <TextField
            label="Supervisor"
            value={formData.supervisor}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                supervisor: e.target.value,
              }))
            }
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Abbrechen</Button>
          <Button onClick={handleSave} color="primary">
            Speichern
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default EditOrgUnitModal;
