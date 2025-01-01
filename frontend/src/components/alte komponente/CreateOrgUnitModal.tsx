import { SwapHoriz } from '@mui/icons-material';
import {
  Box,
  Button,
  Fade,
  IconButton,
  Modal,
  Snackbar,
  TextField,
  Typography,
} from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { fetchAllFunctions } from '../../lib/api/function.api';
import { createOrgUnit } from '../../lib/api/orgUnit.api';
import { fetchEmployees } from '../../lib/api/user.api';
import { FunctionString } from '../../types/function.type';
import { OrgUnit } from '../../types/orgUnit.type';
import { ShortUser } from '../../types/user.type';
import UserAutocomplete from '../UserAutocomplete';

// Separate Ladezustände für Benutzer und Erstellung.
// Direktes Feedback bei Validierung.
// Deaktivierter Button bei ungültigen Eingaben.
// Verbessertes Fehlerhandling mit konsistenter Logik.

interface CreateOrgUnitModalProps {
  open: boolean;
  onClose: () => void;
  parentId: string;
  refetch: (orgUnitList: OrgUnit[]) => void; // Callback zur Aktualisierung der Organisationseinheitenliste
}

const CreateOrgUnitModal = ({
  open,
  onClose,
  parentId,
  refetch, // Callback zur Aktualisierung der Liste
}: CreateOrgUnitModalProps) => {
  const [formData, setFormData] = useState<{
    name: string;
    supervisor?: string;
  }>({
    name: '',
    supervisor: undefined,
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });
  const [userData, setUserData] = useState<ShortUser[]>([]);
  const [userLoading, setUserLoading] = useState(false);
  const [creationLoading, setCreationLoading] = useState(false);
  const [displayFormat, setDisplayFormat] = useState<'userId' | 'nameOnly'>(
    'userId',
  ); // Zustand für die Anzeige

  // Funktion zum Abrufen der Benutzer von der Serverseite
  const loadUsers = useCallback(async () => {
    setUserLoading(true);
    try {
      // Mappe displayFormat zu den unterstützten Werten für fetchEmployees
      const fetchFormat = displayFormat === 'nameOnly' ? 'lastName' : 'userId';
      const employees: ShortUser[] = await fetchEmployees(fetchFormat); // Serverseitige Funktion aufrufen
      const functionList: FunctionString[] = await fetchAllFunctions(); // Serverseitige Funktion aufrufen
      console.log(functionList);
      setUserData(employees);
    } catch (error) {
      logError('Fehler beim Laden der Benutzer:', error);
    } finally {
      setUserLoading(false);
    }
  }, [displayFormat]); // Die Funktion wird nur beim ersten Laden ausgeführt

  const handleCreate = async () => {
    // Name-Validierung: keine Sonderzeichen oder Zahlen, nur Buchstaben erlaubt
    const nameRegex = /^[a-zA-ZäöüÄÖÜß]+$/; // Optional: deutsche Umlaute zulassen
    // Regular Expression für ObjectId Validierung
    const isValidObjectId = (id: string) => /^[a-fA-F0-9]{24}$/.test(id);

    if (!formData.name || !nameRegex.test(formData.name)) {
      setSnackbar({
        open: true,
        message:
          'Name darf nur Buchstaben enthalten und keine Sonderzeichen oder Zahlen.',
      });
      return;
    }

    // Supervisor-Validierung: genau 8 Zeichen, erste 4 Kleinbuchstaben, letzte 4 Ziffern
    //const supervisorRegex = /^[a-z]{4}[0-9]{4}$/;

    if (formData.supervisor && !isValidObjectId(formData.supervisor)) {
      setSnackbar({
        open: true,
        message:
          'Die Supervisor-ID muss eine gültige ObjectId (24 Zeichen aus Hexadezimalzahlen) sein.',
      });
      return;
    }

    setCreationLoading(true);
    try {
      const updatedOrgUnits = await createOrgUnit(
        formData.name,
        formData.supervisor,
        parentId,
      ); // Serverseitige Funktion zum Erstellen der Organisationseinheit
      refetch(updatedOrgUnits); // Aktualisiere die Liste
      setSnackbar({
        open: true,
        message: 'Organisationseinheit erfolgreich erstellt!',
      });
      handleClose();
    } catch (err) {
      if (err instanceof Error) {
        console.error(err.message);
        setSnackbar({
          open: true,
          message: err.message,
        });
      } else {
        console.error('Unknown error', err);
        setSnackbar({
          open: true,
          message: 'Ein unbekannter Fehler ist aufgetreten.',
        });
      }
    } finally {
      setCreationLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      loadUsers(); // Abrufen der Benutzer beim Öffnen des Modals
    }
  }, [open, loadUsers]);

  const logError = (message: string, error: unknown) => {
    console.error(message, error);
    setSnackbar({
      open: true,
      message: typeof error === 'string' ? error : message,
    });
  };

  const toggleDisplayFormat = () => {
    setDisplayFormat((prev) => (prev === 'userId' ? 'nameOnly' : 'userId'));
  };

  const handleClose = () => {
    setFormData({ name: '', supervisor: undefined });
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
        disableEscapeKeyDown={false}
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
              borderRadius: 2,
              p: 4,
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              width: 400,
              boxShadow: 24,
              height: 300,
            }}
          >
            <Typography variant="h6">Neue Organisationseinheit</Typography>
            <TextField
              label="Name"
              value={formData.name}
              error={
                !/^[a-zA-ZäöüÄÖÜß]+$/.test(formData.name) &&
                formData.name !== ''
              }
              helperText={
                !/^[a-zA-ZäöüÄÖÜß]+$/.test(formData.name) &&
                formData.name !== ''
                  ? 'Name darf nur Buchstaben enthalten.'
                  : ''
              }
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              required
            />
            <Box display="flex" alignItems="center">
              <Box sx={{ flexGrow: 1 }}>
                <UserAutocomplete
                  options={userData}
                  loading={userLoading}
                  value={
                    userData.find((user) => user._id === formData.supervisor) ||
                    null
                  }
                  onChange={(value) => {
                    if (value && typeof value === 'object' && '_id' in value) {
                      setFormData((prev) => ({
                        ...prev,
                        supervisor: value._id,
                      }));
                    } else {
                      setFormData((prev) => ({
                        ...prev,
                        supervisor: null,
                      }));
                    }
                  }}
                  displayFormat={displayFormat} // Alternativ: "userId" oder "nameOnly" oder "full"
                  label={
                    displayFormat === 'userId'
                      ? 'Supervisor-ID auswählen'
                      : 'Supervisor-Name auswählen'
                  } // Dynamisches Label
                  placeholder={
                    displayFormat === 'userId'
                      ? 'Supervisor-ID auswählen'
                      : 'Supervisor-Name auswählen'
                  } // Dynamischer Placeholder
                />
              </Box>
              <Box sx={{ flexShrink: 1 }}>
                <IconButton onClick={toggleDisplayFormat}>
                  <SwapHoriz />
                </IconButton>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button variant="outlined" onClick={handleClose}>
                Abbrechen
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleCreate}
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

export default CreateOrgUnitModal;
