import { useMutation } from '@apollo/client';
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
import { useState } from 'react';
import { CREATE_FUNCTIONS } from '../../graphql/mutations/create-function';
import client from '../../lib/apolloClient';

interface ExplicitFunctionModalProps {
  open: boolean;
  onClose: () => void;
  onBack: () => void;
  orgUnit: string;
  refetch: () => void;
}

const ExplicitFunctionModal = ({
  open,
  onClose,
  onBack,
  orgUnit,
  refetch,
}: ExplicitFunctionModalProps) => {
  const [functionName, setFunctionName] = useState('');
  const [users, setUsers] = useState<string[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string | null }>({});
  const [isSingleUser, setIsSingleUser] = useState<boolean>(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });

  const [addUserToFunction] = useMutation(CREATE_FUNCTIONS, { client });

  const handleUsersChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUsers(value.split(',').map((user) => user.trim()));
  };

  const validateInput = () => {
    const newErrors: { [key: string]: string | null } = {};
    const functionNameRegex = /^[a-zA-Z]+$/; // Nur Buchstaben
    const userIdRegex = /^[a-zA-Z]{4}[0-9]{4}$/; // 4 Buchstaben + 4 Zahlen

    if (!functionName.trim()) {
      newErrors.functionName = 'Funktionsname darf nicht leer sein.';
    }

    if (!functionNameRegex.test(functionName)) {
      newErrors.functionName = 'Funktionsname darf nur Buchstaben enthalten.';
    }

    if (users.some((user) => !userIdRegex.test(user))) {
      newErrors.users =
        'Benutzer müssen 4 Buchstaben gefolgt von 4 Zahlen enthalten (z. B. gyca1011).';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (validateInput()) {
      try {
        await addUserToFunction({
          variables: {
            functionName,
            orgUnit,
            users,
            isSingleUser,
          },
        });
        refetch(); // Aktualisiere die Daten nach der Mutation
      } catch (err) {
        console.error('Fehler beim Hinzufügen des Benutzers:', err);
        setSnackbar({
          open: true,
          message: 'Fehler beim Hinzufügen des Benutzers:',
        });
      }
      resetFields(); // Eingabefelder zurücksetzen
      onClose();
    }
  };

  const resetFields = () => {
    setFunctionName('');
    setUsers([]);
    setErrors({});
    setIsSingleUser(false); // Zustand für den RadioButton zurücksetzen
  };

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

          <TextField
            label="Benutzer (Kommagetrennt)"
            value={users.join(', ')}
            onChange={handleUsersChange}
            fullWidth
            error={!!errors.users}
            helperText={errors.users}
          />

          {/* Neue RadioGroup für die Auswahl, ob es nur ein Benutzer oder mehrere sein können */}
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
