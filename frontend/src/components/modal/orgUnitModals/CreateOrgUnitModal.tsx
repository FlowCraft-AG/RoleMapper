import {
  Box,
  Button,
  Fade,
  Modal,
  Snackbar,
  TextField,
  Typography,
} from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { createOrgUnit } from '../../../lib/api/orgUnit.api';
import { fetchEmployees } from '../../../lib/api/user.api';
import { OrgUnit } from '../../../types/orgUnit.type';
import { ShortUser } from '../../../types/user.type';
import UserAutocomplete from '../../UserAutocomplete';

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
  const [formData, setFormData] = useState({ name: '', supervisor: '' });
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });
  const [userData, setUserData] = useState<ShortUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [userError, setUserError] = useState<string>('');
  const [errors, setErrors] = useState<{ [key: string]: string | undefined }>(
    {},
  );

  // Funktion zum Abrufen der Benutzer von der Serverseite
  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const employees: ShortUser[] = await fetchEmployees(); // Serverseitige Funktion aufrufen
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

  const handleCreate = async () => {
    // Name-Validierung: keine Sonderzeichen oder Zahlen, nur Buchstaben erlaubt
    const nameRegex = /^[a-zA-ZäöüÄÖÜß]+$/; // Optional: deutsche Umlaute zulassen
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
    // Regular Expression für ObjectId Validierung
    const isValidObjectId = (id: string) => /^[a-fA-F0-9]{24}$/.test(id);
    if (formData.supervisor && !isValidObjectId(formData.supervisor)) {
      setSnackbar({
        open: true,
        message:
          'Supervisor-ID muss aus genau 8 Zeichen bestehen: 4 Kleinbuchstaben gefolgt von 4 Ziffern.',
      });
      return;
    }

    try {
      console.log(
        'Erstelle Organisationseinheit...  mit Name:',
        formData.name,
        'Supervisor:',
        formData.supervisor,
        'ParentId:',
        parentId,
      );
      const updatedOrgUnits = await createOrgUnit(
        formData.name,
        formData.supervisor || undefined,
        parentId,
      ); // Serverseitige Funktion zum Erstellen der Organisationseinheit
      refetch(updatedOrgUnits); // Aktualisiere die Liste
      onClose();
      setFormData({ name: '', supervisor: '' });
    } catch (err) {
      console.error(err);
      setSnackbar({
        open: true,
        message: 'Fehler beim Erstellen der Einheit.',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      loadUsers(); // Abrufen der Benutzer beim Öffnen des Modals
    }
  }, [open, loadUsers]);

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
            <Typography variant="h6">Neue Organisationseinheit</Typography>
            <TextField
              label="Name"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              required
            />
            <UserAutocomplete
              options={userData}
              loading={loading}
              value={
                userData.find((user) => user._id === formData.supervisor) ||
                undefined
              }
              onChange={(value) => {
                if (value && !Array.isArray(value)) {
                  setFormData((prev) => ({
                    ...prev,
                    supervisor: value._id || '',
                  }));
                }
                setErrors((prev) => ({ ...prev, supervisor: undefined }));
              }}
              displayFormat="full" // Alternativ: "userId" oder "nameOnly"
              label="Supervisor"
              placeholder="Supervisor auswählen"
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button variant="outlined" onClick={onClose}>
                Abbrechen
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleCreate}
              >
                Erstellen
              </Button>
            </Box>
          </Box>
        </Fade>
      </Modal>
    </>
  );
};

export default CreateOrgUnitModal;
