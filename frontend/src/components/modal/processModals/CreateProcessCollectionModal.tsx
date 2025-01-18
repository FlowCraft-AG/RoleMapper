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
import {
  createProcess,
  createProcessCollection,
} from '../../../lib/api/rolemapper/process.api';

/**
 * Props für die `CreateProcessCollectionModal`-Komponente.
 */
interface CreateProcessCollectionModalProps {
  open: boolean; // Gibt an, ob das Modal geöffnet ist.
  onClose: () => void; // Funktion zum Schließen des Modals.
  parentId?: string; // Die ID der übergeordneten Prozess-Sammlung.
  refetch: () => Promise<void>; // Callback zur Aktualisierung der Prozesse.
}

/**
 * Modal-Komponente zur Erstellung einer neuen Prozess-Sammlung und eines optionalen Prozesses.
 *
 * @component
 * @param {CreateProcessCollectionModalProps} props - Die Props der Komponente.
 * @returns {JSX.Element} Die JSX-Struktur des Modals.
 */
const CreateProcessCollectionModal = ({
  open,
  onClose,
  parentId,
  refetch,
}: CreateProcessCollectionModalProps): JSX.Element => {
  const [collectionName, setCollectionName] = useState<string>(''); // Name der Prozess-Sammlung
  const [processName, setProcessName] = useState<string>(''); // Name des Prozesses
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });
  const [creationLoading, setCreationLoading] = useState(false);

  /**
   * Validiert den Namen der Prozess-Sammlung oder des Prozesses.
   *
   * @param {string} name - Der zu validierende Name.
   * @returns {boolean} Gibt `true` zurück, wenn der Name gültig ist.
   */
  const validateName = (name: string): boolean => {
    if (!name || !/^[a-zA-ZäöüÄÖÜß0-9\s]+$/.test(name)) {
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
   * Handhabt die Erstellung einer neuen Prozess-Sammlung und eines optionalen Prozesses.
   */
  const handleCreate = async () => {
    if (!validateName(collectionName)) return;
    if (processName && !validateName(processName)) return;

    setCreationLoading(true);
    try {
      // Erstelle die Prozess-Sammlung
      const id = await createProcessCollection(collectionName, parentId);

      // Erstelle den optionalen Prozess, falls ein Name angegeben wurde
      if (processName) {
        await createProcess(processName, id, []); // Leeres Rollen-Array übergeben
      }

      if (refetch) {
        await refetch(); // Aktualisiere die Liste
      }

      setSnackbar({
        open: true,
        message: 'Prozess-Sammlung und Prozess erfolgreich erstellt!',
      });
      handleClose();
    } catch (error) {
      console.error('Fehler beim Erstellen:', error);
      setSnackbar({
        open: true,
        message: 'Fehler beim Erstellen der Daten.',
      });
    } finally {
      setCreationLoading(false);
    }
  };

  /**
   * Schließt das Modal und setzt die Eingabefelder zurück.
   */
  const handleClose = () => {
    setCollectionName('');
    setProcessName('');
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
              Neue Prozess-Sammlung
            </Typography>
            <TextField
              label="Name der Prozess-Sammlung"
              value={collectionName}
              error={
                !/^[a-zA-ZäöüÄÖÜß0-9\s]+$/.test(collectionName) &&
                collectionName !== ''
              }
              helperText={
                !/^[a-zA-ZäöüÄÖÜß0-9\s]+$/.test(collectionName) &&
                collectionName !== ''
                  ? 'Der Name darf nur Buchstaben, Zahlen und Leerzeichen enthalten.'
                  : ''
              }
              onChange={(e) => setCollectionName(e.target.value)}
              fullWidth
              required
            />
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
              Optional: Neuer Prozess
            </Typography>
            <TextField
              label="Name des Prozesses"
              value={processName}
              error={
                !/^[a-zA-ZäöüÄÖÜß0-9\s]+$/.test(processName) &&
                processName !== ''
              }
              helperText={
                !/^[a-zA-ZäöüÄÖÜß0-9\s]+$/.test(processName) &&
                processName !== ''
                  ? 'Der Name darf nur Buchstaben, Zahlen und Leerzeichen enthalten.'
                  : ''
              }
              onChange={(e) => setProcessName(e.target.value)}
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

export default CreateProcessCollectionModal;
