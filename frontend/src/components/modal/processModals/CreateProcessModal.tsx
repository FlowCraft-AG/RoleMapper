/**
 * @file CreateProcessCollectionModal.tsx
 * @description Modal-Komponente zur Erstellung einer neuen Prozess-Sammlung.
 *
 * @module CreateProcessCollectionModal
 */

import {
  Box,
  Button,
  Fade,
  Modal,
  Snackbar,
  TextField,
  Typography,
} from '@mui/material';
import { JSX, useState } from 'react';
import { createProcess } from '../../../lib/api/rolemapper/process.api';

/**
 * Props für die `CreateProcessCollectionModal`-Komponente.
 */
interface CreateProcessCollectionModalProps {
  open: boolean; // Gibt an, ob das Modal geöffnet ist.
  onClose: () => void; // Funktion zum Schließen des Modals.
  parentId?: string; // Die ID der übergeordneten Prozess-Sammlung.
  refetch?: () => Promise<void>; // Callback zur Aktualisierung der Prozesse.
}

/**
 * Modal-Komponente zur Erstellung einer neuen Prozess-Sammlung.
 *
 * @component
 * @param {CreateProcessCollectionModalProps} props - Die Props der Komponente.
 * @returns {JSX.Element} Die JSX-Struktur des Modals.
 *
 * @example
 * <CreateProcessCollectionModal
 *   open={true}
 *   onClose={() => console.log('Modal schließen')}
 *   parentId="12345"
 *   refetch={() => console.log('Prozesse aktualisiert')}
 * />
 */
const CreateProcessModal = ({
  open,
  onClose,
  parentId,
  refetch,
}: CreateProcessCollectionModalProps): JSX.Element => {
  const [formData, setFormData] = useState<{ name: string }>({ name: '' });
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });
  const [creationLoading, setCreationLoading] = useState(false);

  /**
   * Validiert den Namen der Prozess-Sammlung.
   *
   * @returns {boolean} Gibt `true` zurück, wenn der Name gültig ist.
   */
  const validateName = (): boolean => {
    if (!formData.name || !/^[a-zA-ZäöüÄÖÜß0-9\s]+$/.test(formData.name)) {
      setSnackbar({
        open: true,
        message:
          'Der Name darf nur Buchstaben, Zahlen und Leerzeichen enthalten.',
      });
      return false;
    }
    return true;
  };

  /**
   * Erstellt eine neue Prozess-Sammlung.
   */
  const handleCreate = async () => {
    if (!validateName()) return;

    setCreationLoading(true);
    try {
      await createProcess(formData.name, parentId, []);
      if (refetch) {
        await refetch(); // Aktualisiere die Prozess-Liste
      }
      setSnackbar({
        open: true,
        message: 'Prozess-Sammlung erfolgreich erstellt!',
      });
      handleClose();
    } catch (error) {
      console.error('Fehler beim Erstellen:', error);
      setSnackbar({
        open: true,
        message: 'Fehler beim Erstellen der Prozess-Sammlung.',
      });
    } finally {
      setCreationLoading(false);
    }
  };

  /**
   * Schließt das Modal und setzt das Formular zurück.
   */
  const handleClose = () => {
    setFormData({ name: '' });
    onClose();
  };

  return (
    <>
      <Snackbar
        key={snackbar.message}
        open={snackbar.open}
        message={snackbar.message}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ open: false, message: '' })}
      />

      <Modal
        open={open}
        onClose={handleClose}
        closeAfterTransition
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={open}>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              bgcolor: 'background.paper',
              borderRadius: 3,
              p: 4,
              display: 'flex',
              flexDirection: 'column',
              gap: 3,
              width: '90%',
              maxWidth: 500,
              boxShadow: 8,
            }}
          >
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
              Neuer Prozess:
            </Typography>
            <TextField
              label="Name des Prozesses"
              value={formData.name}
              error={
                !/^[a-zA-ZäöüÄÖÜß0-9\s]+$/.test(formData.name) &&
                formData.name !== ''
              }
              helperText={
                !/^[a-zA-ZäöüÄÖÜß0-9\s]+$/.test(formData.name) &&
                formData.name !== ''
                  ? 'Der Name darf nur Buchstaben, Zahlen und Leerzeichen enthalten.'
                  : ''
              }
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              fullWidth
              required
            />
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                mt: 2,
              }}
            >
              <Button variant="outlined" onClick={handleClose}>
                Abbrechen
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleCreate}
                disabled={creationLoading}
              >
                {creationLoading ? 'Erstellen...' : 'Erstellen'}
              </Button>
            </Box>
          </Box>
        </Fade>
      </Modal>
    </>
  );
};

export default CreateProcessModal;
