'use client';

import {
  Box,
  Button,
  FormControlLabel,
  Modal,
  Radio,
  RadioGroup,
  Snackbar,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { createExplicitFunction } from '../../../lib/api/function.api';
import { fetchUserIds } from '../../../lib/api/user.api';
import { Function } from '../../../types/function.type';
import { ShortUser } from '../../../types/user.type';
import UserAutocomplete from '../../UserAutocomplete';

interface ExplicitFunctionModalProps {
  open: boolean;
  onClose: () => void;
  onBack: () => void;
  orgUnitId: string;
  refetch: (functionList: Function[]) => void;
}

const ExplicitFunctionModal = ({
  open,
  onClose,
  onBack,
  orgUnitId,
  refetch,
}: ExplicitFunctionModalProps) => {
  const [functionName, setFunctionName] = useState('');
  const [users, setUsers] = useState<ShortUser[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string | undefined }>(
    {},
  );
  const [isSingleUser, setIsSingleUser] = useState<boolean>(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });
  const [loading, setLoading] = useState(false);
  // Extrahieren der Benutzer-IDs aus der Serverseite
  const [userIds, setUserIds] = useState<ShortUser[]>([]);

  // Funktion zum Abrufen der Benutzer von der Serverseite
  const loadUsers = async () => {
    setLoading(true);
    try {
      const users: ShortUser[] = await fetchUserIds(); // Funktion von der Serverseite verwenden
      setUserIds(users);
    } catch (error) {
      console.error('Fehler beim Laden der Benutzer-IDs:', error);
      setSnackbar({
        open: true,
        message: 'Fehler beim Laden der Benutzer-IDs',
      });
    } finally {
      setLoading(false);
    }
  };

  const validateInput = () => {
    const newErrors: { [key: string]: string | undefined } = {};
    const functionNameRegex = /^[a-zA-Z ]+$/; // Funktionsname kann Leerzeichen enthalten, aber keine Sonderzeichen
    const userIdRegex = /^[a-zA-Z]{4}[0-9]{4}$/; // 4 Buchstaben + 4 Zahlen

    if (!functionName.trim()) {
      newErrors.functionName = 'Funktionsname darf nicht leer sein.';
    }

    if (!functionNameRegex.test(functionName)) {
      newErrors.functionName =
        'Funktionsname darf nur Buchstaben und Leerzeichen enthalten.';
    }

    if (users.some((user) => !userIdRegex.test(user.userId))) {
      newErrors.users =
        'Benutzer müssen 4 Buchstaben gefolgt von 4 Zahlen enthalten (z. B. gyca1011).';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateInput()) return;

    try {
      const newFunctionList = await createExplicitFunction({
        functionName,
        orgUnitId,
        users: users.map((user) => user.userId),
        isSingleUser,
      });
      refetch(newFunctionList); // Aktualisiere die Daten nach der Mutation
      setSnackbar({
        open: true,
        message: 'Explizierte Funktion erfolgreich erstellt.',
      });
      resetFields(); // Eingabefelder zurücksetzen
      onClose();
    } catch (err) {
      console.error('Fehler beim Hinzufügen des Benutzers:', err);
      setSnackbar({
        open: true,
        message: 'Fehler beim Hinzufügen des Benutzers.',
      });
    }
  };

  const resetFields = () => {
    setFunctionName('');
    setUsers([]);
    setErrors({});
    setIsSingleUser(false); // Zustand für den RadioButton zurücksetzen
  };

  useEffect(() => {
    if (open) {
      loadUsers(); // Abrufen der Benutzer beim Öffnen des Modals
    }
  }, [open]);

  return (
    <>
      <Snackbar
        open={snackbar.open}
        message={snackbar.message}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ open: false, message: '' })}
      />
      <Modal open={open} onClose={onClose}>
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
          }}
        >
          <Typography variant="h6">Explizite Funktion</Typography>
          <TextField
            label="Funktionsname"
            value={functionName}
            onChange={(e) => setFunctionName(e.target.value)}
            fullWidth
            error={!!errors.functionName}
            helperText={errors.functionName}
          />

          <UserAutocomplete
            options={userIds}
            loading={loading}
            value={users}
            onChange={(value) => setUsers(value as ShortUser[])} // Konvertiere den Wert explizit in ein Array
            displayFormat="userId" // Alternativ: "full" oder "nameOnly"
            label="Benutzer auswählen"
            placeholder="Benutzer auswählen"
            helperText={errors.users}
            multiple // Aktiviert die Mehrfachauswahl
          />

          <Typography variant="body1">
            Kann diese Funktion nur von einem Benutzer besetzt werden?
          </Typography>
          <RadioGroup
            row
            value={isSingleUser ? 'true' : 'false'}
            onChange={(e) => setIsSingleUser(e.target.value === 'true')}
          >
            <FormControlLabel value="true" control={<Radio />} label="Ja" />
            <FormControlLabel value="false" control={<Radio />} label="Nein" />
          </RadioGroup>

          <Button variant="contained" color="primary" onClick={handleSave}>
            Speichern
          </Button>
          <Button
            variant="outlined"
            sx={{ marginTop: 2 }}
            onClick={() => {
              resetFields();
              onClose();
            }}
          >
            Abbrechen
          </Button>
          <Button
            variant="outlined"
            sx={{ marginTop: 2 }}
            onClick={() => {
              resetFields();
              onBack();
            }}
          >
            Zurück
          </Button>
        </Box>
      </Modal>
    </>
  );
};

export default ExplicitFunctionModal;
