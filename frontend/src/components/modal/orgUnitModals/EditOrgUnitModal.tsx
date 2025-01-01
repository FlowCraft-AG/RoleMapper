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
import { getOrgUnitById, updateOrgUnit } from '../../../lib/api/orgUnit.api';
import { fetchEmployees } from '../../../lib/api/user.api';
import { OrgUnit } from '../../../types/orgUnit.type';
import { ShortUser } from '../../../types/user.type';
import UserAutocomplete from '../../UserAutocomplete';

// Ladeindikator wurde aufgeteilt, um Benutzerfreundlichkeit zu verbessern.
// Fehlerhandling wurde konsolidiert.
// Snackbar und UX optimiert.
// Mehrfachauswahl vorbereitet, falls erforderlich.

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
  const [displayFormat, setDisplayFormat] = useState<'userId' | 'nameOnly'>(
    'userId',
  ); // Zustand für die Anzeige

  const handleError = (message: string, error: unknown) => {
    console.error(message, error);
    setSnackbar({
      open: true,
      message: message,
    });
  };

  // Supervisor-ID muss ein gültiges MongoDB ObjectId sein
  const isValidObjectId = (id: string) => /^[a-fA-F0-9]{24}$/.test(id);

  // Funktion zum Laden der Organisationseinheit
  const loadOrgUnitData = useCallback(async () => {
    try {
      const orgUnit = await getOrgUnitById(itemId); // API-Aufruf zum Laden der Organisationseinheit
      console.log(orgUnit);
      setFormData({
        name: orgUnit.name || '',
        supervisor: orgUnit.supervisor, // Supervisor-ID laden
      });
    } catch (error) {
      handleError('Fehler beim Laden der Benutzer:', error);
    }
  }, [itemId]); // Die Funktion wird nur beim ersten Laden ausgeführt

  // Funktion zum Abrufen der Benutzer von der Serverseite
  const loadUsers = useCallback(async () => {
    setUserLoading(true);
    try {
      // Mappe displayFormat zu den unterstützten Werten für fetchEmployees
      const fetchFormat = displayFormat === 'nameOnly' ? 'lastName' : 'userId';
      const employees: ShortUser[] = await fetchEmployees(fetchFormat); // Serverseitige Funktion aufrufen
      setUserData(employees);
    } catch (error) {
      handleError('Fehler beim Laden der Benutzer:', error);
    } finally {
      setUserLoading(false);
    }
  }, [displayFormat]); // Die Funktion wird nur beim ersten Laden ausgeführt

  useEffect(() => {
    if (open) {
      loadOrgUnitData(); // Lade Daten der Organisationseinheit
      loadUsers(); // Abrufen der Benutzer beim Öffnen des Modals
    }
  }, [open, itemId, loadOrgUnitData, loadUsers]);

  const handleSave = async () => {
    if (!formData.name) {
      setSnackbar({
        open: true,
        message: 'Name darf nicht leer sein.',
      });
      return;
    }

    if (formData.supervisor && !isValidObjectId(formData.supervisor)) {
      setSnackbar({
        open: true,
        message: 'Supervisor-ID muss ein gültiges MongoDB ObjectId sein.',
      });
      return;
    }

    try {
      const newOrgUnitList = await updateOrgUnit(
        itemId,
        formData.name,
        formData.supervisor,
      ); // Bearbeite die Organisationseinheit
      await refetch(newOrgUnitList); // Lade die neuesten Daten
      onClose(); // Schließe das Modal
    } catch (error) {
      if (error instanceof Error) {
        setSnackbar({
          open: true,
          message: error.message,
        });
      } else {
        setSnackbar({
          open: true,
          message: 'Ein Fehler ist aufgetreten.',
        });
      }
    }
  };

  const toggleDisplayFormat = () => {
    setDisplayFormat((prev) => (prev === 'userId' ? 'nameOnly' : 'userId'));
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
        onClose={onClose}
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
            <Typography variant="h6">
              Organisationseinheit bearbeiten
            </Typography>
            <TextField
              label="Name"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              fullWidth
            />

            <Box display="flex" alignItems="center">
              <Box sx={{ flexGrow: 1 }}>
                <UserAutocomplete
                  options={userData}
                  loading={userLoading}
                  multiple={false} // Kann auf `true` gesetzt werden
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
              <Button variant="outlined" onClick={onClose}>
                Abbrechen
              </Button>
              <Button variant="contained" color="primary" onClick={handleSave}>
                Erstellen
              </Button>
            </Box>
          </Box>
        </Fade>
      </Modal>
    </>
  );
};

export default EditOrgUnitModal;
