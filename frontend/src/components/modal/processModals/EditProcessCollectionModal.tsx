import {
  Autocomplete,
  Box,
  Button,
  Fade,
  Modal,
  Snackbar,
  TextField,
  Typography,
} from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import {
  fetchAllProcessCollections,
  getProcessById,
  updateProcessCollection,
} from '../../../lib/api/rolemapper/process.api';
import { Process } from '../../../types/process.type';

interface EditProcessCollectionModalProps {
  open: boolean; // Gibt an, ob das Modal geöffnet ist.
  onClose: () => void; // Funktion zum Schließen des Modals.
  itemId: string; // Die zu bearbeitende Prozess-Sammlung.
  refetch: (updatedCollections: Process[]) => void; // Callback zur Aktualisierung der Prozess-Sammlungen.
}

const EditProcessCollectionModal = ({
  open,
  onClose,
  itemId,
  refetch,
}: EditProcessCollectionModalProps) => {
  const [formData, setFormData] = useState<Process>();

  const [snackbar, setSnackbar] = useState({ open: false, message: '' });
  const [processCollections, setProcessCollections] = useState<Process[]>([]);
  const [loading, setLoading] = useState(false);

  /**
   * Lädt die verfügbaren Prozess-Sammlungen.
   */
  const loadProcessCollections = useCallback(async () => {
    try {
      const selectedProcess = await getProcessById(itemId);
      setFormData(selectedProcess);
        const collections = await fetchAllProcessCollections();
        console.log('Collections: ',collections);
      setProcessCollections(collections);
    } catch (error) {
      console.error('Fehler beim Laden der Prozess-Sammlungen:', error);
      setSnackbar({
        open: true,
        message: 'Fehler beim Laden der Prozess-Sammlungen.',
      });
    }
  }, []);

  /**
   * Validiert den Namen der Prozess-Sammlung.
   *
   * @returns {boolean} Gibt `true` zurück, wenn der Name gültig ist.
   */
  const validateName = (): boolean => {
    if (!formData?.name.trim()) {
      setSnackbar({
        open: true,
        message: 'Der Name darf nicht leer sein.',
      });
      return false;
    }
    return true;
  };

  /**
   * Aktualisiert die Prozess-Sammlung.
   */
  const handleUpdate = async () => {
    if (!validateName()) return;

    setLoading(true);
    try {
      if (!formData) {
        throw new Error('Prozess-Sammlung nicht gefunden.');
      }
      const updatedCollections = await updateProcessCollection(
        itemId,
        formData.name,
        formData.parentId,
      );
      refetch(updatedCollections);
      setSnackbar({
        open: true,
        message: 'Prozess-Sammlung erfolgreich aktualisiert!',
      });
      handleClose();
    } catch (error) {
      console.error('Fehler beim Aktualisieren der Prozess-Sammlung:', error);
      setSnackbar({
        open: true,
        message: 'Fehler beim Aktualisieren der Prozess-Sammlung.',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      loadProcessCollections();
    }
  }, [open, loadProcessCollections]);

  /**
   * Schließt das Modal und setzt das Formular zurück.
   */
  const handleClose = () => {
    setFormData({
      _id: itemId,
      name: '',
      parentId: '',
    });
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
              Prozess-Sammlung bearbeiten
            </Typography>
            <TextField
              label="Name der Prozess-Sammlung"
              value={formData?.name}
              onChange={(e) =>
                setFormData((prev) => {
                  if (prev) return { ...prev, name: e.target.value };
                })
              }
              fullWidth
              required
            />
            <Autocomplete
              options={processCollections.filter(
                (collection) => collection._id !== itemId,
              )}
              getOptionLabel={(option) => option.name}
              value={
                processCollections.find(
                  (collection) => collection._id === formData?.parentId,
                ) || null
              }
              onChange={(event, newValue) =>
                setFormData((prev) => {
                  if (prev)
                    return {
                      ...prev,
                      parentId: newValue?._id,
                    };
                })
              }
              renderInput={(params) => (
                <TextField {...params} label="Übergeordnete Sammlung" />
              )}
              isOptionEqualToValue={(option, value) => option._id === value._id}
              fullWidth
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
                onClick={handleUpdate}
                disabled={loading}
              >
                {loading ? 'Speichern...' : 'Speichern'}
              </Button>
            </Box>
          </Box>
        </Fade>
      </Modal>
    </>
  );
};

export default EditProcessCollectionModal;
