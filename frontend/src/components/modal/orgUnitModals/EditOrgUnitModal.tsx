import {
  Box,
  Button,
  CircularProgress,
  Fade,
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
import UserAutocomplete from '../../utils/UserAutocomplete';

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
  const [userError, setUserError] = useState<string>('');
  const [userData, setUserData] = useState<ShortUser[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string | null }>({});

  // Supervisor-ID muss ein gültiges MongoDB ObjectId sein
  const isValidObjectId = (id: string) => /^[a-fA-F0-9]{24}$/.test(id);

  // Funktion zum Laden der Organisationseinheit
  const loadOrgUnitData = useCallback(async () => {
    setLoading(true);
    try {
      const orgUnit = await getOrgUnitById(itemId); // API-Aufruf zum Laden der Organisationseinheit
      setFormData({
        name: orgUnit.name || '',
        supervisor: orgUnit.supervisor || '', // Supervisor-ID laden
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Fehler beim Laden der Organisationseinheit.',
      });
      console.error('Fehler beim Laden der Organisationseinheit:', error);
    } finally {
      setLoading(false);
    }
  }, [itemId]); // Die Funktion wird nur beim ersten Laden ausgeführt

  // Funktion zum Abrufen der Benutzer von der Serverseite
  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const employees = await fetchEmployees(); // Serverseitige Funktion aufrufen
      setUserData(employees);
    } catch (error) {
      if (error instanceof Error) {
        setUserError(error.message);
        setSnackbar({ open: true, message: error.message });
        console.error('Fehler beim Laden der Benutzer:', userError);
      } else {
        setSnackbar({ open: true, message: 'Fehler beim Laden der Benutzer.' });
      }
    } finally {
      setLoading(false);
    }
  }, [userError]); // Die Funktion wird nur beim ersten Laden ausgeführt

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
    } finally {
      setLoading(false);
    }
  };
  if (loading)
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
        <CircularProgress />
      </Box>
    );

  return (
    <>
      <Snackbar
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
        BackdropProps={{
          timeout: 500,
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

            <UserAutocomplete
              options={userData}
              loading={loading}
              value={
                userData.find((user) => user._id === formData.supervisor) ||
                null
              }
              onChange={(value) => {
                setFormData((prev) => ({
                  ...prev,
                  supervisor: value?._id || '',
                }));
              }}
              displayFormat="full" // Alternativ: "userId" oder "nameOnly"
              label="Supervisor"
              placeholder="Supervisor auswählen"
            />

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
