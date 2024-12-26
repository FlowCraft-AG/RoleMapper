import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Snackbar,
  TextField,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { updateOrgUnit } from '../../app/organisationseinheiten/fetchkp';
import { OrgUnit } from '../../types/orgUnit.type';

interface EditOrgUnitModalProps {
  open: boolean;
  onClose: () => void;
  itemId: string;
  refetch: (orgUnitList: OrgUnit[]) => void; // Callback zur Aktualisierung der Organisationseinheitenliste
}

const EditOrgUnitModal = ({
  open,
  onClose,
  itemId,
  refetch,
}: EditOrgUnitModalProps) => {
  const [formData, setFormData] = useState({ name: '', supervisor: '' });
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      // Hier kannst du die Organisationseinheit mit dem itemId laden (z.B. durch eine API)
      setFormData({
        name: '',
        supervisor: '',
      });
    }
  }, [open, itemId]);

  const handleSave = async () => {
    setLoading(true);
    try {
      const newOrgUnitList = await updateOrgUnit(
        itemId,
        formData.name,
        formData.supervisor,
      ); // Bearbeite die Organisationseinheit
      await refetch(newOrgUnitList); // Lade die neuesten Daten
      onClose(); // Schließe das Modal
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Fehler beim Bearbeiten der Organisationseinheit',
      });
    } finally {
      setLoading(false);
    }
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
